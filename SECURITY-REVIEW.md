# Security hardening review

## Scope

This review is based on source code and GitHub PR metadata inspected on 17 November 2026. It is not a live penetration test and does not establish the current settings of the Supabase or Cloudflare accounts.

## Confirmed findings

1. The pilot branch's single-answer RPC derives correctness and user identity in PostgreSQL. The browser sends question text and selected option rather than a claimed score.
2. The general mini-test batch RPC exists on PR #2's branch, but PR #2 is not merged into the pilot branch. Its integration must be reconciled before general-test persistence can be considered complete.
3. The answer key is present in the React frontend bundle in the current pilot branch. Therefore, a user can inspect correct options and explanations through browser developer tools. The private database answer key does not fix this client-side exposure.
4. The student beta's invite-only interface is not, by itself, an invitation policy. Public sign-up must be disabled in the dedicated staging Supabase project.
5. The current SQL grants authenticated users read access to their own quiz attempts and routes writes through RPCs. The actual effective grants, RLS policies, function owners, and function execution permissions must be tested in the staging project.
6. AuthPanel loads progress on session changes and also registers a progress-refresh listener. This is functional but duplicates an initial progress request; test auth transitions and unmount behaviour.
7. The repository package manifest has no committed lockfile. CI currently uses npm install rather than npm ci.
8. PR #1, #2 and #3 are open draft PRs with different base branches. Do not merge them in arbitrary order.

## Changes in this branch

- Adds an idempotent staging-only SQL migration to explicitly revoke browser write privileges on quiz attempts, grant authenticated read-only access, recreate the own-row RLS policy, and harden all three SECURITY DEFINER RPCs with an empty search_path and schema-qualified object references.
- Does not delete or rewrite student data.
- Does not alter the frontend question bank, so correct-answer exposure remains an acknowledged limitation.
- Does not change Supabase account settings or deploy anything.

## Required staging validation before invitations

- Confirm project URL/project ref is the dedicated staging project.
- Disable public sign-ups at Supabase Auth project settings.
- Confirm email invite, acceptance, password reset, login, logout, and session persistence.
- As two separate test users, prove each can read only their own quiz_attempts rows.
- Prove anon and authenticated clients cannot directly insert, update, or delete quiz_attempts rows.
- Prove anon cannot execute quiz RPCs; authenticated can execute valid submissions.
- Prove invalid option values, unknown questions, unauthenticated calls, and malformed batch payloads fail.
- Confirm the SECURITY DEFINER function owner and grants in pg_proc / information_schema.
- Confirm the question bank does not contain high-stakes or confidential exam content. Current frontend answers are visible and this beta is low-stakes only.
- Verify staging workflow uses only the dedicated Pages project and staging Supabase variables.
- Run clean dependency installation, tests, and build; test on Android.

## Open blockers

- Frontend answer keys remain exposed. For a real assessment engine, deliver question content without correctness metadata and use server-side question IDs.
- No live Supabase project access was available to validate Auth settings, actual RLS behaviour, or migration execution.
- No staging deployment was run.
- No production action was taken.
