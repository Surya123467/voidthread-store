# VOID//THREAD Store

A production-oriented high-end streetwear ecommerce platform built with Next.js, Supabase/PostgreSQL, Razorpay and Vercel.

The placeholder brand name `VOID//THREAD` is configurable through `NEXT_PUBLIC_SITE_NAME` and can be changed without restructuring the application.

## What is included

- High-end responsive storefront
- Product catalogue and dynamic product pages
- Size/color variants with stock quantities
- Persistent browser cart
- Checkout for prepaid and Cash on Delivery
- Razorpay order creation, signature verification and webhook verification
- Google Pay / PhonePe / UPI support through Razorpay Checkout when enabled on the merchant account
- PostgreSQL schema with RLS policies
- Transactional stock checks to reduce overselling
- Supabase Auth roles for owner/admin/staff
- Admin dashboard, products, inventory and orders areas
- Product image uploads to Supabase Storage
- Audit log table
- Mock-data mode for credential-free local/staging design review
- Environment template and operational documentation

## Stack

- Next.js 16.3.3 / React 19.2 / TypeScript
- Tailwind CSS
- Supabase: PostgreSQL, Auth, Storage
- Razorpay
- Vercel
- GitHub

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

Without Supabase/Razorpay credentials the storefront runs in safe mock mode. `/admin` is available as a read-only preview. Mutating admin actions require Supabase.

## Cloud setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_store.sql` in the SQL editor (or with Supabase CLI).
3. Optionally run `supabase/seed.sql`.
4. Create the first Auth user and set its `profiles.role` to `owner`.
5. Add Supabase environment variables.
6. Create a Razorpay account/test keys and add the Razorpay variables.
7. Configure Razorpay webhook to `/api/webhooks/razorpay`.
8. Deploy to Vercel and configure the same environment variables there.

## Environment variables

See `.env.example`. Never commit real secrets.

## Key folders

- `src/app` — routes, storefront, checkout, admin, APIs
- `src/components` — reusable UI and cart state
- `src/lib` — store adapters, auth and Supabase clients
- `supabase/migrations` — database schema and security policies
- `docs` — architecture, operations and deployment notes

## Production gate

Do not accept real orders until:

- Supabase migration is applied
- owner account is created
- Razorpay KYC/merchant setup is complete
- live keys/webhook secret are configured
- checkout is tested with Razorpay test mode
- COD policy and shipping/serviceability rules are finalized
- return/refund/privacy/terms pages are reviewed
- custom domain, monitoring and backups are configured
