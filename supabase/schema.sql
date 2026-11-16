-- Run in Supabase Dashboard > SQL Editor.
create table if not exists public.quiz_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 subject text not null,
 topic text not null default 'Mixed practice',
 question_text text not null,
 selected_option integer not null,
 correct_option integer not null,
 is_correct boolean not null,
 attempted_at timestamptz not null default now()
);
create index if not exists quiz_attempts_user_date_idx on public.quiz_attempts(user_id,attempted_at desc);
alter table public.quiz_attempts enable row level security;
create policy "Students can read their own attempts" on public.quiz_attempts for select using (auth.uid()=user_id);
create policy "Students can insert their own attempts" on public.quiz_attempts for insert with check (auth.uid()=user_id);
-- No client-side update/delete policies: attempt history is append-only.
