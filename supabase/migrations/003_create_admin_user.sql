-- Migration: Create default admin user
-- This migration sets up a default admin account for development

-- IMPORTANT: Run these commands in your Supabase Dashboard SQL Editor
-- The auth.users table cannot be modified directly from migrations

-- Step 1: Create admin user in Supabase Dashboard
-- Go to: Authentication → Users → Add User
-- Email: admin@gratefultribe.org
-- Password: Admin123!
-- (Or use the SQL below if you have the service role)

-- Step 2: After creating the user, run this SQL to set them as admin
-- Replace 'admin@gratefultribe.org' with your admin email

DO $$
DECLARE
  admin_email TEXT := 'admin@gratefultribe.org';
  user_exists BOOLEAN;
BEGIN
  -- Check if a profile with this email exists
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE email = admin_email
  ) INTO user_exists;

  IF user_exists THEN
    -- Update existing profile to admin
    UPDATE public.profiles 
    SET 
      role = 'admin',
      full_name = COALESCE(full_name, 'Site Administrator'),
      updated_at = NOW()
    WHERE email = admin_email;
    
    RAISE NOTICE 'Admin role granted to: %', admin_email;
  ELSE
    RAISE NOTICE 'User with email % not found. Please create the user first in Supabase Dashboard.', admin_email;
  END IF;
END $$;

-- Create a helper function to promote any user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    role = 'admin',
    updated_at = NOW()
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  RAISE NOTICE 'User % promoted to admin', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (for future use)
GRANT EXECUTE ON FUNCTION public.promote_to_admin(TEXT) TO authenticated;

COMMENT ON FUNCTION public.promote_to_admin IS 'Promotes a user to admin role by email address';
