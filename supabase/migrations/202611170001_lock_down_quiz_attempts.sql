-- Security hardening for the student-pilot quiz data.
-- Apply ONLY to the dedicated staging Supabase project after reviewing this file.
-- Idempotent: drops existing quiz_attempts policies and recreates the intended policy set.

begin;

alter table public.quiz_attempts enable row level security;

-- Remove every existing policy on this table. PostgreSQL combines permissive
-- policies with OR, so an old broad policy could silently defeat a new policy.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'quiz_attempts'
  loop
    execute format(
      'drop policy if exists %I on public.quiz_attempts',
      policy_record.policyname
    );
  end loop;
end
$$;

create policy "Students can read their own attempts"
  on public.quiz_attempts
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Clients may read only their own rows. All writes must go through the
-- SECURITY DEFINER RPC, which derives correctness from the private answer key.
revoke all on table public.quiz_attempts from public, anon, authenticated;
grant select on table public.quiz_attempts to authenticated;

-- Ensure answer-key tables are not directly accessible through PostgREST.
revoke all on schema private from public, anon, authenticated;
revoke all on all tables in schema private from public, anon, authenticated;

-- Keep the RPCs callable only by authenticated students. The functions must
-- continue to derive user_id from auth.uid(), never from client parameters.
revoke all on function public.record_quiz_attempt(text, integer) from public, anon;
grant execute on function public.record_quiz_attempt(text, integer) to authenticated;

revoke all on function public.get_quiz_progress() from public, anon;
grant execute on function public.get_quiz_progress() to authenticated;

commit;
