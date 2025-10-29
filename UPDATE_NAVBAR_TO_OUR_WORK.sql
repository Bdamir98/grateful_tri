-- Update Navigation from Testimonials to Our Work
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. Check current navigation items
-- =====================================================
SELECT * FROM site_settings WHERE setting_key = 'navigation';

-- =====================================================
-- 2. Update navigation items (if stored in site_settings)
-- =====================================================
UPDATE site_settings 
SET setting_value = jsonb_set(
  setting_value,
  '{items}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN item->>'id' = 'testimonials' THEN 
          jsonb_build_object(
            'id', 'our-work',
            'label', 'Our Work',
            'href', '/our-work'
          )
        ELSE item
      END
    )
    FROM jsonb_array_elements(setting_value->'items') AS item
  )
)
WHERE setting_key = 'navigation';

-- =====================================================
-- 3. Alternative: If using navigation_items table
-- =====================================================
-- Check if navigation_items table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'navigation_items'
);

-- Update navigation_items table (if it exists)
UPDATE navigation_items 
SET 
  label = 'Our Work',
  href = '/our-work'
WHERE id = 'testimonials' OR href = '/testimonials';

-- Alternative: Update by label
UPDATE navigation_items 
SET 
  label = 'Our Work',
  href = '/our-work'
WHERE label = 'Testimonials';

-- =====================================================
-- 4. Verify the update
-- =====================================================
SELECT * FROM site_settings WHERE setting_key = 'navigation';
SELECT * FROM navigation_items;

-- =====================================================
-- DONE! Refresh your browser to see the change
-- =====================================================
