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
}'::jsonb);

-- Insert default sections
INSERT INTO public.sections (section_key, title, subtitle, content, display_order) VALUES
('hero', 'Welcome to The Grateful Tribe', 'Using 1st world opportunities to uplift 3rd world communities', '{
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
}'::jsonb, 6);

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
