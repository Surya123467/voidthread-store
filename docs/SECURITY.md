# Security checklist

- Keep all secrets in environment variables.
- Use Supabase RLS even when server-side authorization exists.
- Validate every checkout request server-side.
- Recalculate price from the database.
- Verify Razorpay signatures with timing-safe comparison.
- Verify Razorpay webhook signatures against the raw body.
- Limit image MIME types and size.
- Add rate limiting/WAF rules before large campaigns.
- Add CSP/security headers after final analytics/payment domains are known.
- Do not log full payment payloads or sensitive customer data.
- Review access to production Supabase/Vercel/Razorpay accounts regularly.
