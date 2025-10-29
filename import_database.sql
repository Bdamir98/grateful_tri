-- ============================================
-- The Grateful Tribe - Database Setup Script
-- ============================================
-- Run this script in your Supabase SQL Editor
-- Instructions:
-- 1. Go to https://app.supabase.com
-- 2. Select your project
-- 3. Navigate to SQL Editor
-- 4. Copy and paste this entire file
-- 5. Click Run
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create website_config table for dynamic theming
CREATE TABLE IF NOT EXISTS public.website_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sections table for dynamic content
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  instructor_name TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_modules table
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_lessons table
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_type TEXT CHECK (video_type IN ('upload', 'youtube', 'url')),
  video_url TEXT,
  video_storage_path TEXT,
  duration INTEGER,
  is_free BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_course_enrollments table
CREATE TABLE IF NOT EXISTS public.user_course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create user_lesson_progress table
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  last_watched_position INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  description TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('active', 'completed', 'upcoming')),
  impact_stats JSONB,
  technologies JSONB,
  external_link TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Website config viewable by everyone" ON public.website_config;
DROP POLICY IF EXISTS "Only admins can modify website config" ON public.website_config;
DROP POLICY IF EXISTS "Active sections viewable by everyone" ON public.sections;
DROP POLICY IF EXISTS "Only admins can modify sections" ON public.sections;
DROP POLICY IF EXISTS "Published courses viewable by everyone" ON public.courses;
DROP POLICY IF EXISTS "Admins can view all courses" ON public.courses;
DROP POLICY IF EXISTS "Only admins can modify courses" ON public.courses;
DROP POLICY IF EXISTS "Modules viewable for published courses" ON public.course_modules;
DROP POLICY IF EXISTS "Only admins can modify modules" ON public.course_modules;
DROP POLICY IF EXISTS "Free lessons viewable by everyone" ON public.course_lessons;
DROP POLICY IF EXISTS "Only admins can modify lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.user_course_enrollments;
DROP POLICY IF EXISTS "Users can enroll in courses" ON public.user_course_enrollments;
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_lesson_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_lesson_progress;
DROP POLICY IF EXISTS "Active gallery items viewable by everyone" ON public.gallery_items;
DROP POLICY IF EXISTS "Only admins can modify gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "Active projects viewable by everyone" ON public.projects;
DROP POLICY IF EXISTS "Only admins can modify projects" ON public.projects;
DROP POLICY IF EXISTS "Active testimonials viewable by everyone" ON public.testimonials;
DROP POLICY IF EXISTS "Only admins can modify testimonials" ON public.testimonials;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Website config policies
CREATE POLICY "Website config viewable by everyone" ON public.website_config
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify website config" ON public.website_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sections policies
CREATE POLICY "Active sections viewable by everyone" ON public.sections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify sections" ON public.sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Courses policies
CREATE POLICY "Published courses viewable by everyone" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all courses" ON public.courses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can modify courses" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Course modules policies
CREATE POLICY "Modules viewable for published courses" ON public.course_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_modules.course_id AND is_published = true
    )
  );

