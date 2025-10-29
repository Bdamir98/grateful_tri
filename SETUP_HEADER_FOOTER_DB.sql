-- Setup Header & Footer Customization Database
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. Check if site_settings table exists
-- =====================================================
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'site_settings'
);

-- =====================================================
-- 2. Ensure unique constraint exists on setting_key
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'site_settings'
      AND constraint_type = 'UNIQUE'
      AND constraint_name LIKE '%setting_key%'
  ) THEN
    ALTER TABLE site_settings
    ADD CONSTRAINT site_settings_setting_key_unique 
    UNIQUE (setting_key);
    
    RAISE NOTICE '✅ Added unique constraint on setting_key';
  ELSE
    RAISE NOTICE '✅ Unique constraint already exists';
  END IF;
END $$;

-- =====================================================
-- 3. Insert default header settings
-- =====================================================
INSERT INTO site_settings (setting_key, setting_value)
VALUES (
  'header',
  jsonb_build_object(
    'logo', '/TGT-LOGO-removebg.png',
    'siteName', 'The Grateful Tribe',
    'tagline', 'Empowering Communities'
  )
)
ON CONFLICT (setting_key) 
DO NOTHING;

-- =====================================================
-- 4. Insert default footer settings
-- =====================================================
INSERT INTO site_settings (setting_key, setting_value)
VALUES (
  'footer',
  jsonb_build_object(
    'brandName', 'The Grateful Tribe',
    'brandDescription', 'Empowering communities through digital opportunities and education.',
    'copyrightText', 'All rights reserved.',
    'socialLinks', jsonb_build_object(
      'facebook', '',
      'youtube', '',
      'telegram', '',
      'email', 'contact@gratefultribe.org'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object(
        'title', 'Quick Links',
        'links', jsonb_build_array(
          jsonb_build_object('label', 'About Us', 'href', '/#about'),
          jsonb_build_object('label', 'Courses', 'href', '/#courses'),
          jsonb_build_object('label', 'Projects', 'href', '/#projects'),
          jsonb_build_object('label', 'Gallery', 'href', '/#gallery')
        )
      ),
      jsonb_build_object(
        'title', 'Resources',
        'links', jsonb_build_array(
          jsonb_build_object('label', 'All Courses', 'href', '/courses'),
          jsonb_build_object('label', 'My Dashboard', 'href', '/dashboard'),
          jsonb_build_object('label', 'Login', 'href', '/login'),
          jsonb_build_object('label', 'Sign Up', 'href', '/signup')
        )
      )
    )
  )
)
ON CONFLICT (setting_key) 
DO NOTHING;

-- =====================================================
-- 5. Verify the data was inserted
-- =====================================================
SELECT 
  setting_key,
  jsonb_pretty(setting_value) as settings
FROM site_settings 
WHERE setting_key IN ('header', 'footer');

-- =====================================================
-- 6. Check all site_settings records
-- =====================================================
SELECT 
  setting_key,
  created_at,
  updated_at
FROM site_settings
ORDER BY created_at DESC;

-- =====================================================
-- DONE! You can now customize header and footer
-- =====================================================

-- Expected output:
-- 1. Table exists: true
-- 2. Unique constraint: ✅ Added or already exists
-- 3. header settings: logo, siteName, tagline
-- 4. footer settings: brandName, sections, socialLinks
-- 5. Ready to customize in admin panel!
