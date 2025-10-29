-- Fix page_media table schema
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. Check current table structure
-- =====================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'page_media'
ORDER BY ordinal_position;

-- =====================================================
-- 2. Add missing file_name column if it doesn't exist
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'page_media' 
        AND column_name = 'file_name'
    ) THEN
        ALTER TABLE page_media ADD COLUMN file_name TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'page_media' 
        AND column_name = 'storage_path'
    ) THEN
        ALTER TABLE page_media ADD COLUMN storage_path TEXT;
    END IF;
END $$;

-- =====================================================
-- 3. Verify columns were added
-- =====================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'page_media'
ORDER BY ordinal_position;

-- =====================================================
-- DONE! Now try uploading again
-- =====================================================
