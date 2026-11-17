# UPSSSC Maths Pathshala

Hindi-first, mobile-first exam preparation website for UPSSSC PET, Lekhpal, VDO, Auditor, SSC, UP Police and Railway aspirants.

## Stack
- React 18 + Vite 6
- Responsive custom CSS
- Cloudflare Pages compatible static frontend
- Optional Supabase email/password authentication and quiz progress

## Local development
```bash
npm install
npm run dev
```
Build and preview:
```bash
npm run build
npm run preview
```
Output directory: `dist`.

## Staging only
- Branch: `audit/staging-hardening-v1`
- Build command: `npm run build`
- Output directory: `dist`
- Configure a separate Cloudflare Pages project or branch preview. Do not change the production project or production branch.
- Use a dedicated Supabase staging project. Apply `supabase/schema.sql` in its SQL Editor, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the staging environment only.
- Never put a Supabase service-role key in browser environment variables.

## Current prototype scope
Responsive landing page, four subject sample quizzes, general mini test, searchable resource catalogue, premium storefront placeholders, optional email/password account and progress panel. Payments, paid-file delivery and admin CMS are not enabled.

## Security limitations before production
- Sample questions, options and correct answers are shipped in the frontend bundle so the current prototype can render instant explanations. This is not suitable for high-stakes assessments. A production exam engine must fetch questions/options from a trusted backend and validate submissions server-side without exposing answer keys.
- The private answer-key table and RPC prevent browser clients from directly inserting claimed correctness values, but do not hide answers already included in the frontend.
- Historical attempts from the earlier browser-trusted implementation are retained and cannot be independently verified.
- The SQL migration is for a dedicated staging Supabase project and must be applied and tested there before account/progress sync is considered verified.

## CI
GitHub Actions builds this branch on pushes and pull requests. A passing build does not replace browser, accessibility, database RLS or security testing.

## Commerce
Checkout, payment verification, paid-file delivery, admin CMS, complete privacy policy, terms and refund workflow are not implemented. Do not accept payments or put paid PDFs in public static assets until secure server-side access controls are in place.
