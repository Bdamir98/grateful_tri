import { supabase } from '@/lib/supabase/client'
import { Course, CourseWithModules, CourseModule, CourseLesson, EnrolledCourse, UserCourseEnrollment, UserLessonProgress } from '@/types/database.types'

export class CourseService {
  // Get all published courses
  static async getPublishedCourses(): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching published courses:', error)
      return []
    }
  }

  // Get course with modules and lessons
  static async getCourseWithContent(courseId: string, includeAttachments: boolean = true): Promise<CourseWithModules | null> {
    try {
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (courseError) throw courseError

      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('display_order', { ascending: true })

      if (modulesError) throw modulesError

      const modulesWithLessons = await Promise.all(
        (modules || []).map(async (module) => {
          const { data: lessons, error: lessonsError } = await supabase
            .from('course_lessons')
            .select('*')
            .eq('module_id', module.id)
            .order('display_order', { ascending: true })

          if (lessonsError) throw lessonsError

          // Get attachments for each lesson if requested
          const lessonsWithAttachments = includeAttachments ? await Promise.all(
            (lessons || []).map(async (lesson) => {
              const { data: attachments } = await supabase
                .from('lecture_attachments')
                .select('*')
                .eq('lesson_id', lesson.id)
                .order('display_order', { ascending: true })

              return {
                ...lesson,
                attachments: attachments || []
              }
            })
          ) : lessons || []

          return {
            ...module,
            lessons: lessonsWithAttachments
          }
        })
      )

      // Calculate total lectures and duration
      const totalLectures = modulesWithLessons.reduce((sum, module) => sum + (module.lessons?.length || 0), 0)
      const totalDuration = modulesWithLessons.reduce(
        (sum, module) => sum + (module.lessons?.reduce((lessonSum: number, lesson: any) => lessonSum + (lesson.duration || 0), 0) || 0),
        0
      )

      // Calculate free content stats
      const freeLectures = modulesWithLessons.reduce(
        (sum, module) => sum + (module.lessons?.filter((lesson: any) => lesson.is_free || lesson.is_preview).length || 0),
        0
      )

      return {
        ...course,
        modules: modulesWithLessons,
        totalLectures,
        totalDuration,
        freeLectures
      }
    } catch (error) {
      console.error('Error fetching course with content:', error)
      return null
    }
  }

  // Check if user is enrolled in course
  static async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_course_enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      console.error('Error checking enrollment:', error)
      return false
    }
  }

  // Enroll user in course
  static async enrollUser(userId: string, courseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_course_enrollments')
        .insert({ user_id: userId, course_id: courseId })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error enrolling user:', error)
      return false
    }
  }

  // Get user's enrolled courses
  static async getUserEnrolledCourses(userId: string): Promise<EnrolledCourse[]> {
    try {
      const { data: enrollments, error } = await supabase
        .from('user_course_enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('user_id', userId)

      if (error) throw error

      const enrolledCourses = await Promise.all(
        (enrollments || []).map(async (enrollment: any) => {
          const progress = await this.getCourseProgress(userId, enrollment.course_id)
          return {
            ...enrollment.courses,
            enrollment: {
              id: enrollment.id,
              user_id: enrollment.user_id,
              course_id: enrollment.course_id,
              enrolled_at: enrollment.enrolled_at
            },
            progress
          }
        })
      )

      return enrolledCourses
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      return []
    }
  }

  // Get course progress for user
  static async getCourseProgress(userId: string, courseId: string): Promise<{ completed_lessons: number; total_lessons: number; percentage: number }> {
    try {
      // Get all lessons for the course
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', courseId)

      if (!modules || modules.length === 0) {
        return { completed_lessons: 0, total_lessons: 0, percentage: 0 }
      }

      const moduleIds = modules.map(m => m.id)

      const { data: lessons } = await supabase
        .from('course_lessons')
        .select('id')
        .in('module_id', moduleIds)

      const totalLessons = lessons?.length || 0

      // Get completed lessons
      const { data: progress } = await supabase
        .from('user_lesson_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', true)
        .in('lesson_id', lessons?.map(l => l.id) || [])

      const completedLessons = progress?.length || 0
      const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      return {
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        percentage
      }
    } catch (error) {
      console.error('Error fetching course progress:', error)
      return { completed_lessons: 0, total_lessons: 0, percentage: 0 }
    }
  }

  // Update lesson progress
  static async updateLessonProgress(
    userId: string,
    lessonId: string,
    data: { completed?: boolean; last_watched_position?: number }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          ...data,
          ...(data.completed && { completed_at: new Date().toISOString() })
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating lesson progress:', error)
      return false
    }
  }

  // Check if user can access lesson
  static async canAccessLesson(userId: string | null, lessonId: string): Promise<{ canAccess: boolean; accessType: 'free' | 'preview' | 'paid' | 'locked' }> {
    try {
      const { data: lesson, error } = await supabase
        .from('course_lessons')
        .select(`
          *,
          course_modules (
            course_id
          )
        `)
        .eq('id', lessonId)
        .single()

      if (error) throw error

      // Free lessons are accessible to everyone
      if (lesson.is_free) {
        return { canAccess: true, accessType: 'free' }
      }

      // Preview lessons are accessible to everyone
      if (lesson.is_preview) {
        return { canAccess: true, accessType: 'preview' }
      }

      // Check if user is enrolled
      if (!userId) {
        return { canAccess: false, accessType: 'locked' }
      }

      const courseId = (lesson.course_modules as any).course_id
      const isEnrolled = await this.isUserEnrolled(userId, courseId)
      
      if (isEnrolled) {
        return { canAccess: true, accessType: 'paid' }
      }

      return { canAccess: false, accessType: 'locked' }
    } catch (error) {
      console.error('Error checking lesson access:', error)
      return { canAccess: false, accessType: 'locked' }
    }
  }

  // Get user access type for course
  static async getUserAccessType(userId: string | null, courseId: string): Promise<'free' | 'paid' | 'guest'> {
    if (!userId) return 'guest'
    
    const isEnrolled = await this.isUserEnrolled(userId, courseId)
    return isEnrolled ? 'paid' : 'free'
  }

  // Check if user can download attachments
  static async canDownloadAttachments(userId: string | null, lessonId: string): Promise<boolean> {
    if (!userId) return false
    
    const { canAccess, accessType } = await this.canAccessLesson(userId, lessonId)
    return canAccess && accessType === 'paid'
  }

  // Admin: Create course with thumbnail
  static async createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>, thumbnailFile?: File): Promise<Course | null> {
    try {
      let finalCourseData = { ...courseData }
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        const thumbnailUrl = await this.uploadThumbnail(thumbnailFile)
        if (thumbnailUrl) {
          finalCourseData.thumbnail_url = thumbnailUrl
        }
      }

      const { data, error } = await supabase
        .from('courses')
        .insert(finalCourseData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating course:', error)
      return null
    }
  }

  // Admin: Update course with optional thumbnail
  static async updateCourse(courseId: string, courseData: Partial<Course>, thumbnailFile?: File): Promise<boolean> {
    try {
      let finalCourseData = { ...courseData }
      
      // Upload new thumbnail if provided
      if (thumbnailFile) {
        const thumbnailUrl = await this.uploadThumbnail(thumbnailFile)
        if (thumbnailUrl) {
          finalCourseData.thumbnail_url = thumbnailUrl
        }
      }

      const { error } = await supabase
        .from('courses')
        .update(finalCourseData)
        .eq('id', courseId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating course:', error)
      return false
    }
  }

  // Admin: Delete course
  static async deleteCourse(courseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting course:', error)
      return false
    }
  }

  // Admin: Create module
  static async createModule(moduleData: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>): Promise<CourseModule | null> {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .insert(moduleData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating module:', error)
      return null
    }
  }

  // Admin: Create lesson
  static async createLesson(lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>): Promise<CourseLesson | null> {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .insert(lessonData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating lesson:', error)
      return null
    }
  }

  // Admin: Update lesson
  static async updateLesson(lessonId: string, lessonData: Partial<CourseLesson>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('course_lessons')
        .update(lessonData)
        .eq('id', lessonId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating lesson:', error)
      return false
    }
  }

  // Upload video to Supabase storage
  static async uploadVideo(file: File, path: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('course-videos')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('course-videos')
        .getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading video:', error)
      return null
    }
  }

  // Upload thumbnail to Supabase storage
  static async uploadThumbnail(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('course-thumbnails')
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('course-thumbnails')
        .getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      return null
    }
  }

  // Upload attachment file
  static async uploadAttachment(file: File, lessonId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${lessonId}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('course-attachments')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('course-attachments')
        .getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading attachment:', error)
      return null
    }
  }

  // Add attachment to lesson
  static async addAttachmentToLesson(
    lessonId: string, 
    fileName: string, 
    fileUrl: string, 
    fileSize: number, 
    mimeType: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lecture_attachments')
        .insert({
          lesson_id: lessonId,
          file_name: fileName,
          file_url: fileUrl,
          file_size: fileSize,
          mime_type: mimeType,
          file_type: mimeType.split('/')[0],
          display_order: 0
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding attachment:', error)
      return false
    }
  }
}
