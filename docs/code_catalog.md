# Code Definitions Catalog

This document provides a comprehensive catalog of code definitions extracted from TypeScript files in the `src/` directory. Organized by file path, it covers React components, custom hooks, service functions, type definitions, utility functions, and context providers.

## Table of Contents

- [Types](#types)
- [Services](#services)
- [Contexts](#contexts)
- [Lib](#lib)
- [Components](#components)
- [App Pages](#app-pages)

## Types

### src/types/database.types.ts

#### Interfaces
- [`Database`](src/types/database.types.ts:1) - Main database interface
- [`Profile`](src/types/database.types.ts:68) - User profile interface
- [`WebsiteConfig`](src/types/database.types.ts:79) - Website configuration interface
- [`Section`](src/types/database.types.ts:87) - Website section interface
- [`Course`](src/types/database.types.ts:99) - Course interface
- [`CourseModule`](src/types/database.types.ts:112) - Course module interface
- [`CourseLesson`](src/types/database.types.ts:122) - Course lesson interface
- [`LectureAttachment`](src/types/database.types.ts:141) - Lecture attachment interface
- [`UserCourseEnrollment`](src/types/database.types.ts:155) - User course enrollment interface
- [`UserLessonProgress`](src/types/database.types.ts:162) - User lesson progress interface
- [`GalleryItem`](src/types/database.types.ts:173) - Gallery item interface
- [`Project`](src/types/database.types.ts:187) - Project interface
- [`Testimonial`](src/types/database.types.ts:202) - Testimonial interface
- [`CourseWithModules extends Course`](src/types/database.types.ts:216) - Course with modules interface
- [`EnrolledCourse extends Course`](src/types/database.types.ts:230) - Enrolled course interface

## Services

### src/services/auth.service.ts

#### Classes
- [`AuthService`](src/services/auth.service.ts:4) - Authentication service class

#### Methods
- [`signUp(email: string, password: string, fullName: string)`](src/services/auth.service.ts:5) - User sign up
- [`signIn(email: string, password: string)`](src/services/auth.service.ts:34) - User sign in
- [`signOut()`](src/services/auth.service.ts:48) - User sign out
- [`getCurrentUser()`](src/services/auth.service.ts:58) - Get current user
- [`getProfile(userId: string): Promise<Profile | null>`](src/services/auth.service.ts:68) - Get user profile
- [`updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean>`](src/services/auth.service.ts:84) - Update user profile
- [`uploadAvatar(userId: string, file: File): Promise<string | null>`](src/services/auth.service.ts:99) - Upload user avatar
- [`adminLogin(username: string, password: string): Promise<boolean>`](src/services/auth.service.ts:123) - Admin login

### src/services/config.service.ts

#### Classes
- [`ConfigService`](src/services/config.service.ts:3) - Configuration service class

#### Methods
- [`getSiteSetting(key: string): Promise<any>`](src/services/config.service.ts:5) - Get site setting
- [`getAllSettings(): Promise<Record<string, any>>`](src/services/config.service.ts:21) - Get all settings
- [`updateSiteSetting(key: string, value: any): Promise<boolean>`](src/services/config.service.ts:41) - Update site setting
- [`getThemeColors(): Promise<{ primary: string; secondary: string; accent: string }>`](src/services/config.service.ts:61) - Get theme colors
- [`updateSiteSettings(settings: { [key: string]: any }): Promise<boolean>`](src/services/config.service.ts:104) - Update site settings
- [`getSiteSettings(): Promise<Record<string, any>>`](src/services/config.service.ts:142) - Get site settings
- [`getSocialLinks(): Promise<Record<string, string>>`](src/services/config.service.ts:173) - Get social links
- [`getNavigation(): Promise<{ items: Array<{ id: string; label: string; href: string }> }>`](src/services/config.service.ts:178) - Get navigation

### src/services/content.service.ts

#### Classes
- [`ContentService`](src/services/content.service.ts:4) - Content service class

#### Methods
- [`getPageContent(pageKey: string, sectionKey: string = 'all'): Promise<any>`](src/services/content.service.ts:6) - Get page content
- [`getSection(key: string): Promise<any>`](src/services/content.service.ts:23) - Get section
- [`updatePageContent(pageKey: string, sectionKey: string, content: any): Promise<boolean>`](src/services/content.service.ts:40) - Update page content
- [`getGalleryItems(): Promise<GalleryItem[]>`](src/services/content.service.ts:62) - Get gallery items
- [`createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryItem | null>`](src/services/content.service.ts:78) - Create gallery item
- [`deleteGalleryItem(id: string): Promise<boolean>`](src/services/content.service.ts:94) - Delete gallery item
- [`getProjects(): Promise<Project[]>`](src/services/content.service.ts:110) - Get projects
- [`createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null>`](src/services/content.service.ts:126) - Create project
- [`updateProject(id: string, updates: Partial<Project>): Promise<boolean>`](src/services/content.service.ts:142) - Update project
- [`deleteProject(id: string): Promise<boolean>`](src/services/content.service.ts:157) - Delete project
- [`getTestimonials(): Promise<Testimonial[]>`](src/services/content.service.ts:173) - Get testimonials
- [`getFeaturedTestimonials(): Promise<Testimonial[]>`](src/services/content.service.ts:189) - Get featured testimonials
- [`createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial | null>`](src/services/content.service.ts:207) - Create testimonial
- [`updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<boolean>`](src/services/content.service.ts:223) - Update testimonial
- [`deleteTestimonial(id: string): Promise<boolean>`](src/services/content.service.ts:238) - Delete testimonial
- [`uploadMedia(file: File, bucket: string, path: string): Promise<string | null>`](src/services/content.service.ts:254) - Upload media

### src/services/course.service.ts

#### Classes
- [`CourseService`](src/services/course.service.ts:4) - Course service class

#### Methods
- [`getPublishedCourses(): Promise<Course[]>`](src/services/course.service.ts:6) - Get published courses
- [`getCourseWithContent(courseId: string): Promise<CourseWithModules | null>`](src/services/course.service.ts:23) - Get course with content
- [`isUserEnrolled(userId: string, courseId: string): Promise<boolean>`](src/services/course.service.ts:78) - Check if user is enrolled
- [`enrollUser(userId: string, courseId: string): Promise<boolean>`](src/services/course.service.ts:96) - Enroll user in course
- [`getUserEnrolledCourses(userId: string): Promise<EnrolledCourse[]>`](src/services/course.service.ts:111) - Get user's enrolled courses
- [`getCourseProgress(userId: string, courseId: string): Promise<{ completed_lessons: number; total_lessons: number; percentage: number }>`](src/services/course.service.ts:147) - Get course progress
- [`updateLessonProgress(userId: string, lessonId: string, completed: boolean): Promise<boolean>`](src/services/course.service.ts:191) - Update lesson progress
- [`canAccessLesson(userId: string | null, lessonId: string): Promise<boolean>`](src/services/course.service.ts:215) - Check if user can access lesson
- [`createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course | null>`](src/services/course.service.ts:245) - Create course
- [`updateCourse(courseId: string, courseData: Partial<Course>): Promise<boolean>`](src/services/course.service.ts:262) - Update course
- [`deleteCourse(courseId: string): Promise<boolean>`](src/services/course.service.ts:278) - Delete course
- [`createModule(moduleData: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>): Promise<CourseModule | null>`](src/services/course.service.ts:294) - Create module
- [`createLesson(lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>): Promise<CourseLesson | null>`](src/services/course.service.ts:311) - Create lesson
- [`updateLesson(lessonId: string, lessonData: Partial<CourseLesson>): Promise<boolean>`](src/services/course.service.ts:328) - Update lesson
- [`uploadVideo(file: File, path: string): Promise<string | null>`](src/services/course.service.ts:344) - Upload video

## Contexts

### src/contexts/AuthContext.tsx

#### Interfaces
- [`AuthContextType`](src/contexts/AuthContext.tsx:9) - Authentication context type interface

#### Context Providers
- [`AuthProvider({ children }: { children: ReactNode })`](src/contexts/AuthContext.tsx:22) - Authentication provider component

#### Hooks
- [`useAuth()`](src/contexts/AuthContext.tsx:100) - Custom hook for authentication context

### src/contexts/ThemeContext.tsx

#### Interfaces
- [`ThemeColors`](src/contexts/ThemeContext.tsx:6) - Theme colors interface
- [`ThemeContextType`](src/contexts/ThemeContext.tsx:15) - Theme context type interface

#### Context Providers
- [`ThemeProvider({ children }: { children: ReactNode })`](src/contexts/ThemeContext.tsx:24) - Theme provider component

#### Hooks
- [`useTheme()`](src/contexts/ThemeContext.tsx:75) - Custom hook for theme context

## Lib

### src/lib/utils.ts

#### Functions
- [`formatDate(date: string | Date): string`](src/lib/utils.ts:8) - Format date utility
- [`formatDuration(seconds: number): string`](src/lib/utils.ts:16) - Format duration utility
- [`getYouTubeVideoId(url: string): string | null`](src/lib/utils.ts:27) - Extract YouTube video ID
- [`truncateText(text: string, maxLength: number): string`](src/lib/utils.ts:33) - Truncate text utility
- [`generateSlug(text: string): string`](src/lib/utils.ts:38) - Generate slug from text
- [`hexToRgb(hex: string): { r: number; g: number; b: number } | null`](src/lib/utils.ts:47) - Convert hex to RGB

### src/lib/supabase/client.ts

*No significant definitions found*

### src/lib/supabase/server.ts

#### Functions
- [`createServiceRoleClient()`](src/lib/supabase/server.ts:11) - Create service role Supabase client

## Components

### Admin Components

#### src/components/admin/
- [`AdminSidebar()`](src/components/admin/AdminSidebar.tsx:21) - Admin sidebar navigation component

#### src/components/admin/
- [`ColorPicker({ label, value, onChange }: ColorPickerProps)`](src/components/admin/ColorPicker.tsx:13) - Color picker component for theme customization
- [`ImageUpload({ label, currentImage, onUpload, storagePath = 'website', acceptVideo = false, maxSizeMB = 5, helpText }: ImageUploadProps)`](src/components/admin/ImageUpload.tsx:20) - Image upload component with media library integration
- [`MediaLibrary({ onSelect, multiple = false, accept = 'image/*' }: MediaLibraryProps)`](src/components/admin/MediaLibrary.tsx:27) - Media library component for file management
- [`RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps)`](src/components/admin/RichTextEditor.tsx:29) - Rich text editor component

#### src/components/admin/customization/
- [`FooterEditor()`](src/components/admin/customization/FooterEditor.tsx:22) - Footer customization editor
- [`FounderPageEditor()`](src/components/admin/customization/FounderPageEditor.tsx:13) - Founder page content editor
- [`GalleryPageEditor()`](src/components/admin/customization/GalleryPageEditor.tsx:8) - Gallery page settings editor
- [`HeaderEditor()`](src/components/admin/customization/HeaderEditor.tsx:12) - Header customization editor
- [`HomePageEditor()`](src/components/admin/customization/HomePageEditor.tsx:13) - Home page content editor
- [`OurTribeEditor()`](src/components/admin/customization/OurTribeEditor.tsx:24) - Our tribe section editor
- [`OurWorkEditor()`](src/components/admin/customization/OurWorkEditor.tsx:29) - Our work section editor
- [`PartnerPageEditor()`](src/components/admin/customization/PartnerPageEditor.tsx:14) - Partner page content editor
- [`TestimonialsPageEditor()`](src/components/admin/customization/TestimonialsPageEditor.tsx:13) - Testimonials page editor
- [`ThemeCustomizer()`](src/components/admin/customization/ThemeCustomizer.tsx:11) - Theme customization component

### Course Components

#### src/components/course/
- [`CourseContent({ courseId, modules, totalLectures, totalDuration, isEnrolled = false }: CourseContentProps)`](src/components/course/CourseContent.tsx:15) - Course content display component

### Dashboard Components

#### src/components/dashboard/
- [`DashboardSidebar()`](src/components/dashboard/DashboardSidebar.tsx:9) - Dashboard sidebar navigation component

### Layout Components

#### src/components/layout/
- [`Footer()`](src/components/layout/Footer.tsx:28) - Main footer component
- [`Navbar()`](src/components/layout/Navbar.tsx:36) - Main navigation bar component

### Sections Components

#### src/components/sections/
- [`AboutSection()`](src/components/sections/AboutSection.tsx:8) - About section component
- [`CoursesSection()`](src/components/sections/CoursesSection.tsx:11) - Courses section component
- [`FeaturedProjectsSection()`](src/components/sections/FeaturedProjectsSection.tsx:6) - Featured projects section component
- [`FounderHeroSection()`](src/components/sections/FounderHeroSection.tsx:9) - Founder hero section component
- [`FounderImpactSection()`](src/components/sections/FounderImpactSection.tsx:6) - Founder impact section component
- [`FounderJourneySection()`](src/components/sections/FounderJourneySection.tsx:6) - Founder journey section component
- [`FounderPreviewSection()`](src/components/sections/FounderPreviewSection.tsx:9) - Founder preview section component
- [`FounderTribeSection()`](src/components/sections/FounderTribeSection.tsx:5) - Founder tribe section component
- [`GallerySection()`](src/components/sections/GallerySection.tsx:16) - Gallery section component
- [`HeroSection()`](src/components/sections/HeroSection.tsx:12) - Main hero section component
- [`ImpactApproachSection()`](src/components/sections/ImpactApproachSection.tsx:17) - Impact approach section component
- [`ImpactStatsSection()`](src/components/sections/ImpactStatsSection.tsx:5) - Impact statistics section component
- [`JoinMissionSection()`](src/components/sections/JoinMissionSection.tsx:7) - Join mission section component
- [`JoinSalVisionSection()`](src/components/sections/JoinSalVisionSection.tsx:7) - Join Sal vision section component
- [`MissionSection()`](src/components/sections/MissionSection.tsx:8) - Mission section component
- [`OurWorkSection()`](src/components/sections/OurWorkSection.tsx:23) - Our work section component
- [`ProjectsSection()`](src/components/sections/ProjectsSection.tsx:10) - Projects section component
- [`TestimonialsSection()`](src/components/sections/TestimonialsSection.tsx:9) - Testimonials section component
- [`VisionSection()`](src/components/sections/VisionSection.tsx:8) - Vision section component

### UI Components

#### src/components/ui/
- [`Avatar`](src/components/ui/avatar.tsx:7) - Avatar component
- [`AvatarImage`](src/components/ui/avatar.tsx:23) - Avatar image component
- [`AvatarFallback`](src/components/ui/avatar.tsx:35) - Avatar fallback component
- [`Button`](src/components/ui/button.tsx:42) - Button component
- [`Card`](src/components/ui/card.tsx:7) - Card component
- [`CardHeader`](src/components/ui/card.tsx:22) - Card header component
- [`CardFooter`](src/components/ui/card.tsx:34) - Card footer component
- [`CardTitle`](src/components/ui/card.tsx:49) - Card title component
- [`CardDescription`](src/components/ui/card.tsx:69) - Card description component
- [`DropdownMenu`](src/components/ui/dropdown-menu.tsx:1) - Dropdown menu component
- [`DropdownMenuTrigger`](src/components/ui/dropdown-menu.tsx:1) - Dropdown menu trigger component
- [`DropdownMenuContent`](src/components/ui/dropdown-menu.tsx:59) - Dropdown menu content component
- [`DropdownMenuItem`](src/components/ui/dropdown-menu.tsx:79) - Dropdown menu item component
- [`DropdownMenuCheckboxItem`](src/components/ui/dropdown-menu.tsx:95) - Dropdown menu checkbox item component
- [`DropdownMenuRadioItem`](src/components/ui/dropdown-menu.tsx:119) - Dropdown menu radio item component
- [`DropdownMenuLabel`](src/components/ui/dropdown-menu.tsx:143) - Dropdown menu label component
- [`DropdownMenuSeparator`](src/components/ui/dropdown-menu.tsx:159) - Dropdown menu separator component
- [`DropdownMenuShortcut`](src/components/ui/dropdown-menu.tsx:169) - Dropdown menu shortcut component
- [`Input`](src/components/ui/input.tsx:8) - Input component
- [`Label`](src/components/ui/label.tsx:14) - Label component
- [`Tabs`](src/components/ui/tabs.tsx:1) - Tabs component
- [`TabsList`](src/components/ui/tabs.tsx:12) - Tabs list component
- [`TabsTrigger`](src/components/ui/tabs.tsx:27) - Tabs trigger component
- [`TabsContent`](src/components/ui/tabs.tsx:42) - Tabs content component
- [`Textarea`](src/components/ui/textarea.tsx:8) - Textarea component

## App Pages

### Auth Pages

#### src/app/(auth)/layout.tsx
- [`AuthLayout`](src/app/(auth)/layout.tsx:1) - Authentication layout component

#### src/app/(auth)/login/page.tsx
- [`LoginPage`](src/app/(auth)/login/page.tsx:12) - Login page component

#### src/app/(auth)/signup/page.tsx
- [`SignupPage`](src/app/(auth)/signup/page.tsx:12) - Signup page component

### Main Pages

#### src/app/layout.tsx
- [`LayoutContent`](src/app/layout.tsx:14) - Layout content wrapper component
- [`RootLayout`](src/app/layout.tsx:38) - Root layout component

#### src/app/page.tsx
- [`HomePage`](src/app/page.tsx:3) - Home page component

#### src/app/about/page.tsx
- [`AboutPage`](src/app/about/page.tsx:7) - About page component

#### src/app/founder/page.tsx
- [`FounderPage`](src/app/founder/page.tsx:7) - Founder page component

#### src/app/gallery/page.tsx
- [`GalleryPage`](src/app/gallery/page.tsx:3) - Gallery page component

#### src/app/our-work/page.tsx
- [`OurWorkPage`](src/app/our-work/page.tsx:3) - Our work page component

#### src/app/projects/page.tsx
- [`ProjectsPage`](src/app/projects/page.tsx:3) - Projects page component

#### src/app/testimonials/page.tsx
- [`TestimonialsPage`](src/app/testimonials/page.tsx:3) - Testimonials page component

#### src/app/work/page.tsx
- [`WorkPage`](src/app/work/page.tsx:4) - Work page component

### Admin Pages

#### src/app/admin/layout.tsx
- [`AdminLayout`](src/app/admin/layout.tsx:6) - Admin layout component

#### src/app/admin/page.tsx
- [`AdminDashboardPage`](src/app/admin/page.tsx:8) - Admin dashboard page component

#### src/app/admin/analytics/page.tsx
*No significant definitions found*

#### src/app/admin/content/gallery/page.tsx
*No significant definitions found*

#### src/app/admin/content/projects/page.tsx
*No significant definitions found*

#### src/app/admin/content/sections/page.tsx
*No significant definitions found*

#### src/app/admin/content/testimonials/page.tsx
*No significant definitions found*

#### src/app/admin/courses/page.tsx
*No significant definitions found*

#### src/app/admin/courses/[id]/page.tsx
*No significant definitions found*

#### src/app/admin/courses/[id]/modules/page.tsx
*No significant definitions found*

#### src/app/admin/courses/[id]/modules/[moduleId]/page.tsx
*No significant definitions found*

#### src/app/admin/courses/[id]/modules/[moduleId]/lessons/[lessonId]/page.tsx
*No significant definitions found*

#### src/app/admin/courses/[id]/modules/[moduleId]/lessons/create/page.tsx
*No significant definitions found*

#### src/app/admin/courses/create/page.tsx
*No significant definitions found*

#### src/app/admin/customization/page.tsx
*No significant definitions found*

#### src/app/admin/login/page.tsx
*No significant definitions found*

#### src/app/admin/setup/page.tsx
*No significant definitions found*

#### src/app/admin/test-connection/page.tsx
*No significant definitions found*

#### src/app/admin/users/page.tsx
*No significant definitions found*

#### src/app/admin/website-customization/page.tsx
*No significant definitions found*

### Courses Pages

#### src/app/courses/page.tsx
- [`CoursesPage`](src/app/courses/page.tsx:12) - Courses listing page component

#### src/app/courses/[id]/page.tsx
*No significant definitions found*

#### src/app/courses/[id]/lesson/[lessonId]/page.tsx
*No significant definitions found*

### Dashboard Pages

#### src/app/dashboard/layout.tsx
- [`DashboardLayout`](src/app/dashboard/layout.tsx:8) - Dashboard layout component

#### src/app/dashboard/page.tsx
- [`DashboardPage`](src/app/dashboard/page.tsx:11) - User dashboard page component

#### src/app/dashboard/courses/page.tsx
*No significant definitions found*

#### src/app/dashboard/profile/page.tsx
*No significant definitions found*

---

## Summary

This catalog contains definitions from all TypeScript files in the `src/` directory, organized by:

- **Types**: Database interfaces and types
- **Services**: Business logic classes with methods
- **Contexts**: React context providers and hooks
- **Lib**: Utility functions and Supabase client setup
- **Components**: React components organized by functionality (Admin, Course, Dashboard, Layout, Sections, UI)
- **App Pages**: Page components organized by route groups

The catalog focuses on the most important and frequently used definitions, providing a comprehensive index of the codebase's structure and key constructs.

---

*Generated on 2025-10-29*