-- Populate Initial Content for New System
-- This adds sample data so the website works immediately

-- Home Page Content
INSERT INTO public.page_content (page_key, section_key, content, is_active) VALUES
('home', 'hero', '{
  "badge": "Empowering Communities Worldwide",
  "title": "Lives Waiting to Be Changed Through Your Digital Success",
  "subtitle": "Join a revolutionary movement combining digital education with real-world impact. Your success helps children thrive.",
  "ctaText": "Join the Projects",
  "videoUrl": "/website-intro.mp4",
  "impactGoal": 10000
}'::jsonb, true),

('home', 'all', '{
  "hero": {
    "badge": "Empowering Communities Worldwide",
    "title": "Lives Waiting to Be Changed Through Your Digital Success",
    "subtitle": "Join a revolutionary movement combining digital education with real-world impact. Your success helps children thrive.",
    "ctaText": "Join the Projects",
    "videoUrl": "/website-intro.mp4",
    "impactGoal": 10000
  },
  "stats": [
    {"value": "10K+", "label": "Community Members"},
    {"value": "50+", "label": "Countries Reached"},
    {"value": "100+", "label": "Success Stories"},
    {"value": "95%", "label": "Success Rate"}
  ],
  "features": [
    {
      "title": "Make an Impact",
      "description": "Every action you take helps children in need. Your success directly contributes to changing lives."
    },
    {
      "title": "Earn While You Learn",
      "description": "Access cutting-edge training in crypto, AI, and digital skills. Create multiple income streams."
    },
    {
      "title": "Global Community",
      "description": "Connect with like-minded individuals worldwide. Share knowledge, grow together, succeed together."
    }
  ]
}'::jsonb, true)
ON CONFLICT (page_key, section_key) DO UPDATE 
SET content = EXCLUDED.content;

-- About/Our Tribe Page Content
INSERT INTO public.page_content (page_key, section_key, content, is_active) VALUES
('about', 'hero', '{
  "title": "Who We Are",
  "subtitle": "We are a community-driven organization dedicated to making a meaningful difference in the lives of those who need it most",
  "content": {
    "features": [
      {
        "icon": "heart",
        "title": "Uplifting Children",
        "description": "We use our profits to bring joys of childhood back to kids."
      },
      {
        "icon": "dollar",
        "title": "Empowering Everyone",
        "description": "We learn and share the skills needed to create part time to full time to live changing income."
      }
    ]
  }
}'::jsonb, true),

('our_tribe', 'all', '{
  "hero": {
    "heroTitle": "Who We Are",
    "heroSubtitle": "We are a community-driven organization dedicated to making a meaningful difference in the lives of those who need it most",
    "heroImage": ""
  },
  "sections": []
}'::jsonb, true)
ON CONFLICT (page_key, section_key) DO UPDATE 
SET content = EXCLUDED.content;

-- Add more site settings
INSERT INTO public.site_settings (setting_key, setting_value, category) VALUES
('hero_video', '"/website-intro.mp4"'::jsonb, 'general'),
('site_logo', '"/TGT-LOGO-removebg.png"'::jsonb, 'general')
ON CONFLICT (setting_key) DO NOTHING;

-- Add default navigation items (if table is empty)
INSERT INTO public.navigation_items (menu_key, label, url, display_order, is_active) VALUES
('main', 'Home', '/', 1, true),
('main', 'Our Tribe', '/about', 2, true),
('main', 'Our Founder', '/founder', 3, true),
('main', 'Partner with Us', '/projects', 4, true),
('main', 'Courses', '/courses', 5, true),
('main', 'Gallery', '/gallery', 6, true),
('main', 'Testimonials', '/testimonials', 7, true)
ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON COLUMN public.page_content.content IS 'Flexible JSON structure - can store any page content structure';
