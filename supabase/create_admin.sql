-- Quick Admin User Setup
-- Run this in your Supabase Dashboard → SQL Editor

-- STEP 1: First, create the user in Supabase Dashboard
-- Go to: Authentication → Users → Add User
-- Email: admin@gratefultribe.org
-- Password: Admin123!
-- Make sure to click "Auto Confirm User" checkbox

-- STEP 2: Then run the SQL below to set admin role

-- Update the user's profile to have admin role
UPDATE public.profiles 
SET 
  role = 'admin',
  full_name = 'Site Administrator',
  updated_at = NOW()
WHERE email = 'admin@gratefultribe.org';

-- Verify the admin user was created
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
WHERE role = 'admin';

-- You should see your admin user listed above
-- Login credentials:
-- Email: admin@gratefultribe.org
-- Password: Admin123!
-- URL: http://localhost:3000/admin/login
