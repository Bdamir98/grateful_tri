-- Fix Our Work Database Setup
-- Run this in Supabase SQL Editor BEFORE saving projects

-- =====================================================
-- 1. Check if page_content table exists
-- =====================================================
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'page_content'
);

-- =====================================================
-- 2. Check current structure
-- =====================================================
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'page_content'
ORDER BY ordinal_position;

-- =====================================================
-- 3. Check for unique constraint (REQUIRED for upsert)
-- =====================================================
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'page_content'
  AND tc.constraint_type = 'UNIQUE';

-- =====================================================
-- 4. ADD unique constraint if missing (CRITICAL!)
-- =====================================================
DO $$
BEGIN
  -- Check if the unique constraint exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'page_content'
      AND constraint_name LIKE '%page_key%section_key%'
  ) THEN
    -- Add the unique constraint
    ALTER TABLE page_content
    ADD CONSTRAINT page_content_page_key_section_key_unique 
    UNIQUE (page_key, section_key);
    
    RAISE NOTICE '✅ Added unique constraint on (page_key, section_key)';
  ELSE
    RAISE NOTICE '✅ Unique constraint already exists';
  END IF;
END $$;

-- =====================================================
-- 5. Check if any Our Work data already exists
-- =====================================================
SELECT 
  id,
  page_key,
  section_key,
  created_at,
  jsonb_pretty(content) as content_formatted
FROM page_content 
WHERE page_key = 'our_work';

-- =====================================================
-- 6. Clean up any duplicate entries (if they exist)
-- =====================================================
-- Keep only the most recent record for our_work
DELETE FROM page_content
WHERE page_key = 'our_work'
  AND id NOT IN (
    SELECT id
    FROM page_content
    WHERE page_key = 'our_work'
    ORDER BY created_at DESC
    LIMIT 1
  );

-- =====================================================
-- 7. Verify the table is ready
-- =====================================================
SELECT 
  'page_content table' as table_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_name = 'page_content'
        AND constraint_type = 'UNIQUE'
    ) THEN '✅ Has unique constraint'
    ELSE '❌ Missing unique constraint'
  END as status;

-- =====================================================
-- DONE! Now you can save from the admin panel
-- =====================================================

-- Expected output:
-- 1. Table exists: true
-- 2. Columns: id, page_key, section_key, content, created_at, updated_at
-- 3. Unique constraint: ✅ Added or already exists
-- 4. Ready to save!
