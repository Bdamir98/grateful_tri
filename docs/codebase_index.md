# GratefulTribe Codebase Reference Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Code Definitions Index](#code-definitions-index)
5. [Routes & API Reference](#routes--api-reference)
6. [Component Patterns](#component-patterns)
7. [State Management](#state-management)
8. [Database Schema](#database-schema)
9. [Development Guide](#development-guide)
10. [Quick Reference](#quick-reference)

---

## Project Overview

GratefulTribe is a comprehensive web platform built with Next.js 14 that provides a learning management system (LMS) combined with an organizational website. The platform enables course creation, user management, content management, and website customization through an admin panel.

### Architecture Summary

The application follows a modern React/Next.js architecture with:
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and Radix UI components
- **Backend**: Supabase for database, authentication, and real-time features
- **State Management**: React Context for authentication and theme management
- **File Structure**: App Router with organized feature-based components

---

## Technology Stack

### Core Framework & Runtime
- **Next.js 14.1.0**: React framework with App Router
- **React 18.2.0**: UI library
- **TypeScript 5.0.0**: Type safety and developer experience

### UI & Styling
- **Tailwind CSS 3.3.0**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion 11.0.3**: Animation library
- **Lucide React 0.344.0**: Icon library

### State & Data Management
- **Zustand 4.5.0**: Lightweight state management
- **Supabase 2.39.3**: Backend-as-a-Service (Database, Auth, Storage)

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **TypeScript**: Type checking

### Content & Media
- **TipTap**: Rich text editor
- **React Player 2.14.1**: Video player
- **React Dropzone 14.3.8**: File uploads
- **React Image Crop 11.0.10**: Image cropping

### Utilities
- **Date-fns 4.1.0**: Date manipulation
- **Class Variance Authority**: Component variant management
- **Tailwind Merge**: CSS class merging

---

## Directory Structure

```
grateful_tribe/
├── docs/                    # Documentation
├── public/                  # Static assets
├── scripts/                 # Build/development scripts
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/         # Authentication routes
│   │   ├── admin/          # Admin panel routes
│   │   ├── courses/        # Course-related pages
│   │   ├── dashboard/      # User dashboard
│   │   └── [page]/         # Public pages (about, gallery, etc.)
│   ├── components/         # Reusable React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── course/         # Course-related components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   ├── sections/       # Page section components
│   │   └── ui/             # Base UI components
│   ├── contexts/           # React Context providers
│   ├── lib/                # Utility libraries
│   │   ├── supabase/       # Supabase client configuration
│   │   └── utils.ts        # General utilities
│   ├── services/           # Business logic services
│   └── types/              # TypeScript type definitions
├── supabase/               # Database migrations
└── [config files]          # Next.js, Tailwind, TypeScript configs
```

### Key Folders Explained

- **`/src/app`**: Next.js App Router directory with route-based organization
- **`/src/components`**: Feature-organized React components
- **`/src/services`**: Business logic layer with service classes
- **`/src/types`**: Centralized TypeScript definitions
- **`/src/contexts`**: Global state management via React Context
- **`/src/lib`**: Utility functions and external service integrations

---

## Code Definitions Index

### Types (src/types/database.types.ts)
- `Database`: Main database interface with Supabase schema
- `Profile`: User profile with authentication details
- `WebsiteConfig`: Dynamic website configuration
- `Section`: Content sections for pages
- `Course/CourseModule/CourseLesson`: Learning content hierarchy
- `GalleryItem/Project/Testimonial`: Content management types
- `UserCourseEnrollment/UserLessonProgress`: Learning progress tracking

### Services (src/services/)
- `AuthService`: User authentication, profile management, admin login
- `ConfigService`: Website settings, theme colors, navigation
- `ContentService`: Gallery, projects, testimonials, media uploads
- `CourseService`: Course CRUD, enrollment, progress tracking

### Contexts (src/contexts/)
- `AuthContext`: User authentication state and methods
- `ThemeContext`: Dynamic theming with CSS custom properties

### Components
- **Admin Components**: CMS interface, content editors, theme customization
- **UI Components**: Reusable primitives (Button, Card, Input, etc.)
- **Section Components**: Homepage sections, founder pages
- **Layout Components**: Navigation, footer, sidebars

---

## Routes & API Reference

### Public Routes
- `/` - Homepage with hero section
- `/about` - About page
- `/founder` - Founder profile and story
- `/gallery` - Media gallery
- `/our-work` - Projects showcase
- `/projects` - Detailed projects listing
- `/testimonials` - Client testimonials
- `/work` - Work/services page
- `/courses` - Public course catalog
- `/courses/[id]` - Individual course page
- `/courses/[id]/lesson/[lessonId]` - Course lesson viewer

### Authentication Routes
- `/login` - User login
- `/signup` - User registration

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/login` - Admin authentication
- `/admin/setup` - Initial setup
- `/admin/analytics` - Analytics dashboard
- `/admin/courses` - Course management
- `/admin/courses/create` - Create new course
- `/admin/courses/[id]` - Edit course
- `/admin/courses/[id]/modules` - Manage course modules
- `/admin/courses/[id]/modules/[moduleId]/lessons` - Manage lessons
- `/admin/content/*` - Content management (gallery, projects, testimonials)
- `/admin/customization` - Website customization
- `/admin/users` - User management

### User Dashboard Routes
- `/dashboard` - User dashboard overview
- `/dashboard/courses` - Enrolled courses
- `/dashboard/profile` - User profile settings

### Service Methods (API Reference)

#### AuthService
- `signUp(email, password, fullName)` - User registration
- `signIn(email, password)` - User authentication
- `signOut()` - User logout
- `getCurrentUser()` - Current session user
- `getProfile(userId)` - User profile data
- `uploadAvatar(userId, file)` - Profile picture upload

#### CourseService
- `getPublishedCourses()` - Public course listing
- `getCourseWithContent(courseId)` - Full course data with lessons
- `isUserEnrolled(userId, courseId)` - Enrollment check
- `enrollUser(userId, courseId)` - Course enrollment
- `getUserEnrolledCourses(userId)` - User's enrolled courses
- `updateLessonProgress(userId, lessonId, completed)` - Progress tracking

#### ContentService
- `getPageContent(pageKey, sectionKey)` - Dynamic page content
- `getGalleryItems()` - Gallery media
- `createProject(project)` - Project creation
- `getTestimonials()` - Testimonial data

#### ConfigService
- `getSiteSetting(key)` - Individual setting retrieval
- `updateSiteSettings(settings)` - Bulk settings update
- `getThemeColors()` - Theme configuration
- `getNavigation()` - Site navigation structure

---

## Component Patterns

### Component Organization
Components are organized by feature and responsibility:
- **UI Components**: Atomic, reusable primitives in `/ui`
- **Feature Components**: Business-specific components in feature folders
- **Layout Components**: Page structure and navigation
- **Section Components**: Homepage content blocks

### Common Patterns

#### Props Interface Pattern
```typescript
interface ComponentProps {
  title?: string
  children: ReactNode
  variant?: 'default' | 'featured'
}

export function Component({ title, children, variant = 'default' }: ComponentProps) {
  // Implementation
}
```

#### Service Integration Pattern
```typescript
'use client'

import { useEffect, useState } from 'react'
import { ContentService } from '@/services/content.service'

export function DataComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ContentService.getData()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  // Render logic
}
```

#### Context Consumer Pattern
```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export function ProtectedComponent() {
  const { user, profile } = useAuth()

  if (!user) return <LoginPrompt />

  return <div>Welcome {profile?.full_name}</div>
}
```

### Reusable Components

#### UI Primitives
- `Button`: Variants (default, outline, ghost, link)
- `Card`: Content containers with headers/footers
- `Input/Textarea`: Form inputs with validation
- `Tabs`: Tabbed interfaces
- `Avatar`: User profile images

#### Admin Components
- `RichTextEditor`: Content editing with TipTap
- `ImageUpload`: Media upload with preview
- `ColorPicker`: Theme color selection
- `MediaLibrary`: File management interface

#### Layout Components
- `Navbar`: Main navigation with auth state
- `Footer`: Site footer with configurable content
- `AdminSidebar`: Admin panel navigation

---

## State Management

### Context Providers

#### AuthContext
**Purpose**: Global authentication state management
**State**: `user`, `profile`, `isLoading`
**Methods**: `signIn`, `signUp`, `signOut`, `refreshProfile`

#### ThemeContext
**Purpose**: Dynamic theming and customization
**State**: `colors` (primary, secondary, accent, etc.)
**Methods**: `updateColors`, `refreshTheme`

### State Management Patterns

#### Server State
- Supabase handles server state and real-time updates
- Services layer abstracts database operations
- Context providers sync client state with server

#### Client State
- React Context for shared state (auth, theme)
- Local component state for UI-specific state
- URL state for routing and filters

#### Data Flow
1. User actions trigger service methods
2. Services interact with Supabase
3. Context providers update shared state
4. Components re-render based on state changes

---

## Database Schema

### Core Tables

#### User Management
- `profiles`: Extended user information (bio, avatar, role)
- `user_course_enrollments`: Course enrollment tracking
- `user_lesson_progress`: Individual lesson completion

#### Content Management
- `courses`: Course catalog with metadata
- `course_modules`: Course structure (modules within courses)
- `course_lessons`: Individual lessons with content
- `lecture_attachments`: Additional lesson resources

#### Website Content
- `website_config`: Dynamic site settings and configuration
- `sections`: Page content sections
- `gallery_items`: Media gallery content
- `projects`: Project showcase
- `testimonials`: Client testimonials

### Key Relationships

```
profiles (users)
├── user_course_enrollments → courses
├── user_lesson_progress → course_lessons
└── role-based access (admin/user)

courses
├── course_modules
│   └── course_lessons
│       └── lecture_attachments
└── user_course_enrollments
```

### Data Types
- **Text Content**: Rich text stored as JSON or HTML
- **Media**: File URLs with Supabase Storage integration
- **Configuration**: Key-value pairs for dynamic settings
- **Progress Tracking**: Boolean completion states with timestamps

---

## Development Guide

### Code Style & Conventions

#### File Naming
- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Services: `kebab-case.service.ts` (e.g., `auth.service.ts`)
- Types: `kebab-case.types.ts` (e.g., `database.types.ts`)
- Utils: `kebab-case.ts` (e.g., `utils.ts`)

#### Import Organization
```typescript
// External libraries first
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

// Internal imports by type
import { AuthService } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import type { Profile } from '@/types/database.types'
```

#### Component Patterns
- Use functional components with hooks
- Prefer custom hooks for shared logic
- Implement proper TypeScript interfaces for props
- Use early returns for conditional rendering

#### State Management
- Use Context for app-wide state (auth, theme)
- Use local state for component-specific state
- Prefer server state over client state when possible

### Best Practices

#### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Use Supabase real-time subscriptions sparingly

#### Security
- Validate user input on both client and server
- Use Row Level Security (RLS) in Supabase
- Implement proper authentication checks

#### Accessibility
- Use semantic HTML elements
- Implement ARIA labels where needed
- Ensure keyboard navigation support

---

## Quick Reference

### Common Imports
```typescript
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { AuthService } from '@/services/auth.service'
import { ConfigService } from '@/services/config.service'
```

### Environment Setup
```bash
npm install
npm run dev
```

### Database Connection
- Uses Supabase client from `@/lib/supabase/client`
- Server-side operations use `@/lib/supabase/server`

### Authentication Flow
1. User signs in via `AuthService.signIn()`
2. AuthContext updates user state
3. Protected routes check `useAuth().user`
4. Profile data loaded via `AuthService.getProfile()`

### Content Management
- Dynamic content loaded via `ConfigService.getSiteSetting()`
- Media uploads handled by `ContentService.uploadMedia()`
- Rich text editing with TipTap integration

### Theme Customization
- Colors managed via `ThemeContext.updateColors()`
- CSS custom properties applied to `:root`
- Persisted via `ConfigService.updateSiteSettings()`

### File Structure Shortcuts
- Add new page: `src/app/[route]/page.tsx`
- Add new component: `src/components/[feature]/[Component].tsx`
- Add new service: `src/services/[feature].service.ts`
- Add new type: `src/types/[feature].types.ts`

---

*Generated on 2025-10-29 for GratefulTribe platform v1.0.0*