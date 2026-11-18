# UPSSSC Maths Pathshala

Hindi-first, mobile-first exam preparation website for UPSSSC PET, Lekhpal, VDO, Auditor, SSC, UP Police and Railway aspirants.

## Stack
- React 18 + Vite 6
- Responsive custom CSS
- Cloudflare Pages static frontend
- Optional Supabase email/password authentication and quiz progress

## Local development
```bash
npm ci
npm run dev
```
Build and local preview:
```bash
npm run build
npm run preview
```
Output directory: `dist`.

## Isolated staging deployment (never production)
- Staging release branch: `staging` (promoted from `integration/staging-release-2026-11-18`)
- Dedicated Pages project name: `upsssc-maths-pathshala-staging`
- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Workflow: `.github/workflows/staging-release.yml`
- GitHub environment: `staging`
- Required environment secret: `CLOUDFLARE_ACCOUNT_ID`
- Required environment secret: `CLOUDFLARE_API_TOKEN` (Cloudflare Pages deploy permissions only)
- Required environment variable: `CLOUDFLARE_STAGING_PROJECT=upsssc-maths-pathshala-staging`

The release workflow runs only for the dedicated integration branch and deploys to the hard-coded `upsssc-maths-pathshala-staging` Cloudflare Pages project. It never deploys to the production Pages project. Configure the GitHub Actions `staging` environment with `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` secrets. Optional Supabase staging variables are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. If Supabase is not configured, the site remains a read-only public preview; once configured, the learning area is restricted to invited student logins.

Use a dedicated Supabase staging project. Apply `supabase/schema.sql` in its SQL Editor, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the GitHub Actions staging environment as repository/environment variables if runtime account features are being tested. Never put a Supabase service-role key in browser variables.

## Current prototype scope
Responsive landing page, subject quizzes, general mini test, searchable resource catalogue, 30-question PDF worksheet generator (verified bank + deterministic variations), optional email/password account and progress panel. AI-provider integration, payment verification, paid-file delivery and admin CMS are not enabled.

## Security limitations before production
- Sample questions, options and correct answers are shipped in the frontend bundle so the prototype can render instant explanations. This is not suitable for high-stakes assessments. A production exam engine must fetch questions/options from a trusted backend and validate submissions server-side without exposing answer keys.
- The private answer-key table and RPC prevent browser clients from directly inserting claimed correctness values, but do not hide answers already included in the frontend.
- Historical attempts from the earlier browser-trusted implementation are retained and cannot be independently verified.
- SQL must be applied and tested only in a dedicated Supabase staging project before account/progress sync is considered verified.

## Staging CI and preview
The build workflow is isolated to the audit branch and a separately named Cloudflare Pages project. A successful deployment produces a branch preview URL under the dedicated project's `pages.dev` domain. Check the GitHub Actions run and Cloudflare deployment record for the actual URL; do not infer a URL before successful deployment.

## Commerce
Checkout, payment verification, paid-file delivery, admin CMS, complete privacy policy, terms and refund workflow are not implemented. Do not accept payments or put paid PDFs in public static assets until secure server-side access controls are in place.


## Automated PDF worksheet generator (staging)
The worksheet builder defaults to 30 questions, supports mixed or subject-specific practice, increases difficulty across each worksheet, and includes answer key and explanations in the same PDF. It uses a verified sample bank plus deterministic arithmetic variations; it does not call an external AI model. Adaptive difficulty based on server-verified student performance and paid entitlements require backend configuration and are not represented as active in this prototype. Freemium currently means up to 30 downloadable questions per worksheet; no payment or premium gate is active.


## Integrated staging release
This branch combines the audited mobile-first UI, quiz progress persistence, worksheet generator, KaTeX rendering, and local-only student feedback. The staging beta login is invite-only when Supabase is configured. No payments, subscriptions, paid downloads, or production deployment are enabled.
