export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      website_config: {
        Row: WebsiteConfig
        Insert: Omit<WebsiteConfig, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WebsiteConfig, 'id' | 'created_at' | 'updated_at'>>
      }
      sections: {
        Row: Section
        Insert: Omit<Section, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Section, 'id' | 'created_at' | 'updated_at'>>
      }
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>
      }
      course_modules: {
        Row: CourseModule
        Insert: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>>
      }
      course_lessons: {
        Row: CourseLesson
        Insert: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>>
      }
      user_course_enrollments: {
        Row: UserCourseEnrollment
        Insert: Omit<UserCourseEnrollment, 'id' | 'enrolled_at'>
        Update: never
      }
      user_lesson_progress: {
        Row: UserLessonProgress
        Insert: Omit<UserLessonProgress, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserLessonProgress, 'id' | 'created_at' | 'updated_at'>>
      }
      lecture_attachments: {
        Row: LectureAttachment
        Insert: Omit<LectureAttachment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<LectureAttachment, 'id' | 'created_at' | 'updated_at'>>
      }
      gallery_items: {
        Row: GalleryItem
        Insert: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface WebsiteConfig {
  id: string
  config_key: string
  config_value: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  section_key: string
  title: string
  subtitle: string | null
  content: Record<string, any> | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  instructor_name: string | null
  price: number
  is_published: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  description: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface CourseLesson {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: 'video' | 'pdf' | 'audio' | 'document' | 'quiz' | 'text'
  video_type: 'upload' | 'youtube' | 'url' | null
  video_url: string | null
  video_storage_path: string | null
  duration: number | null
  is_free: boolean
  is_preview: boolean
  quiz_questions: any | null
  text_content: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface LectureAttachment {
  id: string
  lesson_id: string
  file_name: string
  file_type: string
  file_url: string | null
  file_storage_path: string | null
  file_size: number | null
  mime_type: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface UserCourseEnrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
}

export interface UserLessonProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  last_watched_position: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string | null
  description: string | null
  media_type: 'image' | 'video'
  media_url: string
  thumbnail_url: string | null
  category: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  image_url: string | null
  status: 'active' | 'completed' | 'upcoming'
  impact_stats: Record<string, any> | null
  technologies: string[] | null
  external_link: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  author_name: string
  author_role: string | null
  author_avatar: string | null
  content: string
  rating: number | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface CourseWithModules extends Course {
  modules: CourseModuleWithLessons[]
  totalDuration?: number
  totalLectures?: number
}

export interface CourseModuleWithLessons extends CourseModule {
  lessons: CourseLessonWithAttachments[]
}

export interface CourseLessonWithAttachments extends CourseLesson {
  attachments?: LectureAttachment[]
}

export interface EnrolledCourse extends Course {
  enrollment: UserCourseEnrollment
  progress?: {
    completed_lessons: number
    total_lessons: number
    percentage: number
  }
}
