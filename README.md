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
- Source branch: `audit/staging-hardening-v1`
- Dedicated Pages project name: `upsssc-maths-pathshala-staging`
- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Workflow: `.github/workflows/staging-preview.yml`
- GitHub environment: `staging`
- Required environment secret: `CLOUDFLARE_ACCOUNT_ID`
- Required environment secret: `CLOUDFLARE_API_TOKEN` (Cloudflare Pages deploy permissions only)
- Required environment variable: `CLOUDFLARE_STAGING_PROJECT=upsssc-maths-pathshala-staging`

The workflow only runs for this exact audit branch, hard-checks the dedicated staging project name, and deploys to that project. It never deploys to the production Pages project or production branch. Create the separate Cloudflare Pages project with this exact name and configure the GitHub Actions `staging` environment values before enabling the workflow.

Use a dedicated Supabase staging project. Apply `supabase/schema.sql` in its SQL Editor, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the GitHub Actions staging environment as repository/environment variables if runtime account features are being tested. Never put a Supabase service-role key in browser variables.

## Current prototype scope
Responsive landing page, four subject sample quizzes, general mini test, searchable resource catalogue, premium storefront placeholders, optional email/password account and progress panel. Payments, paid-file delivery and admin CMS are not enabled.

## Security limitations before production
- Sample questions, options and correct answers are shipped in the frontend bundle so the prototype can render instant explanations. This is not suitable for high-stakes assessments. A production exam engine must fetch questions/options from a trusted backend and validate submissions server-side without exposing answer keys.
- The private answer-key table and RPC prevent browser clients from directly inserting claimed correctness values, but do not hide answers already included in the frontend.
- Historical attempts from the earlier browser-trusted implementation are retained and cannot be independently verified.
- SQL must be applied and tested only in a dedicated Supabase staging project before account/progress sync is considered verified.

## Staging CI and preview
The build workflow is isolated to the audit branch and a separately named Cloudflare Pages project. A successful deployment produces a branch preview URL under the dedicated project's `pages.dev` domain. Check the GitHub Actions run and Cloudflare deployment record for the actual URL; do not infer a URL before successful deployment.

## Commerce
Checkout, payment verification, paid-file delivery, admin CMS, complete privacy policy, terms and refund workflow are not implemented. Do not accept payments or put paid PDFs in public static assets until secure server-side access controls are in place.


## Free student beta (current operating mode)
- Product direction: complete competitive-exam preparation platform for aspirants across major government examinations.
- Immediate pilot: 25–30 students, invite-only login, with a suggested four-week feedback cycle.
- All currently available features are free during the pilot. No payment gateway, checkout, paid membership, or subscription should be enabled.
- Follow `BETA-TESTING-PLAN.md` for tester tasks, privacy cautions, release gates, and success measures.
- The on-page feedback panel prepares a feedback message for the student to copy and share; it does not transmit or store feedback.
- Public self-registration is disabled in the dedicated staging Supabase project; owner invites each tester individually.
- Do not advertise placeholder resources or roadmap topics as completed learning products.
