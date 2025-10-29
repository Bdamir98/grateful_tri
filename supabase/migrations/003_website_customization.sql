-- Website Customization System Migration
-- Creates tables for dynamic content management

-- Page Content Table (stores all page sections)
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL, -- 'home', 'our_tribe', 'founder', 'partner', 'gallery', 'testimonials'
  section_key TEXT NOT NULL, -- 'hero', 'about', 'features', etc.
  content JSONB NOT NULL DEFAULT '{}', -- Flexible JSON structure for any content
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_key, section_key)
);

-- Page Media Assets
CREATE TABLE IF NOT EXISTS public.page_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL,
  media_key TEXT NOT NULL, -- 'hero_image', 'background_video', 'logo', etc.
  media_type TEXT CHECK (media_type IN ('image', 'video', 'icon', 'document')) NOT NULL,
  media_url TEXT,
  storage_path TEXT,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_key, media_key)
);

-- Theme Settings (colors, fonts, spacing)
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_key TEXT UNIQUE NOT NULL DEFAULT 'default',
  colors JSONB NOT NULL DEFAULT '{
    "primary": "#7c3aed",
    "secondary": "#fbbf24",
    "accent": "#ec4899",
    "background": "#ffffff",
    "text": "#1f2937",
    "textSecondary": "#6b7280",
    "success": "#10b981",
    "error": "#ef4444",
    "warning": "#f59e0b"
  }',
  fonts JSONB NOT NULL DEFAULT '{
    "heading": "Inter",
    "body": "Inter",
    "mono": "JetBrains Mono"
  }',
  spacing JSONB NOT NULL DEFAULT '{
    "sectionPadding": "80px",
    "containerWidth": "1280px",
    "borderRadius": "8px"
  }',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings (global configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  category TEXT, -- 'general', 'social', 'seo', 'analytics'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Navigation Menu Items
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_key TEXT NOT NULL DEFAULT 'main', -- 'main', 'footer', 'mobile'
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  opens_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_content_page_key ON public.page_content(page_key);
CREATE INDEX IF NOT EXISTS idx_page_content_section_key ON public.page_content(section_key);
CREATE INDEX IF NOT EXISTS idx_page_content_active ON public.page_content(is_active);
CREATE INDEX IF NOT EXISTS idx_page_media_page_key ON public.page_media(page_key);
CREATE INDEX IF NOT EXISTS idx_navigation_menu ON public.navigation_items(menu_key, display_order);

-- Enable RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read, admin write

-- Page Content Policies
CREATE POLICY "Page content viewable by everyone" ON public.page_content
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify page content" ON public.page_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Page Media Policies
CREATE POLICY "Page media viewable by everyone" ON public.page_media
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify page media" ON public.page_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Theme Settings Policies
CREATE POLICY "Theme settings viewable by everyone" ON public.theme_settings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify theme" ON public.theme_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Site Settings Policies
CREATE POLICY "Site settings viewable by everyone" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Navigation Policies
CREATE POLICY "Active navigation viewable by everyone" ON public.navigation_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can modify navigation" ON public.navigation_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update triggers
CREATE TRIGGER update_page_content_updated_at 
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_media_updated_at 
  BEFORE UPDATE ON public.page_media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_settings_updated_at 
  BEFORE UPDATE ON public.theme_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_navigation_items_updated_at 
  BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default theme
INSERT INTO public.theme_settings (theme_key, colors, fonts) VALUES
('default', '{
  "primary": "#7c3aed",
  "secondary": "#fbbf24",
  "accent": "#ec4899",
  "background": "#ffffff",
  "text": "#1f2937",
  "textSecondary": "#6b7280"
}'::jsonb, '{
  "heading": "Inter",
  "body": "Inter"
}'::jsonb)
ON CONFLICT (theme_key) DO NOTHING;

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, category) VALUES
('site_name', '"The Grateful Tribe"'::jsonb, 'general'),
('site_tagline', '"Empowering Communities Worldwide"'::jsonb, 'general'),
('contact_email', '"contact@gratefultribe.org"'::jsonb, 'general'),
('impact_goal', '10000'::jsonb, 'general')
ON CONFLICT (setting_key) DO NOTHING;

-- Comments
COMMENT ON TABLE public.page_content IS 'Stores dynamic content for all website pages';
COMMENT ON TABLE public.page_media IS 'Stores media assets (images, videos) for pages';
COMMENT ON TABLE public.theme_settings IS 'Stores website theme (colors, fonts, spacing)';
COMMENT ON TABLE public.site_settings IS 'Global website settings';
COMMENT ON TABLE public.navigation_items IS 'Website navigation menu items';