CREATE POLICY "Only admins can modify modules" ON public.course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Course lessons policies
CREATE POLICY "Free lessons viewable by everyone" ON public.course_lessons
  FOR SELECT USING (
    is_free = true OR
    EXISTS (
      SELECT 1 FROM public.user_course_enrollments
      WHERE user_id = auth.uid() AND course_id = (
        SELECT course_id FROM public.course_modules WHERE id = course_lessons.module_id
      )
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can modify lessons" ON public.course_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON public.user_course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON public.user_course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress policies
CREATE POLICY "Users can view own progress" ON public.user_lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- Gallery policies
CREATE POLICY "Active gallery items viewable by everyone" ON public.gallery_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify gallery" ON public.gallery_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Projects policies
CREATE POLICY "Active projects viewable by everyone" ON public.projects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Testimonials policies
CREATE POLICY "Active testimonials viewable by everyone" ON public.testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify testimonials" ON public.testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_website_config_updated_at ON public.website_config;
DROP TRIGGER IF EXISTS update_sections_updated_at ON public.sections;
DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
DROP TRIGGER IF EXISTS update_course_modules_updated_at ON public.course_modules;
DROP TRIGGER IF EXISTS update_course_lessons_updated_at ON public.course_lessons;
DROP TRIGGER IF EXISTS update_user_lesson_progress_updated_at ON public.user_lesson_progress;
DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON public.gallery_items;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_config_updated_at BEFORE UPDATE ON public.website_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON public.user_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default website configuration
INSERT INTO public.website_config (config_key, config_value) VALUES
('theme_colors', '{
  "primary": "#6B2C91",
  "secondary": "#8B3CB1",
  "accent": "#E8C547",
  "accentLight": "#F5D76E",
  "background": "#FFFFFF",
  "text": "#1F2937"
}'::jsonb),
('site_settings', '{
  "siteName": "The Grateful Tribe",
  "tagline": "Empowering Communities Through Digital Opportunities",
  "logo": "/TGT-LOGO-removebg.png",
  "heroVideo": "/website-intro.mp4",
  "impactGoal": 1000000,
  "currentImpact": 5
}'::jsonb),
('social_links', '{
  "youtube": "https://www.youtube.com/@TheGratefulTribe",
  "facebook": "https://www.facebook.com/TheGratefulTribe",
  "instagram": "#",
  "twitter": "#",
  "telegram": "https://t.me/TheGratefulTribe",
  "email": "contact@gratefultribe.org"
}'::jsonb),
('navigation', '{
  "items": [
    {"id": "home", "label": "Home", "href": "/"},
    {"id": "who-we-are", "label": "Our Tribe", "href": "/about"},
    {"id": "founder", "label": "Our Founder", "href": "/founder"},
    {"id": "projects", "label": "Partner with Us", "href": "/projects"},
    {"id": "courses", "label": "Courses", "href": "/courses"},
    {"id": "gallery", "label": "Gallery", "href": "/gallery"},
    {"id": "testimonials", "label": "Testimonials", "href": "/testimonials"}
  ]
}'::jsonb)
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Insert default sections
INSERT INTO public.sections (section_key, title, subtitle, content, display_order) VALUES
('hero', 'The Grateful Tribe aims to use 1st world opportunities in the digital economy to uplift causes and kids in 3rd world countries.', 'Using 1st world opportunities to uplift 3rd world communities', '{
  "videoUrl": "/website-intro.mp4",
  "ctaText": "Join the Projects",
  "ctaLink": "#projects",
  "stats": {
    "goal": 1000000,
    "current": 5,
    "label": "children inspired so far"
  }
}'::jsonb, 1),

('about', 'Who We Are', 'We''re a community-driven organization dedicated to making a meaningful difference in the lives of those who need it most', '{
  "description": "By being part of The Grateful Tribe, you create opportunities for yourself while supporting a mission to give kids the childhood they deserve. Make an impact and grow your income at the same time.",
  "features": [
    {
      "icon": "heart",
      "title": "Uplifting Children",
      "description": "We use our profits to help kids in need of healthcare back to life."
    },
    {
      "icon": "dollar",
      "title": "Empowering Everyone",
      "description": "We train and equip the world to work online and make income from anywhere."
    }
  ]
}'::jsonb, 2),

('mission', 'Our Mission', '', '{
  "description": "At The Grateful Tribe, we believe in the power of gratitude and collective action. Our mission is to create sustainable, positive change in communities by addressing critical needs and empowering individuals to reach their full potential.",
  "details": "We work tirelessly to ensure that no one goes hungry, that children have access to education, and that communities have the resources they need to thrive."
}'::jsonb, 3),

('vision', 'Our Vision', '', '{
  "description": "We envision a world where every person has access to basic necessities, education, and opportunities to thrive in a caring community. Through strategic partnerships and innovative programs, we''re building a future where gratitude and giving create ripples of positive change.",
  "details": "Our approach is holistic: addressing immediate needs while building long-term solutions that empower communities to sustain themselves."
}'::jsonb, 4),

('impact_approach', 'Our Impact Approach', 'Every action we take is guided by core principles that ensure maximum impact', '{
  "principles": [
    {
      "title": "Community-Centered",
      "description": "We listen to and work directly with communities to understand their unique needs and co-create solutions."
    },
    {
      "title": "Sustainable Solutions",
      "description": "Our programs are designed to create lasting change, not just temporary relief."
    },
    {
      "title": "Transparency",
      "description": "We maintain open communication about our work, impact, and how resources are utilized."
    }
  ]
}'::jsonb, 5),

('founder_preview', 'Meet Our Founder', 'Sal Khan - Visionary & Leader', '{
  "image": "/sl_founder.jpg",
  "description": "Sal Khan''s vision and dedication have shaped The Grateful Tribe into a force for positive change.",
  "ctaText": "Learn More",
  "ctaLink": "#founder"
}'::jsonb, 6)
ON CONFLICT (section_key) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  display_order = EXCLUDED.display_order;

-- Insert sample projects
INSERT INTO public.projects (title, description, image_url, status, impact_stats, technologies, external_link, display_order) VALUES
('Luma Protocol', 'Luma Protocol is a DeFi 3.0 project built to help you make money in crypto. It offers staking, yield farming, and passive income rewards.', '/luma_logo.jpg', 'active', '{
  "members": "1000+",
  "returns": "300-400%"
}'::jsonb, '[
  "Earn 0.5%–1% daily and 15%–30% monthly",
  "Start with just $100",
  "Instant, unlimited withdrawals anytime",
  "300% returns under $10K | 400% above $10K"
]'::jsonb, 'https://t.me/LumaProtocolTribe', 1),

('Zionix Global', 'Zionix is an upcoming cryptocurrency AI trading platform that provides licensed, self-operating trading solutions for the modern investor.', '/zionix_logo.png', 'upcoming', '{}'::jsonb, '[
  "AI-powered trading",
  "Automated strategies",
  "Risk management"
]'::jsonb, '#', 2);

-- Insert sample testimonials
INSERT INTO public.testimonials (author_name, author_role, content, rating, is_featured) VALUES
('Sarah M.', 'Digital Entrepreneur', 'The Grateful Tribe changed my life. I went from struggling to make ends meet to building a thriving online business. The best part? I''m now able to give back and help others.', 5, true),
('James K.', 'Community Member', 'I was skeptical at first, but the training and community support exceeded my expectations. I''ve not only achieved financial freedom but also found purpose in contributing to meaningful causes.', 5, true),
('Linda R.', 'Course Student', 'Being part of The Grateful Tribe has been transformative. The skills I learned helped me create multiple income streams, and knowing that my success helps others makes it even more rewarding.', 5, true);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready to use.
-- Next steps:
-- 1. Create your first admin user through the signup page
-- 2. Manually set their role to 'admin' in the profiles table
-- 3. Access the admin dashboard at /admin/login
-- ============================================
