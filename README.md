# UPSSSC Maths Pathshala

Mobile-first, Hindi-first education website for UPSSSC, PET, Lekhpal, VDO, Auditor, SSC, UP Police and Railway aspirants.

## Stack
- React 18 + Vite 6
- Responsive custom CSS
- Static frontend suitable for Cloudflare Pages
- No paid API, database or runtime dependency

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```
Output directory: `dist`.

## Cloudflare Pages deployment
- Production branch: `main` (merge reviewed changes before switching)
- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

## Current release scope
The site includes a responsive landing page, subject overview cards, a three-question interactive sample quiz, searchable study catalogue, premium storefront placeholders and social links. Resource actions remain disabled until real files and secure delivery are available.

## Not production-ready for commerce
Checkout, payment verification, student authentication, admin content management, protected file delivery, persistent mock-test attempts and a complete privacy/terms/refund workflow are not implemented. Do not accept payments or upload paid PDFs into public static assets until secure server-side access controls are implemented.

## Security principles
- Never put payment secrets or API keys in browser code.
- Never place paid PDFs in the public asset directory.
- Verify payment status server-side before granting entitlements.
- Deliver paid files through authenticated, time-limited access.
- Publish accurate privacy, terms, refund and affiliate disclosures before collecting personal data or payments.

## Cost
This starter has no paid dependencies. Cloudflare and GitHub free tiers have quotas and terms. Domain registration, payment processing and some third-party services may cost money; zero infrastructure cost is not a guarantee of zero operating cost.

## Student accounts and progress (Supabase)
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.example` in local development and Cloudflare Pages environment variables.
4. Enable email/password authentication and configure the email confirmation redirect URL for your deployed site.
5. Redeploy after setting environment variables.

The browser uses only the Supabase anon/publishable key. Never expose the service-role key. Row Level Security limits quiz-attempt reads and inserts to the authenticated student's own user ID. The current prototype saves the subject quiz attempts; the full topic/question-bank dashboard and historical charts are follow-on work. Supabase is configured by the project owner; account creation remains unavailable until valid environment variables and SQL schema are installed.
