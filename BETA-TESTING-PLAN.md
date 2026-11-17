# UPSSSC Maths Pathshala — Private Student Beta Plan

## Purpose
Run a free, invite-only pilot for 25–30 real aspirants. Login is required to access the learning area. No payments or subscriptions are enabled.

## Access model
- Each tester gets an individual Supabase Auth account created/invited by the project owner from the Supabase Dashboard.
- Public self-registration must be disabled in the dedicated staging Supabase project.
- Share invitations only with the selected testers. Never share one common username/password.
- Students sign in with their invited email and their own password. Password reset is available.
- The public landing/login screen remains visible; learning content, resources and in-app beta feedback are gated until a valid session exists.
- If Supabase staging configuration is absent, the learning area remains locked. Do not bypass the gate or use fake/demo login.
- Do not put service-role keys or invitation secrets in frontend code or GitHub.

## Supabase staging setup (owner action)
1. Create/use a dedicated staging Supabase project; do not use production.
2. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as staging build environment variables in Cloudflare Pages.
3. Apply the repository's staging schema/migrations to that staging project only.
4. In Supabase Authentication settings, turn off public sign-ups. Keep email auth enabled.
5. Configure the allowed Site URL and redirect URLs to the exact staging preview/custom domain.
6. From Authentication → Users, invite/create each selected student's account using their own email. Do not collect or share their passwords.
7. Test invitation acceptance, password setup/reset, sign-in, sign-out, and persistence in a private browser session.
8. Confirm quiz progress RPC writes only for the signed-in user and that one student cannot read another student's attempts.
9. Verify a logged-out browser cannot see learning content, resources, or the beta feedback panel.

## Four-week pilot
1. Week 1 — Access and usability: invite accounts, test login, mobile layouts and slow networks.
2. Week 2 — Learning quality: review every live question, answer key, explanation and Hindi wording.
3. Week 3 — Practice experience: test quiz flow, results, progress sync, logout and password reset.
4. Week 4 — Retest fixes and collect final feedback.

## Tester tasks
- Open the staging link and log in using their own invitation.
- Navigate all available subjects and topic cards.
- Attempt every available subject quiz and the general mini-test.
- Read explanations and flag incorrect or unclear answers.
- Search the resource catalogue.
- Sign out and back in; verify progress remains associated with their account.
- Try on an Android phone and report layout, speed and navigation problems.
- Submit feedback using the on-page beta feedback panel.

## Privacy and safety
- Do not ask testers to share passwords, OTPs, payment details, Aadhaar/PAN, or unnecessary personal information.
- Use test accounts with minimum required profile data.
- Keep Supabase service-role keys server-side only.
- Do not use production student data in staging.
- Explain in the privacy notice what account and quiz data is stored, why, and how to request deletion.
- Feedback panel prepares text locally for the student to copy; it does not upload or store the response.

## Release gates
Do not invite students until:
- staging preview is deployed and verified;
- public sign-up is disabled and invitations work;
- logged-out content gating is verified;
- quiz progress is isolated per user and tested;
- every question and explanation shown in the pilot is educator-reviewed;
- build, core navigation, mobile and authentication tests pass;
- privacy notice matches actual data flows.

## Known limitations
- Current question bank is a small sample, not comprehensive exam coverage.
- Topic cards may be roadmap placeholders rather than finished lessons.
- Resource catalogue entries are previews; no paid checkout or premium delivery exists.
- Feedback copy action does not submit feedback to a server.
- Quiz content currently exists in the frontend bundle; current questions are low-stakes practice/demo content, not secure high-stakes assessments.

## Success measures
- Invite 25–30 testers; target at least 20 active testers.
- At least 70% complete core quiz/navigation tasks.
- Track login failures, password-reset issues and mobile defects.
- Review every reported incorrect answer.
- Resolve all critical access, scoring, privacy and mobile usability defects before wider release.
