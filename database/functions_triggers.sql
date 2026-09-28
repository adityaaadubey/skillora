-- ==============================================================================
-- Skillora PostgreSQL Stored Procedures, Functions & Database Triggers
-- ==============================================================================

-- 1. Auto-Confirm New User Function & Trigger
-- Automatically confirms email on user creation so accounts are immediately active
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
RETURNS trigger AS $$
BEGIN
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at := NOW();
  END IF;
  IF NEW.confirmed_at IS NULL THEN
    NEW.confirmed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_new_user();

-- 2. New User Registration Sync Trigger
-- Automatically creates profile and organizer profile records upon auth.users creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  requested_role text;
BEGIN
  requested_role := CASE
    WHEN NEW.raw_user_meta_data->>'role' = 'organizer' THEN 'organizer'
    WHEN NEW.raw_user_meta_data->>'account_type' = 'organizer' THEN 'organizer'
    ELSE 'student'
  END;

  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    email,
    college,
    degree,
    graduation_year,
    is_profile_complete,
    profile_completion_pct
  ) VALUES (
    NEW.id,
    requested_role,
    LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 120),
    NEW.email,
    NEW.raw_user_meta_data->>'college',
    NEW.raw_user_meta_data->>'degree',
    NULLIF(NEW.raw_user_meta_data->>'graduation_year', '')::INTEGER,
    TRUE,
    100
  ) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    college = COALESCE(EXCLUDED.college, profiles.college),
    degree = COALESCE(EXCLUDED.degree, profiles.degree);

  IF requested_role = 'organizer' THEN
    INSERT INTO public.organizer_profiles (
      id,
      organization_name,
      organization_type,
      website
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'organization_name', 'Pending Organization'),
      COALESCE(NEW.raw_user_meta_data->>'organization_type', 'Tech Company'),
      NEW.raw_user_meta_data->>'website'
    ) ON CONFLICT (id) DO NOTHING;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, requested_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Stored Procedure: delete_my_account
-- Deletes user account from auth.users (cascades to all profiles, bookmarks, reminders)
CREATE OR REPLACE FUNCTION public.delete_my_account(p_user_id UUID)
RETURNS boolean AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized to delete this account';
  END IF;

  DELETE FROM auth.users WHERE id = p_user_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Timestamp Auto-Update Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
