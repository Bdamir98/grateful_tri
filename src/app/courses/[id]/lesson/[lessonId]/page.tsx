'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CourseService } from '@/services/course.service'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { VideoPlayer } from '@/components/course/VideoPlayer'
import { ChevronLeft, Download, FileText, Clock, Lock } from 'lucide-react'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [attachments, setAttachments] = useState<any[]>([])
  const [accessInfo, setAccessInfo] = useState<{ canAccess: boolean; accessType: string }>({ canAccess: false, accessType: 'locked' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id && params.lessonId) {
      loadLesson()
    }
  }, [params.id, params.lessonId, user])

  const loadLesson = async () => {
    const courseData = await CourseService.getCourseWithContent(params.id as string)
    setCourse(courseData)

    let lesson = null
    for (const module of courseData?.modules || []) {
      lesson = module.lessons.find((l: any) => l.id === params.lessonId)
      if (lesson) break
    }

    setCurrentLesson(lesson)

    if (lesson) {
      const accessResult = await CourseService.canAccessLesson(user?.id || null, lesson.id)
      setAccessInfo(accessResult)
      
      // Load attachments
      const { data: attachData } = await supabase
        .from('lecture_attachments')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('display_order')
      
      setAttachments(attachData || [])
    }

    setLoading(false)
  }

  const handleProgress = async (progress: any) => {
    if (user && currentLesson && progress.played > 0.9) {
      await CourseService.updateLessonProgress(user.id, currentLesson.id, {
        completed: true,
        last_watched_position: progress.playedSeconds
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <p>Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!accessInfo.canAccess) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 pb-20 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">You need to enroll in this course to access this lesson.</p>
          <Button onClick={() => router.push(`/courses/${params.id}`)}>
            View Course Details
          </Button>
        </div>
      </div>
    )
  }

  const getVideoUrl = () => {
    if (currentLesson.video_type === 'youtube') {
      return currentLesson.video_url
    } else if (currentLesson.video_type === 'url') {
      return currentLesson.video_url
    } else if (currentLesson.video_storage_path) {
      return currentLesson.video_storage_path
    }
    return null
  }

  const renderContent = () => {
    const contentType = currentLesson?.content_type || 'video'

    switch (contentType) {
      case 'video':
        const videoUrl = getVideoUrl()
        return videoUrl ? (
          <VideoPlayer
            url={videoUrl}
            onProgress={handleProgress}
            title={currentLesson?.title}
            isPreview={accessInfo.accessType === 'preview'}
            previewDuration={300} // 5 minutes preview
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
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
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Download className="mr-2 h-5 w-5" />
                Open PDF
              </a>
            )}
          </div>
        )

      case 'audio':
        return (
          <div className="bg-white p-8 flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-2xl">
              <h3 className="text-2xl font-bold mb-4">Audio Lecture</h3>
              {currentLesson.video_url ? (
                <audio controls className="w-full">
                  <source src={currentLesson.video_url} />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p className="text-gray-600">Audio file not available</p>
              )}
            </div>
          </div>
        )

      case 'document':
        return (
          <div className="bg-white p-8 flex flex-col items-center justify-center h-full">
            <FileText className="h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Document</h3>
            <p className="text-gray-600 mb-6">Download the document below</p>
            {currentLesson.video_url && (
              <a
                href={currentLesson.video_url}
                download
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Document
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

      case 'quiz':
        return (
          <div className="bg-white p-8 flex flex-col items-center justify-center h-full">
            <h3 className="text-2xl font-bold mb-2">Quiz</h3>
            <p className="text-gray-600">Quiz functionality coming soon...</p>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full text-white">
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 w-full">
        <div className="w-full">
          <div className={`w-full max-w-7xl mx-auto ${currentLesson?.content_type === 'video' ? 'bg-black' : 'bg-gray-100'} shadow-2xl`}>
            <div className="aspect-video">
              {renderContent()}
            </div>
          </div>

          <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-b-3xl p-8 mt-1">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push(`/courses/${params.id}`)}
                className="hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Button>
            </div>

            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                  {currentLesson?.title}
                </h1>
                <p className="text-gray-600 mb-2 text-lg">{currentLesson?.description}</p>
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

            {attachments.length > 0 && (
              <div className="border-t border-purple-100 pt-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-purple-700">📎</span> Resources
                </h2>
                <div className="grid gap-3">
                  {attachments.map((attachment) => {
                    const canDownload = accessInfo.accessType === 'paid'
                    
                    return (
                      <div
                        key={attachment.id}
                        className={`flex items-center justify-between p-4 border-2 border-purple-100 rounded-xl transition-all duration-200 ${
                          canDownload 
                            ? 'hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg cursor-pointer group' 
                            : 'opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg transition-colors ${
                            canDownload 
                              ? 'bg-purple-100 group-hover:bg-purple-200' 
                              : 'bg-gray-100'
                          }`}>
                            <FileText className={`h-6 w-6 ${
                              canDownload ? 'text-purple-700' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <p className={`font-semibold transition-colors ${
                              canDownload 
                                ? 'text-gray-800 group-hover:text-purple-700' 
                                : 'text-gray-500'
                            }`}>
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
                            className="text-purple-600 hover:scale-110 transition-transform"
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

            <div className="border-t border-purple-100 pt-6">
              <h2 className="text-2xl font-bold mb-3 text-purple-800">About this course</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{course?.description}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
