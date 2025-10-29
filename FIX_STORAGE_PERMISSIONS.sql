-- Fix Storage Bucket Permissions for Gallery Uploads
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. Check if bucket exists (should return website-assets)
-- =====================================================
SELECT * FROM storage.buckets WHERE name = 'website-assets';

-- =====================================================
-- 2. Make sure bucket is public
-- =====================================================
UPDATE storage.buckets 
SET public = true 
WHERE name = 'website-assets';

-- =====================================================
-- 3. DROP existing policies (if any)
-- =====================================================
DROP POLICY IF EXISTS "Allow public uploads to website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- =====================================================
-- 4. CREATE new RLS policies for website-assets bucket
-- =====================================================

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to website-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'website-assets');

-- Allow ANYONE to read/download files (public bucket)
CREATE POLICY "Allow public reads from website-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'website-assets');

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes from website-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'website-assets');

-- Allow authenticated users to update files
CREATE POLICY "Allow authenticated updates to website-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'website-assets');

-- =====================================================
-- 5. Verify policies are created
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects' 
  AND policyname LIKE '%website-assets%';

-- =====================================================
-- 6. Check bucket file size limit (should be high)
-- =====================================================
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'website-assets';

-- =====================================================
-- 7. Increase file size limit to 500MB if needed
-- =====================================================
UPDATE storage.buckets 
SET file_size_limit = 524288000  -- 500MB in bytes
WHERE name = 'website-assets';

-- =====================================================
-- 8. Allow all common image MIME types
-- =====================================================
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'video/mp4',
  'video/webm',
  'video/quicktime'
]
WHERE name = 'website-assets';

-- Alternative: Allow ALL mime types (less secure but easier)
-- UPDATE storage.buckets 
-- SET allowed_mime_types = NULL
-- WHERE name = 'website-assets';

-- =====================================================
-- 9. Verify final bucket configuration
-- =====================================================
SELECT 
  name,
  public,
  file_size_limit / 1048576 as "size_limit_mb",
  array_length(allowed_mime_types, 1) as "mime_types_count",
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'website-assets';

-- =====================================================
-- DONE! Your storage bucket is now configured correctly
-- =====================================================

-- Test by uploading images in the Gallery Page Editor
