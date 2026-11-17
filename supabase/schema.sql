-- UPSSSC Maths Pathshala staging hardening migration.
-- Run using the Supabase project owner in SQL Editor. Safe to re-run.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.quiz_answer_key (
  question_text text primary key,
  subject text not null,
  topic text not null default 'Mixed practice',
  correct_option integer not null check (correct_option between 0 and 3)
);
revoke all on private.quiz_answer_key from public, anon, authenticated;

insert into private.quiz_answer_key (question_text, subject, correct_option) values
('480 का 15% कितना है?','गणित',2),
('यदि 4 : 7 = x : 35, तो x का मान क्या है?','गणित',2),
('एक वस्तु ₹600 में खरीदकर ₹690 में बेची गई। लाभ प्रतिशत कितना है?','गणित',2),
('12, 18 और 30 का महत्तम समापवर्तक (HCF) क्या है?','गणित',1),
('श्रृंखला पूरी करें: 2, 6, 12, 20, 30, ?','रीजनिंग',2),
('यदि CAT को DBU लिखा जाता है, तो DOG को कैसे लिखा जाएगा?','रीजनिंग',0),
('इनमें से अलग कौन है?','रीजनिंग',3),
('A, B का भाई है और B, C की बहन है। A का C से क्या संबंध है?','रीजनिंग',0),
('‘अग्नि’ का पर्यायवाची शब्द कौन-सा है?','हिंदी',0),
('‘विद्यालय’ शब्द में कौन-सी स्वर संधि है?','हिंदी',2),
('‘नीलकमल’ में कौन-सा समास है?','हिंदी',1),
('‘उन्नति’ का विलोम शब्द क्या है?','हिंदी',1),
('भारतीय संविधान सभा ने संविधान को कब अंगीकृत किया?','सामान्य अध्ययन',2),
('भारत का राष्ट्रीय पशु कौन-सा है?','सामान्य अध्ययन',1),
('सौरमंडल का सबसे बड़ा ग्रह कौन-सा है?','सामान्य अध्ययन',2),
('उत्तर प्रदेश की राजधानी क्या है?','सामान्य अध्ययन',3)
on conflict (question_text) do update set
 subject = excluded.subject, correct_option = excluded.correct_option;

create table if not exists public.quiz_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 subject text not null,
 topic text not null default 'Mixed practice',
 question_text text not null,
 selected_option integer not null check (selected_option between 0 and 3),
 correct_option integer not null check (correct_option between 0 and 3),
 is_correct boolean not null,
 attempted_at timestamptz not null default now()
);
create index if not exists quiz_attempts_user_date_idx on public.quiz_attempts(user_id, attempted_at desc);
alter table public.quiz_attempts enable row level security;
drop policy if exists "Students can read their own attempts" on public.quiz_attempts;
create policy "Students can read their own attempts" on public.quiz_attempts
 for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Students can insert their own attempts" on public.quiz_attempts;
revoke insert, update, delete on public.quiz_attempts from anon, authenticated;
grant select on public.quiz_attempts to authenticated;

create or replace function public.record_quiz_attempt(p_question_text text, p_selected_option integer)
returns void language plpgsql security definer
set search_path = pg_catalog, public, private
as $$
declare answer private.quiz_answer_key%rowtype;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_selected_option is null or p_selected_option < 0 or p_selected_option > 3 then
   raise exception 'Invalid selected option';
 end if;
 select * into answer from private.quiz_answer_key where question_text = p_question_text;
 if not found then raise exception 'Unknown quiz question'; end if;
 insert into public.quiz_attempts(user_id, subject, topic, question_text, selected_option, correct_option, is_correct)
 values(auth.uid(), answer.subject, answer.topic, answer.question_text, p_selected_option,
        answer.correct_option, p_selected_option = answer.correct_option);
end;
$$;
revoke all on function public.record_quiz_attempt(text, integer) from public, anon;
grant execute on function public.record_quiz_attempt(text, integer) to authenticated;
