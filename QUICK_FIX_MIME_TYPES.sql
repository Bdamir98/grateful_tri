-- Quick Fix: Just Update MIME Types (No Policy Changes)
-- Run this if you get "policy already exists" errors

-- =====================================================
-- 1. Allow all common image and video MIME types
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

-- =====================================================
-- 2. Make sure bucket is public
-- =====================================================
UPDATE storage.buckets 
SET public = true 
WHERE name = 'website-assets';

-- =====================================================
-- 3. Set file size limit to 500MB
-- =====================================================
UPDATE storage.buckets 
SET file_size_limit = 524288000
WHERE name = 'website-assets';

-- =====================================================
-- 4. Verify configuration
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
-- DONE! Now try uploading images again
-- =====================================================
