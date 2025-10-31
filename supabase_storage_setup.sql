-- Create storage bucket for course thumbnails
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-thumbnails', 'course-thumbnails', true);

-- Set up RLS policies for course thumbnails
CREATE POLICY "Anyone can view course thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Authenticated users can upload course thumbnails" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'course-thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update course thumbnails" ON storage.objects
FOR UPDATE USING (bucket_id = 'course-thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete course thumbnails" ON storage.objects
FOR DELETE USING (bucket_id = 'course-thumbnails' AND auth.role() = 'authenticated');