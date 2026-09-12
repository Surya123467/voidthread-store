create extension if not exists pgcrypto;

create type public.app_role as enum ('owner','admin','staff','customer');
create type public.product_status as enum ('draft','active','archived');
create type public.order_status as enum ('pending_payment','confirmed','paid','packing','shipped','delivered','cancelled','refunded');
create type public.payment_method as enum ('prepaid','cod');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  subtitle text not null default '',
  description text not null default '',
  story text not null default '',
  price_in_paise integer not null check(price_in_paise >= 0),
  compare_at_price_in_paise integer,
  status public.product_status not null default 'draft',
  collection_name text not null default 'Archive',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  sku text not null unique,
  stock_quantity integer not null default 0 check(stock_quantity >= 0),
  created_at timestamptz not null default now(),
  unique(product_id,size,color)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  position integer not null default 0
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  payment_method public.payment_method not null,
  status public.order_status not null,
  subtotal_in_paise integer not null,
  cod_fee_in_paise integer not null default 0,
  shipping_in_paise integer not null default 0,
  total_in_paise integer not null,
  gateway_order_id text,
  gateway_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid not null references public.product_variants(id),
  sku text not null,
  product_name text not null,
  size text not null,
  color text not null,
  quantity integer not null check(quantity > 0),
  unit_price_in_paise integer not null,
  line_total_in_paise integer not null
);

create table public.audit_log (
  id bigserial primary key,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index products_status_idx on public.products(status);
create index product_variants_product_idx on public.product_variants(product_id);
create index orders_created_idx on public.orders(created_at desc);
create index orders_status_idx on public.orders(status);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.audit_log enable row level security;

create policy "public read active products" on public.products for select using(status='active');
create policy "public read variants" on public.product_variants for select using(exists(select 1 from public.products p where p.id=product_id and p.status='active'));
create policy "public read product images" on public.product_images for select using(exists(select 1 from public.products p where p.id=product_id and p.status='active'));
create policy "profile self read" on public.profiles for select using(auth.uid()=id);

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in ('owner','admin','staff'));
$$;

create policy "staff manage products" on public.products for all using(public.is_staff()) with check(public.is_staff());
create policy "staff manage variants" on public.product_variants for all using(public.is_staff()) with check(public.is_staff());
create policy "staff manage images" on public.product_images for all using(public.is_staff()) with check(public.is_staff());
create policy "staff read orders" on public.orders for select using(public.is_staff());
create policy "staff update orders" on public.orders for update using(public.is_staff()) with check(public.is_staff());
create policy "staff read order items" on public.order_items for select using(public.is_staff());
create policy "staff read audit" on public.audit_log for select using(public.is_staff());

create or replace function public.create_checkout_order(
  p_payment_method text,
  p_customer jsonb,
  p_lines jsonb,
  p_cod_fee_in_paise integer default 0
) returns table(order_id uuid, order_number text, total_in_paise integer)
language plpgsql security definer set search_path=public as $$
declare
  v_order uuid;
  v_number text;
  v_subtotal integer := 0;
  item jsonb;
  v_variant public.product_variants%rowtype;
  v_product public.products%rowtype;
  v_qty integer;
begin
  if p_payment_method not in ('prepaid','cod') then raise exception 'Invalid payment method'; end if;
  if jsonb_array_length(p_lines)=0 then raise exception 'Cart is empty'; end if;

  for item in select * from jsonb_array_elements(p_lines) loop
    v_qty := (item->>'quantity')::integer;
    if v_qty < 1 or v_qty > 10 then raise exception 'Invalid quantity'; end if;
    select * into v_variant from public.product_variants where id=(item->>'variantId')::uuid for update;
    if not found then raise exception 'Variant not found'; end if;
    select * into v_product from public.products where id=v_variant.product_id and status='active';
    if not found then raise exception 'Product unavailable'; end if;
    if v_variant.stock_quantity < v_qty then raise exception 'Insufficient stock for %', v_variant.sku; end if;
    v_subtotal := v_subtotal + (v_product.price_in_paise * v_qty);
  end loop;

  v_number := 'VT-' || to_char(clock_timestamp(),'YYMMDDHH24MISS') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,4));
  insert into public.orders(order_number,customer_name,customer_email,customer_phone,shipping_address,payment_method,status,subtotal_in_paise,cod_fee_in_paise,total_in_paise)
  values(v_number,coalesce(p_customer->>'name',''),coalesce(p_customer->>'email',''),coalesce(p_customer->>'phone',''),p_customer,
    p_payment_method::public.payment_method,case when p_payment_method='cod' then 'confirmed'::public.order_status else 'pending_payment'::public.order_status end,
    v_subtotal,case when p_payment_method='cod' then p_cod_fee_in_paise else 0 end,v_subtotal + case when p_payment_method='cod' then p_cod_fee_in_paise else 0 end)
  returning id into v_order;

  for item in select * from jsonb_array_elements(p_lines) loop
    v_qty := (item->>'quantity')::integer;
    select * into v_variant from public.product_variants where id=(item->>'variantId')::uuid for update;
    select * into v_product from public.products where id=v_variant.product_id;
    insert into public.order_items(order_id,product_id,variant_id,sku,product_name,size,color,quantity,unit_price_in_paise,line_total_in_paise)
    values(v_order,v_product.id,v_variant.id,v_variant.sku,v_product.name,v_variant.size,v_variant.color,v_qty,v_product.price_in_paise,v_product.price_in_paise*v_qty);
    if p_payment_method='cod' then update public.product_variants set stock_quantity=stock_quantity-v_qty where id=v_variant.id; end if;
  end loop;
  return query select v_order,v_number,v_subtotal + case when p_payment_method='cod' then p_cod_fee_in_paise else 0 end;
end; $$;

create or replace function public.mark_order_paid(p_order_id uuid,p_payment_id text)
returns void language plpgsql security definer set search_path=public as $$
declare item record; v_stock integer;
begin
  if exists(select 1 from public.orders where id=p_order_id and status='paid') then return; end if;
  for item in select * from public.order_items where order_id=p_order_id loop
    select stock_quantity into v_stock from public.product_variants where id=item.variant_id for update;
    if v_stock < item.quantity then raise exception 'Inventory conflict for %', item.sku; end if;
    update public.product_variants set stock_quantity=stock_quantity-item.quantity where id=item.variant_id;
  end loop;
  update public.orders set status='paid',gateway_payment_id=p_payment_id,updated_at=now() where id=p_order_id and payment_method='prepaid';
end; $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-images','product-images',true,10485760,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict(id) do nothing;

create policy "public product image read" on storage.objects for select using(bucket_id='product-images');
create policy "staff product image upload" on storage.objects for insert with check(bucket_id='product-images' and public.is_staff());
create policy "staff product image update" on storage.objects for update using(bucket_id='product-images' and public.is_staff());
create policy "staff product image delete" on storage.objects for delete using(bucket_id='product-images' and public.is_staff());

revoke all on function public.create_checkout_order(text,jsonb,jsonb,integer) from public, anon, authenticated;
grant execute on function public.create_checkout_order(text,jsonb,jsonb,integer) to service_role;
revoke all on function public.mark_order_paid(uuid,text) from public, anon, authenticated;
grant execute on function public.mark_order_paid(uuid,text) to service_role;
revoke all on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated, service_role;
