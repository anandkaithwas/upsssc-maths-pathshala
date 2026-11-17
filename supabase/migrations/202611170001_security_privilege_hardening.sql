-- Security privilege hardening for the dedicated staging Supabase project.
-- Apply only to staging during this audit. Safe to re-run.
-- Does not modify data or change production.

alter table public.quiz_attempts enable row level security;

drop policy if exists "Students can read their own attempts" on public.quiz_attempts;
create policy "Students can read their own attempts"
  on public.quiz_attempts
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Students can insert their own attempts" on public.quiz_attempts;

revoke all on table public.quiz_attempts from public, anon, authenticated;
grant select on table public.quiz_attempts to authenticated;

revoke all on function public.record_quiz_attempt(text, integer) from public, anon;
grant execute on function public.record_quiz_attempt(text, integer) to authenticated;

revoke all on function public.get_quiz_progress() from public, anon;
grant execute on function public.get_quiz_progress() to authenticated;
