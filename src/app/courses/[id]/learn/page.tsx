'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CourseService } from '@/services/course.service'
import { useAuth } from '@/contexts/AuthContext'
import { CourseNavigation } from '@/components/course/CourseNavigation'
import { VideoPlayer } from '@/components/course/VideoPlayer'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Download, FileText, Clock, Lock, Menu, X } from 'lucide-react'

export default function CourseLearnPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const [course, setCourse] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [attachments, setAttachments] = useState<any[]>([])
  const [accessInfo, setAccessInfo] = useState<{ canAccess: boolean; accessType: string }>({ canAccess: false, accessType: 'locked' })
  const [userProgress, setUserProgress] = useState<{ [lessonId: string]: boolean }>({})
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  
  const lessonId = searchParams.get('lesson')

  useEffect(() => {
    if (params.id) {
      loadCourse()
    }
  }, [params.id, user])

  useEffect(() => {
    if (course && lessonId) {
      loadLesson(lessonId)
    } else if (course && course.modules?.length > 0) {
      // Load first accessible lesson
      const firstModule = course.modules[0]
      const firstLesson = firstModule.lessons?.find((l: any) => 
        isEnrolled || l.is_free || l.is_preview
      )
      if (firstLesson) {
        router.replace(`/courses/${params.id}/learn?lesson=${firstLesson.id}`)
      }
    }
  }, [course, lessonId, isEnrolled])

  const loadCourse = async () => {
    const courseData = await CourseService.getCourseWithContent(params.id as string, true)
    setCourse(courseData)

    if (user) {
      const enrolled = await CourseService.isUserEnrolled(user.id, params.id as string)
      setIsEnrolled(enrolled)
      
      if (enrolled) {
        // Load user progress
        const progress = await loadUserProgress()
        setUserProgress(progress)
      }
    }

    setLoading(false)
  }

  const loadUserProgress = async () => {
    // This would typically fetch from your progress tracking system
    // For now, return empty object
    return {}
  }

  const loadLesson = async (lessonId: string) => {
    let lesson = null
    for (const module of course?.modules || []) {
      lesson = module.lessons.find((l: any) => l.id === lessonId)
      if (lesson) break
    }

    setCurrentLesson(lesson)

    if (lesson) {
      const accessResult = await CourseService.canAccessLesson(user?.id || null, lesson.id)
      setAccessInfo(accessResult)
      
      // Load attachments
      setAttachments(lesson.attachments || [])
    }
  }

  const handleProgress = async (progress: any) => {
    if (user && currentLesson && progress.played > 0.9) {
      await CourseService.updateLessonProgress(user.id, currentLesson.id, {
        completed: true,
        last_watched_position: progress.playedSeconds
      })
      
      // Update local progress
      setUserProgress(prev => ({
        ...prev,
        [currentLesson.id]: true
      }))
    }
  }

  const getVideoUrl = () => {
    if (!currentLesson) return null
    
    if (currentLesson.video_type === 'youtube') {
      return currentLesson.video_url
    } else if (currentLesson.video_type === 'url') {
      return currentLesson.video_url
    } else if (currentLesson.video_storage_path) {
      return currentLesson.video_storage_path
    }
    return currentLesson.video_url
  }

  const renderContent = () => {
    if (!currentLesson) return null
    
    const contentType = currentLesson.content_type || 'video'

    switch (contentType) {
      case 'video':
        const videoUrl = getVideoUrl()
        return videoUrl ? (
          <VideoPlayer
            url={videoUrl}
            onProgress={handleProgress}
            title={currentLesson.title}
            isPreview={accessInfo.accessType === 'preview'}
            previewDuration={300}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900 text-white">
            <p>Video not available</p>
          </div>
        )

      case 'pdf':
        return (
          <div className="bg-white p-8 flex flex-col items-center justify-center h-full">
            <FileText className="h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">PDF Document</h3>
            <p className="text-gray-600 mb-6">View or download the PDF file below</p>
            {currentLesson.video_url && (
              <a
                href={currentLesson.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Download className="mr-2 h-5 w-5" />
                Open PDF
              </a>
            )}
          </div>
        )

      case 'text':
        return (
          <div className="bg-white p-8 h-full overflow-auto">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2>{currentLesson.title}</h2>
              <div className="whitespace-pre-wrap">{currentLesson.text_content}</div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p>Content not available</p>
          </div>
        )
    }
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!accessInfo.canAccess && currentLesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">You need to enroll in this course to access this lesson.</p>
          <Button onClick={() => router.push(`/courses/${params.id}`)}>
            View Course Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
        <CourseNavigation
          courseId={course?.id}
          modules={course?.modules || []}
          currentLessonId={currentLesson?.id}
          userProgress={userProgress}
          isEnrolled={isEnrolled}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Button
              variant="ghost"
              onClick={() => router.push(`/courses/${params.id}`)}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </div>
          <div className="text-right">
            <h1 className="font-semibold text-lg">{course?.title}</h1>
            <p className="text-sm text-gray-600">{currentLesson?.title}</p>
          </div>
        </div>

        {/* Video/Content Area */}
        <div className="flex-1 bg-black">
          <div className="aspect-video w-full">
            {renderContent()}
          </div>
        </div>

        {/* Lesson Info */}
        <div className="bg-white p-6 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{currentLesson?.title}</h2>
                <p className="text-gray-600 mb-4">{currentLesson?.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {currentLesson?.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {Math.floor(currentLesson.duration / 60)}:{(currentLesson.duration % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                  {accessInfo.accessType === 'free' && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      Free Lesson
                    </span>
                  )}
                  {accessInfo.accessType === 'preview' && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Preview
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <div className="grid gap-3">
                  {attachments.map((attachment) => {
                    const canDownload = accessInfo.accessType === 'paid'
                    
                    return (
                      <div
                        key={attachment.id}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          canDownload 
                            ? 'hover:bg-gray-50 cursor-pointer' 
                            : 'opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className={`h-5 w-5 ${canDownload ? 'text-gray-600' : 'text-gray-400'}`} />
                          <div>
                            <p className={`font-medium ${canDownload ? 'text-gray-900' : 'text-gray-500'}`}>
                              {attachment.file_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(attachment.file_size)}
                              {!canDownload && ' • Enrollment required'}
                            </p>
                          </div>
                        </div>
                        {canDownload ? (
                          <a
                            href={attachment.file_url}
                            download
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    )
                  })}
                </div>
                {accessInfo.accessType !== 'paid' && attachments.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Tip:</strong> Enroll in this course to download all resources and materials.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}