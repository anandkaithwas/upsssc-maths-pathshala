# Recruitment Intelligence v1
Run `supabase/migrations/202611170001_recruitment_notices.sql` in Supabase.
Deploy Worker from `workers/recruitment-scanner`: set secrets SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and ADMIN_TOKEN using Wrangler, then deploy.
Cron runs every 30 minutes. Candidate links are inserted as pending; public feed shows only published notices. Review manually against the original notification before publishing. The initial scanner is a conservative link-discovery prototype, not a complete parser and does not infer dates, eligibility, vacancies or fees.
Cloudflare Pages build remains npm run build, output dist. Never expose the service-role key in VITE_ variables.
