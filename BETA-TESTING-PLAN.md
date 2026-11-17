# UPSSSC Maths Pathshala — Student Beta Plan

## Purpose
Run a free, feedback-led pilot with 25–30 real aspirants before introducing payments or expanding the platform.

## Beta promise
- No fees, paid plans, subscriptions, checkout, or payment collection during the pilot.
- Existing free sample quizzes and resources remain accessible.
- Anything labelled preview or coming soon must not be represented as a working downloadable product.
- Do not request passwords, payment details, Aadhaar/PAN, or unnecessary personal data from testers.

## Suggested four-week pilot
1. Week 1 — Access and usability: test on Android phones, slow networks, and common browsers.
2. Week 2 — Learning quality: check question accuracy, answer keys, explanations, Hindi clarity, and topic usefulness.
3. Week 3 — Practice experience: test quiz flow, result screens, login (only if staging Supabase is configured), and progress sync.
4. Week 4 — Retest fixes and collect final feedback.

## Tester tasks
- Open the homepage and navigate to each subject.
- Attempt every available subject quiz and the general mini-test.
- Read each explanation and flag any incorrect or unclear answer.
- Search the resource catalogue.
- If test accounts are enabled, create an account, sign out/in, and check whether progress is retained.
- Repeat on a mobile device and report layout, speed, or accessibility problems.
- Submit feedback using the on-page beta feedback panel.

## Feedback fields
Ask for an overall rating, the feature being reviewed, the device/browser (optional), a description of the issue, and what the student expected instead. Avoid collecting personal identifiers.

## Release gates
Do not invite testers to rely on the site for high-stakes exam preparation until:
- all published questions and explanations are independently checked;
- the build passes;
- core navigation and quiz flows pass manual tests;
- authentication/progress are tested against a dedicated staging Supabase project or clearly labelled unavailable;
- privacy notice accurately describes the actual data flows;
- the staging preview is deployed and verified.

## Known limitations at pilot start
- The question bank is a small sample, not a comprehensive exam question bank.
- Topic cards may be roadmap placeholders rather than complete lessons.
- Resource catalogue cards are previews; no paid checkout or premium delivery exists.
- Quiz questions and answers are present in the frontend bundle. Treat current quizzes as practice/demo content, not secure high-stakes assessments.
- Feedback copy action does not submit feedback to a server. Students must share the copied text with the pilot coordinator through the agreed channel.

## Success measures
Track completion and quality, not vanity metrics:
- 25–30 testers invited; target at least 20 active testers.
- At least 70% complete the core quiz/navigation tasks.
- Every reported incorrect answer is reviewed.
- Categorise and prioritise feedback by severity and frequency.
- Resolve all critical navigation, scoring, privacy, and mobile usability defects before wider release.
