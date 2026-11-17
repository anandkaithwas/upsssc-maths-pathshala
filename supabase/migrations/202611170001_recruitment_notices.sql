create table if not exists public.recruitment_notices (
 id uuid primary key default gen_random_uuid(),
 source_key text not null,
 title text not null,
 authority text not null,
 notice_type text not null default 'Recruitment',
 summary text,
 application_start date,
 application_end date,
 exam_date date,
 official_url text not null,
 pdf_url text,
 status text not null default 'pending' check (status in ('pending','published','rejected')),
 source_published_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(source_key, official_url)
);
create index if not exists recruitment_notices_public_idx on public.recruitment_notices(status, updated_at desc);
alter table public.recruitment_notices enable row level security;
drop policy if exists "Public can read published recruitment notices" on public.recruitment_notices;
create policy "Public can read published recruitment notices" on public.recruitment_notices for select using (status='published');
