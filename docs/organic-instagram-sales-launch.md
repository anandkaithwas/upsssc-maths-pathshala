# UPSSSC Maths Pathshala — Organic Instagram Sales Launch

Status: implementation blueprint; no checkout or paid download is live yet.
Owner: UPSSSC Maths Pathshala
Primary channel: Instagram Creator account @upssscmathspathshala
Primary objective: first verified paid student orders from organic traffic.
Ad budget: ₹0.

## Funnel
1. Discovery: two original Reels/day at 06:00 and 18:00 IST; keep the current queue intact.
2. Trust: one free, useful Maths practice PDF; source-tag every PYQ and label unsourced questions as practice.
3. Capture: one landing page form collecting only name and email/WhatsApp with clear consent and privacy notice.
4. Conversion: one starter product, Arithmetic Practice Pack at a test price of ₹49; show sample pages, contents, answer explanations, delivery and refund terms before payment.
5. Delivery: verify payment server-side, issue a single-use/time-limited download link, record order and entitlement.
6. Retention: offer the next topic pack or 10-test bundle only after successful delivery.

## First products (proposed, not yet published)
- Free lead magnet: 25 arithmetic questions with answer key and concise solutions; source-labelled.
- Paid starter: Arithmetic Practice Pack, 100 questions, topic tags, difficulty labels and worked solutions; proposed ₹49 launch price.
- Follow-on: 10 mini-tests, 250 questions; proposed ₹149 only after the first pack is validated.
Do not advertise a product until its PDF is complete, proofread, source-checked and downloadable. Prices are experiments, not validated willingness-to-pay.

## Instagram profile conversion
Suggested name field: UPSSSC Maths | PET • Lekhpal • VDO
Suggested bio:
Maths & Reasoning, simple Hindi mein
UPSSSC PET • Lekhpal • VDO • Auditor
Verified PYQs | Shortcuts | Practice Tests
🎁 Free Arithmetic Practice PDF ↓

Pinned posts: (1) Start here; (2) best Number Series challenge; (3) PYQ solution + free PDF invitation.
Highlights: Start Here, Free PDF, Maths, Reasoning, PYQs, Test Series.
Use one CTA per post. Never promise guaranteed selection, rank, marks or exam outcomes.

## Content-to-sales rules
- Keep the approved 06:00 / 18:00 slots and existing production identity.
- Add one weekly product demonstration using real sample pages.
- At least 4 of every 10 Reels should contain a save-worthy concept/question; at least 2 should naturally point to the free resource.
- Reels remain educational first. Do not turn every post into a sales pitch.
- Do not use keyword-to-DM CTAs until the free PDF URL and compliant reply flow are live.

## Website commerce readiness gate
The current Vite site has storefront placeholders only. Do not take payments yet.
Before launch implement: payment checkout; server-side webhook signature verification; idempotent order records; entitlement only after verified payment; private storage for paid PDFs; expiring signed download links; order confirmation/support; privacy, terms, refund, contact and applicable tax/invoice details.
Test mode must cover successful/failed payments, webhook replay, duplicate events, expired links and refunds.
Proposed architecture: Cloudflare Pages frontend + Worker/API + D1 order ledger + private R2 bucket + payment gateway. Confirm provider, legal/business details and operating costs before deployment. Nothing here is deployed.

## Weekly measurement
Track by Reel at 24h and 7d: reach, non-follower reach, average watch time/retention, shares/reach, saves/reach, profile visits and follows.
Track funnel: profile visits → link taps → free PDF requests → checkout starts → verified purchases → refunds/support issues.
Primary business metric: verified paid orders and contribution margin, not views alone. Do not infer sales conversion when event tracking is missing.

## 30-day execution sequence
Days 1–3: finalize free PDF, paid pack, sample pages, profile copy and landing-page copy.
Days 4–7: publish free lead magnet funnel; verify consent, delivery and analytics.
Days 8–14: open the ₹49 starter pack only after secure checkout and delivery pass the readiness gate.
Days 15–21: review real traffic and purchase objections; improve the sample, page and product.
Days 22–30: build the second pack only if the first has demonstrated demand and low support/refund friction.

## Stop/go criteria
- No payment collection before server-side verification and private delivery are ready.
- No PYQ label without a traceable paper/source.
- No guaranteed-result claims.
- No scale-up based only on Reel views; require verified orders and acceptable support/refund rates.