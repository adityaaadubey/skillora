-- ==============================================================================
-- Skillora PostgreSQL Row Level Security (RLS) Policies
-- Comprehensive zero-trust security configuration
-- ==============================================================================

-- Admin helper function in private schema
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingested_items_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_sources ENABLE ROW LEVEL SECURITY;

-- 2. Opportunities Policies
-- Public/anonymous can read approved opportunities
CREATE POLICY "Public can view approved opportunities"
  ON public.opportunities FOR SELECT
  USING (status = 'approved');

-- Organizers can insert opportunities
CREATE POLICY "Authenticated users can submit opportunities"
  ON public.opportunities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

-- Admins full access on opportunities
CREATE POLICY "Admins have full access on opportunities"
  ON public.opportunities FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- 3. Profiles Policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR private.is_admin());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 4. Organizer Profiles Policies
CREATE POLICY "Organizers can read own profile"
  ON public.organizer_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR private.is_admin());

CREATE POLICY "Organizers can insert own profile"
  ON public.organizer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Organizers can update own profile"
  ON public.organizer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Organizers can delete own profile"
  ON public.organizer_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 5. Saved Opportunities Policies
CREATE POLICY "Users can view own saved opportunities"
  ON public.saved_opportunities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save opportunities"
  ON public.saved_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved opportunities"
  ON public.saved_opportunities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved opportunities"
  ON public.saved_opportunities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Opportunity Reminders Policies
CREATE POLICY "Users can view own reminders"
  ON public.opportunity_reminders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reminders"
  ON public.opportunity_reminders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON public.opportunity_reminders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.opportunity_reminders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. User Consents Policies
CREATE POLICY "Users can view own consents"
  ON public.user_consents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents"
  ON public.user_consents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 8. Audit Logs & Ingested Items
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (private.is_admin());

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage opportunity sources"
  ON public.opportunity_sources FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());
