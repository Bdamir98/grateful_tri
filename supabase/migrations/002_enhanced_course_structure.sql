-- Enhanced Course Structure Migration
-- This migration adds support for:
-- 1. Lecture content types (video, pdf, audio, document, quiz)
-- 2. Preview/lock functionality
-- 3. File attachments for lectures
-- 4. Duration tracking

-- Modify course_lessons table to support multiple content types and preview
ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS content_type TEXT CHECK (content_type IN ('video', 'pdf', 'audio', 'document', 'quiz', 'text')) DEFAULT 'video',
ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quiz_questions JSONB,
ADD COLUMN IF NOT EXISTS text_content TEXT;

-- Create lecture_attachments table for multiple file attachments per lecture
CREATE TABLE IF NOT EXISTS public.lecture_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf, video, audio, doc, docx, ppt, pptx, xls, xlsx, zip, etc.
  file_url TEXT,
  file_storage_path TEXT,
  file_size BIGINT, -- in bytes
  mime_type TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_lecture_attachments_lesson_id ON public.lecture_attachments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_content_type ON public.course_lessons(content_type);
CREATE INDEX IF NOT EXISTS idx_course_lessons_is_preview ON public.course_lessons(is_preview);

-- Enable RLS for lecture_attachments
ALTER TABLE public.lecture_attachments ENABLE ROW LEVEL SECURITY;

-- Lecture attachments policies
CREATE POLICY "Attachments viewable for enrolled users" ON public.lecture_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_lessons
      JOIN public.course_modules ON course_lessons.module_id = course_modules.id
      WHERE course_lessons.id = lecture_attachments.lesson_id
      AND (
        course_lessons.is_free = true
        OR course_lessons.is_preview = true
        OR EXISTS (
          SELECT 1 FROM public.user_course_enrollments
          WHERE user_id = auth.uid() AND course_id = course_modules.course_id
        )
      )
    )
  );

CREATE POLICY "Only admins can modify attachments" ON public.lecture_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update trigger for lecture_attachments
CREATE TRIGGER update_lecture_attachments_updated_at 
  BEFORE UPDATE ON public.lecture_attachments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.lecture_attachments IS 'Stores file attachments for course lectures (PDFs, documents, videos, etc.)';
COMMENT ON COLUMN public.course_lessons.content_type IS 'Type of lecture content: video, pdf, audio, document, quiz, text';
COMMENT ON COLUMN public.course_lessons.is_preview IS 'If true, this lecture can be previewed without enrollment';
COMMENT ON COLUMN public.course_lessons.quiz_questions IS 'JSON array of quiz questions and answers';
COMMENT ON COLUMN public.course_lessons.text_content IS 'Text content for text-based lectures';
