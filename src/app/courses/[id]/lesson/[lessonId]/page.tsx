'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CourseService } from '@/services/course.service'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import ReactPlayer from 'react-player'
import { ChevronLeft, Download, FileText } from 'lucide-react'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [attachments, setAttachments] = useState<any[]>([])
  const [canAccess, setCanAccess] = useState(false)
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
      const hasAccess = await CourseService.canAccessLesson(user?.id || null, lesson.id)
      setCanAccess(hasAccess)
      
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

  if (!canAccess) {
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
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls
            onProgress={handleProgress}
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

            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">{currentLesson?.title}</h1>
            <p className="text-gray-600 mb-6 text-lg">{currentLesson?.description}</p>

            {attachments.length > 0 && (
              <div className="border-t border-purple-100 pt-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-purple-700">📎</span> Attachments
                </h2>
                <div className="grid gap-3">
                  {attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border-2 border-purple-100 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <FileText className="h-6 w-6 text-purple-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">{attachment.file_name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(attachment.file_size)}
                          </p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
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
