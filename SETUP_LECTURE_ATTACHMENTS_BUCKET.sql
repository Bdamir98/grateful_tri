-- Setup Lecture Attachments Storage Bucket
-- Run this in Supabase SQL Editor to fix "Bucket not found" error

-- =====================================================
-- 1. Create the lecture-attachments bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('lecture-attachments', 'lecture-attachments', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- =====================================================
-- 2. Set up RLS policies for lecture-attachments bucket
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to lecture attachments" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload lecture attachments" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update lecture attachments" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete lecture attachments" ON storage.objects;

-- Public read access (so students can download attachments)
CREATE POLICY "Allow public read access to lecture attachments"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'lecture-attachments');

-- Authenticated upload (so teachers/admins can upload)
CREATE POLICY "Allow authenticated users to upload lecture attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lecture-attachments');

-- Authenticated update (so teachers/admins can replace files)
CREATE POLICY "Allow authenticated users to update lecture attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'lecture-attachments')
WITH CHECK (bucket_id = 'lecture-attachments');

-- Authenticated delete (so teachers/admins can remove files)
CREATE POLICY "Allow authenticated users to delete lecture attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'lecture-attachments');

-- =====================================================
-- 3. Verify bucket was created
-- =====================================================
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id = 'lecture-attachments';

-- =====================================================
-- 4. Check RLS policies
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%lecture%'
ORDER BY policyname;

-- =====================================================
-- 5. Test query - Check if any attachments exist
-- =====================================================
SELECT 
  id,
  lesson_id,
  file_name,
  file_url,
  file_size,
  created_at
FROM lecture_attachments
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- DONE! Bucket is ready for lecture attachments
-- =====================================================

-- Expected results:
-- 1. Bucket 'lecture-attachments' created with public read access
-- 2. 4 RLS policies created (select, insert, update, delete)
-- 3. Students can download, teachers/admins can manage files
-- 4. No more "Bucket not found" errors!

-- Next steps:
-- 1. Re-upload any attachments from the admin panel
-- 2. Test downloading from the lesson page
-- 3. Verify files are accessible
