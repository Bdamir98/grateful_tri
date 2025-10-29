-- ============================================================
-- FIX ADMIN LOGIN ISSUE
-- Run this entire script in your Supabase Dashboard SQL Editor
-- ============================================================

-- STEP 1: Add trigger to auto-create profiles for new users
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- STEP 2: Create profile for existing admin user (if it doesn't exist)
-- ------------------------------------------------------------

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Site Administrator'),
  'admin'
FROM auth.users
WHERE email = 'admin@gratefultribe.org'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = COALESCE(EXCLUDED.full_name, 'Site Administrator');


-- STEP 3: Verify admin user exists
-- ------------------------------------------------------------

SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  CASE 
    WHEN au.id IS NOT NULL THEN '✓ Auth user exists'
    ELSE '✗ Auth user missing'
  END as auth_status
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.email = 'admin@gratefultribe.org';

-- If you see a result above, your admin is ready!
-- If not, you need to create the user first in Authentication → Users
