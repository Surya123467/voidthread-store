# Architecture

## Request flow

Instagram / search / direct link → Vercel CDN → Next.js App Router → storefront/server routes → Supabase PostgreSQL/Storage/Auth + Razorpay.

Public catalogue reads may be cached later. Inventory/order writes remain server-side and transactional.

## Trust boundaries

The browser is never trusted for price, stock or payment success. Checkout sends only variant IDs and quantities. The server/database recalculates prices and locks stock rows. Razorpay success is verified by HMAC signature; webhook payloads are independently verified.

## Data ownership

PostgreSQL is the source of truth for products, variants, inventory and orders. Supabase Storage holds product media. Razorpay is the payment processor, not the order database.

## Scaling path

V1 keeps one Next.js application and one PostgreSQL database. Add Redis, queues, background workers, read replicas or dedicated search only when real load requires them. CDN/cacheable catalogue traffic should absorb the majority of anonymous browsing.
