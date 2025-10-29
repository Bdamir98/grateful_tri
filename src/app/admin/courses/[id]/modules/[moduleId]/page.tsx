'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Plus, Edit, Trash2, Eye, Lock } from 'lucide-react'
import Link from 'next/link'

export default function ModuleLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const [module, setModule] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadModuleAndLessons()
  }, [params.moduleId])

  const loadModuleAndLessons = async () => {
    // Load module details
    const { data: moduleData } = await supabase
      .from('course_modules')
      .select('*')
      .eq('id', params.moduleId)
      .single()

    setModule(moduleData)

    // Load lessons
    const { data: lessonsData } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('module_id', params.moduleId)
      .order('display_order')

    setLessons(lessonsData || [])
    setLoading(false)
  }

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return

    await supabase
      .from('course_lessons')
      .delete()
      .eq('id', lessonId)

    loadModuleAndLessons()
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return '🎥'
      case 'pdf':
        return '📄'
      case 'audio':
        return '🎵'
      case 'document':
        return '📝'
      case 'quiz':
        return '❓'
      case 'text':
        return '📖'
      default:
        return '📁'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/admin/courses/${params.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Link>
        <h1 className="text-3xl font-bold mb-2">{module?.title || 'Module'}</h1>
        <p className="text-gray-600">{module?.description || 'Manage lectures in this module'}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Lectures ({lessons.length})
        </h2>
        <Button asChild>
          <Link href={`/admin/courses/${params.id}/modules/${params.moduleId}/lessons/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lecture
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Loading lectures...</p>
      ) : lessons.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">No lectures yet. Add your first lecture!</p>
            <Button asChild>
              <Link href={`/admin/courses/${params.id}/modules/${params.moduleId}/lessons/create`}>
                Add Lecture
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getContentTypeIcon(lesson.content_type)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{lesson.title}</h3>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-gray-600">
                        Type: <span className="font-medium capitalize">{lesson.content_type}</span>
                      </span>
                      {lesson.duration && (
                        <span className="text-gray-600">
                          Duration: <span className="font-medium">{formatDuration(lesson.duration)}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        {lesson.is_preview || lesson.is_free ? (
                          <><Eye className="h-4 w-4 text-green-600" /> <span className="text-green-600 font-medium">Preview</span></>
                        ) : (
                          <><Lock className="h-4 w-4 text-gray-400" /> <span className="text-gray-600">Locked</span></>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/admin/courses/${params.id}/modules/${params.moduleId}/lessons/${lesson.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteLesson(lesson.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
