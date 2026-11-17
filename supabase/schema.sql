successfully downloaded text file (SHA: 6fdf711b73c18ef41489d81f9adf2fa3aea3e1bc)

-- Aggregate a student's own progress in the database instead of downloading
-- attempt rows. SECURITY DEFINER is constrained to the authenticated uid.
create or replace function public.get_quiz_progress()
returns json
language sql
security definer
set search_path = pg_catalog, public
as $$
  select json_build_object(
    'attempted', count(*),
    'correct', count(*) filter (where is_correct)
  )
  from public.quiz_attempts
  where user_id = auth.uid()
$$;
revoke all on function public.get_quiz_progress() from public, anon;
grant execute on function public.get_quiz_progress() to authenticated;
