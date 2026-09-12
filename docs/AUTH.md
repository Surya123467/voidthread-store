# Authentication and roles

Supabase Auth manages credentials. `profiles.role` controls application authorization.

- owner — full business administration
- admin — catalogue/inventory/orders
- staff — day-to-day operations
- customer — reserved for future customer accounts

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Admin server actions call `requireAdmin()` before mutating data. RLS provides a second authorization layer.
