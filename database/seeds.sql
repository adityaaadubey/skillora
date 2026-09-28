-- ==============================================================================
-- Skillora Canonical Opportunities Seed Data
-- ==============================================================================

-- Opportunity Sources Seed
INSERT INTO public.opportunity_sources (name, feed_url, adapter_type, enabled, trust_score)
VALUES 
  ('Google Careers', 'https://careers.google.com/jobs/results/rss', 'rss', true, 0.98),
  ('Unstop Feed', 'https://unstop.com/api/public/opportunity/search-result', 'rest', true, 0.95),
  ('Devpost Hackathons', 'https://devpost.com/hackathons.json', 'rest', true, 0.94),
  ('HackerEarth Contests', 'https://www.hackerearth.com/challenges/api/upcoming', 'rest', true, 0.92),
  ('Devfolio Hackathons', 'https://api.devfolio.co/api/hackathons', 'rest', true, 0.96)
ON CONFLICT DO NOTHING;

-- Verification of approved opportunities grant
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT SELECT ON public.opportunity_sources TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.saved_opportunities TO authenticated;
GRANT SELECT ON public.opportunity_reminders TO authenticated;
GRANT SELECT ON public.user_consents TO authenticated;
