# Security hardening — staging validation

This checklist is a release gate, not proof that the checks have passed.

## Database
- [ ] Apply `supabase/migrations/202611170001_security_privilege_hardening.sql` to the dedicated staging Supabase project only.
- [ ] Confirm `anon` and `public` cannot select, insert, update or delete `public.quiz_attempts`.
- [ ] Confirm `authenticated` can select only rows where `auth.uid() = user_id`.
- [ ] Confirm direct insert/update/delete on `quiz_attempts` fails for authenticated users.
- [ ] Confirm `record_quiz_attempt(text, integer)` rejects anonymous calls, invalid options and unknown questions.
- [ ] Confirm `get_quiz_progress()` returns only the caller's aggregate counts.
- [ ] Confirm no client role can read `private.quiz_answer_key`.

## Authentication and access
- [ ] Disable public sign-ups in Supabase Auth settings for staging.
- [ ] Create invited test users individually; never share credentials.
- [ ] Test invitation acceptance, password reset, login, logout and session refresh.
- [ ] Confirm logged-out users cannot access the learning area.
- [ ] Test two separate accounts and verify neither can read the other's attempts.

## Important known limitation
The current React question bank includes correct options and explanations in the browser bundle. The private database answer key protects server-side score calculation, but does not conceal the answer key from a technically capable student. Do not use this question bank for high-stakes or proctored assessment. The next security feature should move question delivery to a server-controlled source that omits correct options until submission.

## Release rule
Do not invite students until all applicable checks above have been executed against the actual staging Supabase project and staging website. No production deployment is authorised by this checklist.
