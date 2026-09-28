-- ==============================================================================
-- Skillora PostgreSQL Database Schema
-- High-Trust Student Opportunity Intelligence & Deterministic Matching Platform
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'organizer', 'admin')),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  college TEXT,
  degree TEXT,
  branch TEXT,
  graduation_year INTEGER,
  current_year INTEGER,
  cgpa NUMERIC(4, 2),
  location TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  profile_completion_pct INTEGER DEFAULT 0,
  preferred_categories TEXT[] NOT NULL DEFAULT '{}',
  preferred_locations TEXT[] NOT NULL DEFAULT '{}',
  preferred_modes TEXT[] NOT NULL DEFAULT '{}',
  experience_level TEXT,
  career_interests TEXT[] NOT NULL DEFAULT '{}',
  resume_reference TEXT,
  profile_public BOOLEAN NOT NULL DEFAULT FALSE,
  email_notifications_enabled BOOLEAN DEFAULT TRUE,
  reminders_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organizer Profiles Table
CREATE TABLE IF NOT EXISTS public.organizer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  organization_type TEXT DEFAULT 'Tech Company',
  website TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'organizer', 'admin')),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 4. Opportunity Sources (Crawler & Feed Feeder Sources)
CREATE TABLE IF NOT EXISTS public.opportunity_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  adapter_type TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  trust_score NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
  last_fetched_at TIMESTAMPTZ,
  last_error TEXT,
  error_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Raw Ingestion Influx Table
CREATE TABLE IF NOT EXISTS public.ingested_items_raw (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES public.opportunity_sources(id) ON DELETE SET NULL,
  external_id TEXT,
  payload_hash TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 6. Core Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('internship', 'hackathon', 'scholarship', 'fellowship', 'competition', 'course')),
  subcategory TEXT,
  opportunity_type TEXT,
  description TEXT NOT NULL,
  mode TEXT DEFAULT 'remote' CHECK (mode IN ('remote', 'hybrid', 'on-site', 'any')),
  location TEXT,
  duration TEXT,
  eligibility_text TEXT,
  min_year INTEGER,
  max_year INTEGER,
  education_level TEXT,
  pricing_type TEXT DEFAULT 'free' CHECK (pricing_type IN ('free', 'paid')),
  price NUMERIC(10, 2),
  currency TEXT DEFAULT 'INR',
  stipend_min NUMERIC(10, 2),
  stipend_max NUMERIC(10, 2),
  prize_pool_min NUMERIC(10, 2),
  prize_pool_max NUMERIC(10, 2),
  application_url TEXT NOT NULL,
  source_url TEXT,
  canonical_url TEXT,
  source_id UUID REFERENCES public.opportunity_sources(id) ON DELETE SET NULL,
  slug TEXT,
  deduplication_hash TEXT,
  platform TEXT,
  organization_website TEXT,
  logo_url TEXT,
  experience_level TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  moderation_reason TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  deadline TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  skills TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Saved Opportunities / Bookmarks Table
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'applying', 'applied', 'interviewing', 'offered', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- 8. Opportunity Reminders Table
CREATE TABLE IF NOT EXISTS public.opportunity_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ NOT NULL,
  channel TEXT NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Opportunity Reports & Moderation
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 10. Privacy & Consent Logs (GDPR / DPDP Compliance)
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  agreed BOOLEAN NOT NULL DEFAULT TRUE,
  agreed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Security Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Application Click Telemetry Table
CREATE TABLE IF NOT EXISTS public.application_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_mode ON public.opportunities(mode);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_canonical_url ON public.opportunities(canonical_url);
CREATE INDEX IF NOT EXISTS idx_opportunities_dedup_hash ON public.opportunities(deduplication_hash);
CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user ON public.saved_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_date ON public.opportunity_reminders(user_id, remind_at);
