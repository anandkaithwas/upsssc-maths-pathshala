-- Security privilege hardening for the dedicated STAGING Supabase project.
-- Apply only after confirming the target project is staging. This migration is
-- additive and does not delete student records or change quiz table structure.

begin;

-- Keep the answer key inaccessible to browser roles, including via schema usage.
revoke all on schema private from public, anon, authenticated;
revoke all on table private.quiz_answer_key from public, anon, authenticated;

-- Student history is read-only from the browser. Writes must pass through the
-- server-side RPC, which derives user_id and correctness from auth + answer key.
alter table public.quiz_attempts enable row level security;
revoke all on table public.quiz_attempts from public, anon, authenticated;
grant select on table public.quiz_attempts to authenticated;

drop policy if exists "Students can read their own attempts" on public.quiz_attempts;
create policy "Students can read their own attempts"
  on public.quiz_attempts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Remove default PUBLIC/anon execution and grant only authenticated callers.
-- Empty search_path prevents object-shadowing; all non-built-in objects below
-- are schema-qualified.
create or replace function public.record_quiz_attempt(
  p_question_text text,
  p_selected_option integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  answer private.quiz_answer_key%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_question_text is null or length(pg_catalog.btrim(p_question_text)) = 0 then
    raise exception 'Invalid quiz question';
  end if;

  if p_selected_option is null or p_selected_option < 0 or p_selected_option > 3 then
    raise exception 'Invalid selected option';
  end if;

  select *
    into answer
    from private.quiz_answer_key
   where question_text = p_question_text;

  if not found then
    raise exception 'Unknown quiz question';
  end if;

  insert into public.quiz_attempts (
    user_id, subject, topic, question_text,
    selected_option, correct_option, is_correct
  ) values (
    auth.uid(), answer.subject, answer.topic, answer.question_text,
    p_selected_option, answer.correct_option,
    p_selected_option = answer.correct_option
  );
end;
$$;

revoke all on function public.record_quiz_attempt(text, integer) from public, anon;
grant execute on function public.record_quiz_attempt(text, integer) to authenticated;

create or replace function public.get_quiz_progress()
returns json
language sql
security definer
set search_path = ''
as $$
  select pg_catalog.json_build_object(
    'attempted', pg_catalog.count(*),
    'correct', pg_catalog.count(*) filter (where is_correct)
  )
  from public.quiz_attempts
  where user_id = auth.uid()
$$;

revoke all on function public.get_quiz_progress() from public, anon;
grant execute on function public.get_quiz_progress() to authenticated;

-- Batch RPC used by the general mini-test PR. Recreate with the same hardened
-- search_path and validation, so it does not reintroduce a weaker write path.
create or replace function public.record_quiz_attempts(p_answers jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  item jsonb;
  answer private.quiz_answer_key%rowtype;
  selected integer;
  question text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_answers is null
     or pg_catalog.jsonb_typeof(p_answers) is distinct from 'array'
     or pg_catalog.jsonb_array_length(p_answers) < 1
     or pg_catalog.jsonb_array_length(p_answers) > 50 then
    raise exception 'Invalid quiz answer batch';
  end if;

  for item in select value from pg_catalog.jsonb_array_elements(p_answers) loop
    question := item ->> 'question_text';

    begin
      selected := (item ->> 'selected_option')::integer;
    exception when others then
      raise exception 'Invalid selected option';
    end;

    if question is null
       or pg_catalog.length(pg_catalog.btrim(question)) = 0
       or selected is null
       or selected < 0
       or selected > 3 then
      raise exception 'Invalid quiz answer';
    end if;

    select *
      into answer
      from private.quiz_answer_key
     where question_text = question;

    if not found then
      raise exception 'Unknown quiz question';
    end if;

    insert into public.quiz_attempts (
      user_id, subject, topic, question_text,
      selected_option, correct_option, is_correct
    ) values (
      auth.uid(), answer.subject, answer.topic, answer.question_text,
      selected, answer.correct_option,
      selected = answer.correct_option
    );
  end loop;
end;
$$;

revoke all on function public.record_quiz_attempts(jsonb) from public, anon;
grant execute on function public.record_quiz_attempts(jsonb) to authenticated;

commit;
