# Deployment

## Environments

- Local: developer machine, mock mode or Supabase dev project
- Staging: Vercel preview/staging + non-live Razorpay keys
- Production: custom domain + live Supabase + live Razorpay

## Vercel

Connect the GitHub repository. Configure environment variables separately for Preview and Production. Never reuse development service-role secrets outside the intended environment.

## Git workflow

Use short feature branches, pull requests, and merge to `main` only after build/type checks pass. Vercel preview deployments should be reviewed before production merge.
