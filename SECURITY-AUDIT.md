# Security review — student pilot

## Scope

This review covers the student-pilot branch and its Supabase quiz/authentication path. It does not certify the live Supabase project or Cloudflare configuration; those require owner-side settings and runtime tests.

## Findings

### High — invitation-only access depends on Supabase project configuration

The React app hides learning content until a Supabase session exists, but the frontend cannot disable Supabase public sign-up. In the dedicated staging Supabase project, disable public sign-ups and create each tester through the Supabase Dashboard invitation flow. Verify an uninvited email cannot create an account through the Auth API.

### High — database policy drift can defeat intended row isolation

PostgreSQL permissive RLS policies are combined with OR. An old broad policy can therefore undermine a newly added owner-only policy. The migration `supabase/migrations/202611170001_lock_down_quiz_attempts.sql` removes existing policies on `public.quiz_attempts`, recreates the authenticated owner-only SELECT policy, revokes direct client writes, and restricts the answer-key schema.

Apply this migration only to the dedicated staging project after review. Do not run it against production during this audit.

### Medium — question answer keys are still shipped in the frontend bundle

The React question bank includes correct-option indexes and explanations. Although the database RPC independently calculates persisted correctness from the private answer key, a technically capable student can inspect the frontend JavaScript and discover answers. This is acceptable only for low-stakes practice during a controlled pilot; it is not suitable for secure exams or anti-cheat claims.

Future secure assessment work should fetch question content without answer keys and reveal correctness/explanations only after server-side submission.

### Medium — quiz persistence coverage is incomplete

The pilot's subject quizzes use `record_quiz_attempt`. The general mini-test in the beta branch is not yet wired to the batch persistence RPC from PR #2. PR #2 targets `audit/homepage-modern-v1`, not the pilot branch, and must be reconciled deliberately rather than assumed to be included.

### Medium — deployment evidence is not clean

The latest PR checks show the GitHub build for PR #3 succeeded, while its Cloudflare Workers build check failed. PR #2 has failed build/test checks. Staging deployment must remain blocked until the failing checks are understood and the isolated Pages target is verified.

## Required manual verification

1. Confirm staging Supabase is a dedicated project, not production.
2. Disable public sign-ups; verify invited users can authenticate and an uninvited user cannot register.
3. Verify allowed Site URL and redirect URLs point only to the staging origin.
4. Apply the reviewed migration to staging and inspect resulting grants and RLS policies.
5. With two test accounts, verify account A cannot read account B's attempts.
6. Verify anonymous users cannot read attempts or invoke either RPC.
7. Verify authenticated users cannot directly INSERT, UPDATE, or DELETE attempts.
8. Verify invalid options and unknown question text are rejected by the RPC.
9. Verify progress totals are scoped to the authenticated account.
10. Confirm logged-out users cannot render learning content or beta feedback.
11. Inspect the production build bundle for secrets; only the public Supabase anon/publishable key may be present.
12. Verify staging deployment points to `upsssc-maths-pathshala-staging`; do not deploy production.

## Branch and release policy

- Working branch: `audit/security-hardening-v1`
- Parent: `beta/student-pilot-v1`
- No PR merge, production deployment, or production database migration is authorised by this work.
