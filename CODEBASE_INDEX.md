# Grateful Tribe - Complete Codebase Index

**Project:** The Grateful Tribe Website  
**Version:** 1.0.0  
**Framework:** Next.js 14.1.0 (App Router)  
**Language:** TypeScript  
**Last Updated:** 2024

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Architecture](#core-architecture)
5. [Database Schema](#database-schema)
6. [Services Layer](#services-layer)
7. [Components Catalog](#components-catalog)
8. [Pages & Routes](#pages--routes)
9. [Authentication & Authorization](#authentication--authorization)
10. [Key Features](#key-features)

---

## Project Overview

The Grateful Tribe is a full-stack web application built with Next.js that serves as a platform for:
- Community engagement and impact tracking
- Course management and learning platform
- Content management system (CMS)
- Gallery and project showcase
- Testimonials and social proof
- Admin dashboard for content management

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14.1.0 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.3.0
- **UI Components:** Radix UI primitives
- **Animations:** Framer Motion 11.0.3
- **Icons:** Lucide React 0.344.0
- **Rich Text Editor:** Tiptap 3.9.0
- **State Management:** Zustand 4.5.0

### Backend & Database
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **API:** Supabase Client (@supabase/supabase-js 2.39.3)

### Development Tools
- **Linting:** ESLint 8
- **Package Manager:** npm
- **Build Tool:** Next.js built-in

### Key Dependencies
- `@dnd-kit/*` - Drag and drop functionality
- `react-dropzone` - File upload handling
- `react-player` - Video playback
- `react-colorful` - Color picker
- `react-countup` - Animated counters
- `date-fns` - Date formatting
- `class-variance-authority` - Component variants
- `tailwind-merge` - Tailwind class merging

---

## Project Structure

```
grateful_tribe/
├── .next/                      # Next.js build output
├── docs/                       # Documentation files
│   ├── code_catalog.md
│   ├── codebase_index.md
│   └── CONTENT_SCHEMA.json
├── public/                     # Static assets
│   ├── logo.svg
│   ├── placeholder-course.jpg
│   └── *.svg
├── scripts/                    # Utility scripts
├── src/                        # Source code
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── contexts/               # React contexts
│   ├── lib/                    # Utility libraries
│   ├── services/               # Business logic services
│   ├── types/                  # TypeScript type definitions
│   └── middleware.ts           # Next.js middleware
├── supabase/                   # Supabase migrations
│   └── migrations/
├── .env.local                  # Environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

---

## Core Architecture

### App Router Structure (`src/app/`)

#### Public Routes
- `/` - Home page
- `/about` - About page
- `/founder` - Founder page
- `/gallery` - Gallery page
- `/our-work` - Our work page
- `/projects` - Projects page
- `/testimonials` - Testimonials page
- `/work` - Work page

#### Authentication Routes (`(auth)/`)
- `/login` - User login
- `/signup` - User registration

#### User Dashboard (`dashboard/`)
- `/dashboard` - Dashboard home
- `/dashboard/courses` - User courses
- `/dashboard/profile` - User profile

#### Courses (`courses/`)
- `/courses` - Course listing
- `/courses/[id]` - Course details
- `/courses/[id]/lesson/[lessonId]` - Lesson viewer

#### Admin Routes (`admin/`)
- `/admin` - Admin dashboard
- `/admin/login` - Admin login
- `/admin/setup` - Initial setup
- `/admin/test-connection` - Database connection test
- `/admin/analytics` - Analytics dashboard
- `/admin/users` - User management
- `/admin/customization` - Site customization
- `/admin/website-customization` - Website customization

##### Admin Content Management
- `/admin/content/gallery` - Gallery management
- `/admin/content/projects` - Projects management
- `/admin/content/sections` - Sections management
- `/admin/content/testimonials` - Testimonials management

##### Admin Course Management
- `/admin/courses` - Course listing
- `/admin/courses/create` - Create course
- `/admin/courses/[id]` - Edit course
- `/admin/courses/[id]/modules` - Module management
- `/admin/courses/[id]/modules/[moduleId]` - Edit module
- `/admin/courses/[id]/modules/[moduleId]/lessons/create` - Create lesson
- `/admin/courses/[id]/modules/[moduleId]/lessons/[lessonId]` - Edit lesson

---

## Database Schema

### Core Tables

#### `profiles`
User profile information
- `id` (uuid, PK)
- `email` (text)
- `full_name` (text, nullable)
- `bio` (text, nullable)
- `avatar_url` (text, nullable)
- `role` (enum: 'user' | 'admin')
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `website_config`
Site-wide configuration settings
- `id` (uuid, PK)
- `config_key` (text, unique)
- `config_value` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `sections`
Page sections and content blocks
- `id` (uuid, PK)
- `section_key` (text, unique)
- `title` (text)
- `subtitle` (text, nullable)
- `content` (jsonb, nullable)
- `is_active` (boolean)
- `display_order` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Course System Tables

#### `courses`
Course information
- `id` (uuid, PK)
- `title` (text)
- `description` (text, nullable)
- `thumbnail_url` (text, nullable)
- `instructor_name` (text, nullable)
- `price` (numeric)
- `is_published` (boolean)
- `created_by` (uuid, FK to profiles)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `course_modules`
Course modules/chapters
- `id` (uuid, PK)
- `course_id` (uuid, FK to courses)
- `title` (text)
- `description` (text, nullable)
- `display_order` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `course_lessons`
Individual lessons/lectures
- `id` (uuid, PK)
- `module_id` (uuid, FK to course_modules)
- `title` (text)
- `description` (text, nullable)
- `content_type` (enum: 'video' | 'pdf' | 'audio' | 'document' | 'quiz' | 'text')
- `video_type` (enum: 'upload' | 'youtube' | 'url', nullable)
- `video_url` (text, nullable)
- `video_storage_path` (text, nullable)
- `duration` (integer, nullable)
- `is_free` (boolean)
- `is_preview` (boolean)
- `quiz_questions` (jsonb, nullable)
- `text_content` (text, nullable)
- `display_order` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `lecture_attachments`
Lesson attachments and resources
- `id` (uuid, PK)
- `lesson_id` (uuid, FK to course_lessons)
- `file_name` (text)
- `file_type` (text)
- `file_url` (text, nullable)
- `file_storage_path` (text, nullable)
- `file_size` (integer, nullable)
- `mime_type` (text, nullable)
- `display_order` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `user_course_enrollments`
User course enrollments
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles)
- `course_id` (uuid, FK to courses)
- `enrolled_at` (timestamp)

#### `user_lesson_progress`
User lesson progress tracking
- `id` (uuid, PK)
- `user_id` (uuid, FK to profiles)
- `lesson_id` (uuid, FK to course_lessons)
- `completed` (boolean)
- `last_watched_position` (integer)
- `completed_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Content Tables

#### `gallery_items`
Gallery media items
- `id` (uuid, PK)
- `title` (text, nullable)
- `description` (text, nullable)
- `media_type` (enum: 'image' | 'video')
- `media_url` (text)
- `thumbnail_url` (text, nullable)
- `category` (text, nullable)
- `display_order` (integer)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `projects`
Project showcase items
- `id` (uuid, PK)
- `title` (text)
- `description` (text, nullable)
- `image_url` (text, nullable)
- `status` (enum: 'active' | 'completed' | 'upcoming')
- `impact_stats` (jsonb, nullable)
- `technologies` (text[], nullable)
- `external_link` (text, nullable)
- `display_order` (integer)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `testimonials`
User testimonials
- `id` (uuid, PK)
- `author_name` (text)
- `author_role` (text, nullable)
- `author_avatar` (text, nullable)
- `content` (text)
- `rating` (integer, nullable)
- `is_featured` (boolean)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## Services Layer

### `AuthService` (`src/services/auth.service.ts`)
Handles authentication and user management
- `signUp(email, password, fullName)` - User registration
- `signIn(email, password)` - User login
- `signOut()` - User logout
- `getCurrentUser()` - Get current authenticated user
- `getProfile(userId)` - Get user profile
- `updateProfile(userId, updates)` - Update user profile
- `uploadAvatar(userId, file)` - Upload user avatar
- `adminLogin(username, password)` - Admin authentication

### `ConfigService` (`src/services/config.service.ts`)
Manages site configuration and settings
- `getSiteSetting(key)` - Get single setting
- `getAllSettings()` - Get all settings
- `updateSiteSetting(key, value)` - Update setting
- `getThemeColors()` - Get theme colors
- `updateConfig(key, value)` - Update configuration
- `updateSiteSettings(settings)` - Batch update settings
- `getSiteSettings()` - Get all site settings
- `getSocialLinks()` - Get social media links
- `getNavigation()` - Get navigation menu items

### `ContentService` (`src/services/content.service.ts`)
Manages content and media
- `getPageContent(pageKey, sectionKey)` - Get page content
- `getSection(key)` - Get section content
- `updatePageContent(pageKey, sectionKey, content)` - Update page content
- `getGalleryItems()` - Get gallery items
- `createGalleryItem(item)` - Create gallery item
- `deleteGalleryItem(id)` - Delete gallery item
- `getProjects()` - Get projects
- `createProject(project)` - Create project
- `updateProject(id, updates)` - Update project
- `deleteProject(id)` - Delete project
- `getTestimonials()` - Get testimonials
- `getFeaturedTestimonials()` - Get featured testimonials
- `createTestimonial(testimonial)` - Create testimonial
- `updateTestimonial(id, updates)` - Update testimonial
- `deleteTestimonial(id)` - Delete testimonial
- `uploadMedia(file, bucket, path)` - Upload media file

### `CourseService` (`src/services/course.service.ts`)
Manages courses, modules, and lessons
- `getPublishedCourses()` - Get published courses
- `getCourseWithContent(courseId)` - Get course with modules and lessons
- `isUserEnrolled(userId, courseId)` - Check enrollment status
- `enrollUser(userId, courseId)` - Enroll user in course
- `getUserEnrolledCourses(userId)` - Get user's enrolled courses
- `getCourseProgress(userId, courseId)` - Get course progress
- `updateLessonProgress(userId, lessonId, data)` - Update lesson progress
- `canAccessLesson(userId, lessonId)` - Check lesson access
- `createCourse(courseData)` - Create course (admin)
- `updateCourse(courseId, courseData)` - Update course (admin)
- `deleteCourse(courseId)` - Delete course (admin)
- `createModule(moduleData)` - Create module (admin)
- `createLesson(lessonData)` - Create lesson (admin)
- `updateLesson(lessonId, lessonData)` - Update lesson (admin)
- `uploadVideo(file, path)` - Upload video file

---

## Components Catalog

### Admin Components (`src/components/admin/`)

#### Core Admin Components
- `AdminSidebar.tsx` - Admin navigation sidebar
- `ColorPicker.tsx` - Color selection component
- `ImageUpload.tsx` - Image upload handler
- `MediaLibrary.tsx` - Media library browser
- `RichTextEditor.tsx` - Rich text editor (Tiptap)

#### Customization Editors (`src/components/admin/customization/`)
- `FooterEditor.tsx` - Footer customization
- `FounderPageEditor.tsx` - Founder page editor
- `GalleryPageEditor.tsx` - Gallery page editor
- `HeaderEditor.tsx` - Header customization
- `HomePageEditor.tsx` - Home page editor
- `OurTribeEditor.tsx` - Our Tribe section editor
- `OurWorkEditor.tsx` - Our Work section editor
- `PartnerPageEditor.tsx` - Partner page editor
- `TestimonialsPageEditor.tsx` - Testimonials editor
- `ThemeCustomizer.tsx` - Theme customization

### Course Components (`src/components/course/`)
- `CourseContent.tsx` - Course content display

### Dashboard Components (`src/components/dashboard/`)
- `DashboardSidebar.tsx` - User dashboard sidebar

### Layout Components (`src/components/layout/`)
- `Footer.tsx` - Site footer
- `Navbar.tsx` - Site navigation bar

### Section Components (`src/components/sections/`)
Public-facing page sections:
- `AboutSection.tsx` - About section
- `CoursesSection.tsx` - Courses showcase
- `FeaturedProjectsSection.tsx` - Featured projects
- `FounderHeroSection.tsx` - Founder hero section
- `FounderImpactSection.tsx` - Founder impact stats
- `FounderJourneySection.tsx` - Founder journey timeline
- `FounderPreviewSection.tsx` - Founder preview
- `FounderTribeSection.tsx` - Founder tribe section
- `GallerySection.tsx` - Gallery display
- `HeroSection.tsx` - Hero section
- `ImpactApproachSection.tsx` - Impact approach
- `ImpactStatsSection.tsx` - Impact statistics
- `JoinMissionSection.tsx` - Join mission CTA
- `JoinSalVisionSection.tsx` - Join Sal's vision CTA
- `MissionSection.tsx` - Mission statement
- `OurWorkSection.tsx` - Our work showcase
- `ProjectsSection.tsx` - Projects listing
- `TestimonialsSection.tsx` - Testimonials display
- `VisionSection.tsx` - Vision statement

### UI Components (`src/components/ui/`)
Reusable UI primitives (Radix UI based):
- `avatar.tsx` - Avatar component
- `button.tsx` - Button component
- `card.tsx` - Card component
- `dropdown-menu.tsx` - Dropdown menu
- `input.tsx` - Input field
- `label.tsx` - Label component
- `tabs.tsx` - Tabs component
- `textarea.tsx` - Textarea component

---

## Pages & Routes

### Public Pages
- **Home** (`/`) - Landing page with hero, mission, impact stats
- **About** (`/about`) - About the organization
- **Founder** (`/founder`) - Founder story and journey
- **Gallery** (`/gallery`) - Photo and video gallery
- **Our Work** (`/our-work`) - Work showcase
- **Projects** (`/projects`) - Project listings
- **Testimonials** (`/testimonials`) - User testimonials
- **Courses** (`/courses`) - Course catalog

### Authentication Pages
- **Login** (`/login`) - User login
- **Signup** (`/signup`) - User registration
- **Admin Login** (`/admin/login`) - Admin authentication

### User Dashboard
- **Dashboard Home** (`/dashboard`) - User dashboard overview
- **My Courses** (`/dashboard/courses`) - Enrolled courses
- **Profile** (`/dashboard/profile`) - User profile management

### Course Pages
- **Course Details** (`/courses/[id]`) - Course overview and enrollment
- **Lesson Viewer** (`/courses/[id]/lesson/[lessonId]`) - Lesson content viewer

### Admin Dashboard
- **Admin Home** (`/admin`) - Admin dashboard overview
- **Setup** (`/admin/setup`) - Initial setup wizard
- **Test Connection** (`/admin/test-connection`) - Database connection test
- **Analytics** (`/admin/analytics`) - Site analytics
- **Users** (`/admin/users`) - User management
- **Customization** (`/admin/customization`) - Site customization
- **Website Customization** (`/admin/website-customization`) - Advanced customization

### Admin Content Management
- **Gallery Management** (`/admin/content/gallery`) - Manage gallery items
- **Projects Management** (`/admin/content/projects`) - Manage projects
- **Sections Management** (`/admin/content/sections`) - Manage page sections
- **Testimonials Management** (`/admin/content/testimonials`) - Manage testimonials

### Admin Course Management
- **Courses** (`/admin/courses`) - Course management dashboard
- **Create Course** (`/admin/courses/create`) - Create new course
- **Edit Course** (`/admin/courses/[id]`) - Edit course details
- **Modules** (`/admin/courses/[id]/modules`) - Manage course modules
- **Edit Module** (`/admin/courses/[id]/modules/[moduleId]`) - Edit module
- **Create Lesson** (`/admin/courses/[id]/modules/[moduleId]/lessons/create`) - Create lesson
- **Edit Lesson** (`/admin/courses/[id]/modules/[moduleId]/lessons/[lessonId]`) - Edit lesson

---

## Authentication & Authorization

### Middleware (`src/middleware.ts`)
Next.js middleware handles route protection:
- **Public Admin Pages:** `/admin/login`, `/admin/test-connection`, `/admin/setup`
- **Protected Admin Routes:** All `/admin/*` routes (requires admin role)
- **Protected Dashboard Routes:** All `/dashboard/*` routes (requires authentication)

### Authentication Flow
1. User authenticates via Supabase Auth
2. Middleware checks session on protected routes
3. Admin routes verify user role from `profiles` table
4. Unauthorized users redirected to appropriate login page

### Role-Based Access Control
- **User Role:** Access to dashboard and enrolled courses
- **Admin Role:** Full access to admin panel and content management

---

## Key Features

### 1. Content Management System
- Dynamic page content editing
- Section-based content organization
- Rich text editing with Tiptap
- Media library management
- Drag-and-drop file uploads

### 2. Course Management Platform
- Course creation and publishing
- Module and lesson organization
- Multiple content types (video, PDF, audio, text, quiz)
- Video hosting (upload, YouTube, external URL)
- Progress tracking
- Enrollment management
- Free preview lessons

### 3. Gallery System
- Image and video support
- Category organization
- Display order management
- Active/inactive status

### 4. Project Showcase
- Project status tracking (active, completed, upcoming)
- Impact statistics
- Technology tags
- External links

### 5. Testimonials
- Featured testimonials
- Rating system
- Author information with avatars
- Active/inactive status

### 6. Theme Customization
- Color scheme customization
- Logo and branding
- Navigation menu management
- Footer customization
- Hero video configuration

### 7. User Dashboard
- Course enrollment
- Progress tracking
- Profile management
- Avatar upload

### 8. Admin Dashboard
- Analytics overview
- User management
- Content management
- Course management
- Site customization
- Database connection testing

---

## Utility Functions

### `src/lib/utils.ts`
- `cn(...inputs)` - Tailwind class merging
- `formatDate(date)` - Date formatting
- `formatDuration(seconds)` - Duration formatting (HH:MM:SS)
- `getYouTubeVideoId(url)` - Extract YouTube video ID
- `truncateText(text, maxLength)` - Text truncation
- `generateSlug(text)` - URL slug generation
- `hexToRgb(hex)` - Hex to RGB conversion
- `rgbToHex(r, g, b)` - RGB to Hex conversion

---

## Contexts

### `AuthContext` (`src/contexts/AuthContext.tsx`)
Provides authentication state and user information throughout the app

### `ThemeContext` (`src/contexts/ThemeContext.tsx`)
Manages theme settings and color customization

---

## Supabase Configuration

### Client (`src/lib/supabase/client.ts`)
Browser-side Supabase client for client components

### Server (`src/lib/supabase/server.ts`)
Server-side Supabase client for server components and API routes

---

## Environment Variables

Required environment variables (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
NEXT_PUBLIC_ADMIN_USERNAME=<admin-username>
NEXT_PUBLIC_ADMIN_PASSWORD=<admin-password>
```

---

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

---

## File Naming Conventions

- **Pages:** `page.tsx` (Next.js App Router convention)
- **Layouts:** `layout.tsx` (Next.js App Router convention)
- **Components:** PascalCase (e.g., `HeroSection.tsx`)
- **Services:** camelCase with `.service.ts` suffix (e.g., `auth.service.ts`)
- **Types:** camelCase with `.types.ts` suffix (e.g., `database.types.ts`)
- **Utilities:** camelCase with `.ts` suffix (e.g., `utils.ts`)

---

## Code Organization Principles

1. **Separation of Concerns:** Business logic in services, UI in components
2. **Type Safety:** TypeScript types for all database entities
3. **Reusability:** Shared UI components in `components/ui/`
4. **Modularity:** Feature-based organization (admin, dashboard, courses)
5. **Server/Client Split:** Proper use of Next.js server and client components

---

## Next Steps for Development

1. Review database migrations in `supabase/migrations/`
2. Check environment variables configuration
3. Test authentication flows
4. Verify admin access controls
5. Test course enrollment and progress tracking
6. Review content management workflows
7. Test media upload functionality
8. Verify theme customization features

---

**End of Codebase Index**
