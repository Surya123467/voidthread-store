# Maintenance guide

## Change the brand name

Set `NEXT_PUBLIC_SITE_NAME`. Replace metadata/copy as desired; no database migration is needed.

## Add a product

Use `/admin/products/new` after Supabase is connected. Team members do not need GitHub access for catalogue operations.

## Change storefront code

Clone the GitHub repository, create a feature branch, run `npm install` and `npm run dev`, commit, push, review the Vercel preview, then merge.

## Backups

Enable an appropriate Supabase backup/PITR plan before meaningful sales volume. Export catalogue/order records periodically according to your business retention policy.
