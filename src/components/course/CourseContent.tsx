'use client'

import { useState } from 'react'
import { CourseModuleWithLessons } from '@/types/database.types'
import { ChevronDown, ChevronUp, Play, FileText, Music, FileCheck, HelpCircle, Book, Lock, Eye } from 'lucide-react'

interface CourseContentProps {
  courseId: string
  modules: CourseModuleWithLessons[]
  totalLectures: number
  totalDuration: number
  isEnrolled?: boolean
}

export function CourseContent({ courseId, modules, totalLectures, totalDuration, isEnrolled = false }: CourseContentProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([modules[0]?.id]))

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const expandAll = () => {
    setExpandedModules(new Set(modules.map(m => m.id)))
  }

  const collapseAll = () => {
    setExpandedModules(new Set())
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00'
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Play className="h-4 w-4" />
      case 'pdf':
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'audio':
        return <Music className="h-4 w-4" />
      case 'quiz':
        return <HelpCircle className="h-4 w-4" />
      case 'text':
        return <Book className="h-4 w-4" />
      default:
        return <FileCheck className="h-4 w-4" />
    }
  }

  const canAccessLesson = (lesson: any) => {
    return isEnrolled || lesson.is_free || lesson.is_preview
  }

  return (
    <div className="border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Course content</h2>
          <button
            onClick={expandedModules.size === modules.length ? collapseAll : expandAll}
            className="text-sm text-primary hover:underline"
          >
            {expandedModules.size === modules.length ? 'Collapse all sections' : 'Expand all sections'}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          {modules.length} sections • {totalLectures} lectures • {formatTotalDuration(totalDuration)} total length
        </p>
      </div>

      {/* Modules List */}
      <div>
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id)
          const moduleDuration = module.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0
          const lectureCount = module.lessons?.length || 0

          return (
            <div key={module.id} className="border-b last:border-b-0">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                  <div>
                    <h3 className="font-semibold text-base">{module.title}</h3>
                    {module.description && (
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  {lectureCount} {lectureCount === 1 ? 'lecture' : 'lectures'} • {formatDuration(moduleDuration)}
                </div>
              </button>

              {/* Lessons List */}
              {isExpanded && module.lessons && (
                <div className="bg-gray-50">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const hasAccess = canAccessLesson(lesson)
                    
                    return (
                      <a
                        key={lesson.id}
                        href={hasAccess ? `/courses/${courseId}/lesson/${lesson.id}` : '#'}
                        className={`px-6 py-3 flex items-center justify-between border-t ${hasAccess ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-75'}`}
                        onClick={(e) => !hasAccess && e.preventDefault()}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-gray-600">
                            {getContentIcon(lesson.content_type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{lesson.title}</p>
                            {lesson.description && (
                              <p className="text-xs text-gray-600 mt-0.5">{lesson.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-4">
                          {hasAccess ? (
                            <span className="text-primary text-sm font-medium flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {lesson.is_preview || lesson.is_free ? 'Preview' : 'Play'}
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Lock className="h-3 w-3" />
                            </div>
                          )}
                          {lesson.duration && (
                            <span className="text-sm text-gray-600 w-12 text-right">
                              {formatDuration(lesson.duration)}
                            </span>
                          )}
                        </div>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
