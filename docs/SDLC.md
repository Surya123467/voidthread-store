# SDLC

1. Requirements — business flows, catalogue, payments, fulfilment, admin roles.
2. Design — UX, database, trust boundaries, integration contracts.
3. Implementation — short feature branches and reviewed pull requests.
4. Verification — typecheck, build, API/integration tests, manual checkout tests.
5. Staging — Vercel preview with non-live payment credentials.
6. Release — merge to `main`, production environment variables, smoke test.
7. Operate — monitor errors/payments/orders/stock, back up data, apply dependency/security updates.
8. Improve — analytics-driven product/UX changes through the same branch/PR process.

No production database change should be made manually without also recording it as a migration in `supabase/migrations`.
