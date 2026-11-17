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

## Staging only
- Branch: `audit/staging-hardening-v1`
- Build command: `npm run build`
- Output directory: `dist`
- Configure a separate Cloudflare Pages project or branch preview. Do not change the production project or production branch.
- Use a dedicated Supabase staging project. Apply `supabase/schema.sql` in its SQL Editor, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the staging environment only.
- Never place a Supabase service-role key in browser environment variables.

## Current prototype scope
Responsive landing page, four subject sample quizzes, general mini test, searchable resource catalogue, premium storefront placeholders, optional email/password account and progress panel. Payments, paid-file delivery and admin CMS are not enabled.

## Security limitations to resolve before production
- Current sample question bank and correct answers are included in the browser bundle so the sample quiz can render explanations. This is not suitable for high-stakes tests; a production exam engine must fetch question text/options from a trusted backend and validate submissions server-side without exposing answer keys.
- The private answer-key table and RPC protect the database write path from clients inventing `is_correct` values, but do not hide answers already shipped to the frontend.
- Existing historical attempts are retained; their correctness cannot be independently verified if originally supplied by the old browser client.
- The database migration must be applied and tested against a dedicated staging Supabase project before authentication/progress sync can be considered verified.

## CI
GitHub Actions runs `npm install` and `npm run build` on pushes and pull requests to the staging-hardening branch. A passing build does not replace browser, accessibility, database RLS or security testing.
