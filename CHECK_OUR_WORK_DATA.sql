-- Check Our Work Data in Database
-- Run this in Supabase SQL Editor to debug

-- =====================================================
-- 1. Check if Our Work data exists
-- =====================================================
SELECT * FROM page_content 
WHERE page_key = 'our_work' 
  AND section_key = 'all';

-- =====================================================
-- 2. Check all page_content records
-- =====================================================
SELECT 
  id,
  page_key,
  section_key,
  created_at,
  updated_at,
  jsonb_pretty(content) as content_formatted
FROM page_content 
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- 3. Check table structure
-- =====================================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'page_content'
ORDER BY ordinal_position;

-- =====================================================
-- 4. Check for unique constraints (needed for upsert)
-- =====================================================
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.table_name = 'page_content'
  AND tc.constraint_type = 'UNIQUE';

-- =====================================================
-- 5. If unique constraint is missing, add it
-- =====================================================
-- Check if constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'page_content'
      AND constraint_type = 'UNIQUE'
      AND constraint_name = 'page_content_page_key_section_key_key'
  ) THEN
    -- Add unique constraint
    ALTER TABLE page_content
    ADD CONSTRAINT page_content_page_key_section_key_key 
    UNIQUE (page_key, section_key);
    
    RAISE NOTICE 'Added unique constraint on (page_key, section_key)';
  ELSE
    RAISE NOTICE 'Unique constraint already exists';
  END IF;
END $$;

-- =====================================================
-- 6. Manually insert test data (if no data exists)
-- =====================================================
-- Run this only if the SELECT query in step 1 returns no rows

INSERT INTO page_content (page_key, section_key, content)
VALUES (
  'our_work',
  'all',
  '{
    "stats": [
      {
        "number": "3000+",
        "label": "Lives Impacted",
        "sublabel": "Across our projects"
      },
      {
        "number": "1000+",
        "label": "Meals Served",
        "sublabel": "Every single day"
      },
      {
        "number": "12+",
        "label": "Communities",
        "sublabel": "Actively serving"
      }
    ],
    "projects": [
      {
        "id": "1",
        "category": "Education",
        "title": "100 kids, 100 dreams. One big project 🎓",
        "description": "Providing quality education and resources to underprivileged children in rural communities.",
        "image": "/placeholder-project.jpg",
        "details": [
          "Distributed school supplies to 100+ students",
          "Provided daily nutritious meals",
          "Established after-school tutoring program"
        ]
      }
    ]
  }'::jsonb
)
ON CONFLICT (page_key, section_key) 
DO UPDATE SET content = EXCLUDED.content;

-- =====================================================
-- 7. Verify the insert/update worked
-- =====================================================
SELECT 
  page_key,
  section_key,
  jsonb_pretty(content) as content
FROM page_content 
WHERE page_key = 'our_work';

-- =====================================================
-- DONE! Check the output above
-- =====================================================
