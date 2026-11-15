# UPSSSC Maths Pathshala

Mobile-first, Hindi-first education website for UPSSSC, PET, Lekhpal, VDO, Auditor, SSC, UP Police and Railway aspirants.

## Stack
- React 18 + Vite
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
1. Open Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git.
2. Select this GitHub repository.
3. Production branch: `main`.
4. Framework preset: Vite.
5. Build command: `npm run build`.
6. Build output directory: `dist`.
7. Save and deploy.

Cloudflare will create a `*.pages.dev` URL and automatically rebuild on new commits to the production branch.

## Current release scope
The current version includes a responsive landing page, subject cards, a 3-question interactive sample quiz, searchable study catalogue, premium storefront placeholders and social links.

**Not yet production-ready for commerce:** checkout, payment verification, student authentication, admin content management, protected file delivery, persistent mock-test attempts, privacy policy and refund workflow still need implementation. Product buttons are placeholders. Do not accept payments or upload paid PDFs into public static assets until secure server-side access controls are implemented.

## Security principles
- Never put payment secrets or API keys in browser code.
- Never place paid PDFs in the public asset directory.
- Verify payment status server-side before granting entitlements.
- Deliver paid files through authenticated, time-limited access.
- Publish accurate privacy, terms, refund and affiliate disclosures.

## Cost
This starter has no paid dependencies. Cloudflare and GitHub free tiers have quotas and terms. Domain registration, payment processing and some third-party services may cost money; zero infrastructure cost is not a guarantee of zero operating cost.
