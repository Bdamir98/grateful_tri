'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CourseModuleWithLessons } from '@/types/database.types'
import { ChevronDown, ChevronUp, Play, FileText, Music, Book, HelpCircle, Lock, CheckCircle, Circle } from 'lucide-react'

interface CourseNavigationProps {
  courseId: string
  modules: CourseModuleWithLessons[]
  currentLessonId?: string
  userProgress?: { [lessonId: string]: boolean }
  isEnrolled: boolean
}

export function CourseNavigation({ 
  courseId, 
  modules, 
  currentLessonId, 
  userProgress = {},
  isEnrolled 
}: CourseNavigationProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map(m => m.id))
  )

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

  const getContentIcon = (contentType: string, hasAccess: boolean) => {
    const iconClass = `h-4 w-4 ${hasAccess ? 'text-gray-600' : 'text-gray-400'}`
    
    switch (contentType) {
      case 'video':
        return <Play className={iconClass} />
      case 'pdf':
      case 'document':
        return <FileText className={iconClass} />
      case 'audio':
        return <Music className={iconClass} />
      case 'quiz':
        return <HelpCircle className={iconClass} />
      case 'text':
        return <Book className={iconClass} />
      default:
        return <FileText className={iconClass} />
    }
  }

  const canAccessLesson = (lesson: any) => {
    return isEnrolled || lesson.is_free || lesson.is_preview
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Course Content</h2>
        <p className="text-sm text-gray-600 mt-1">
          {modules.length} sections • {modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)} lectures
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {modules.map((module) => {
          const isExpanded = expandedModules.has(module.id)
          const completedLessons = module.lessons?.filter(l => userProgress[l.id]).length || 0
          const totalLessons = module.lessons?.length || 0
          const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

          return (
            <div key={module.id}>
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                    <div>
                      <h3 className="font-medium text-sm">{module.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {completedLessons}/{totalLessons} completed
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}
                  </div>
                </div>
                
                {/* Progress Bar */}
                {totalLessons > 0 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                )}
              </button>

              {/* Lessons List */}
              {isExpanded && module.lessons && (
                <div className="bg-gray-50">
                  {module.lessons.map((lesson, index) => {
                    const hasAccess = canAccessLesson(lesson)
                    const isCompleted = userProgress[lesson.id]
                    const isCurrent = currentLessonId === lesson.id

                    return (
                      <div key={lesson.id} className={`border-l-4 ${
                        isCurrent ? 'border-purple-500 bg-purple-50' : 'border-transparent'
                      }`}>
                        <Link
                          href={hasAccess ? `/courses/${courseId}/lesson/${lesson.id}` : '#'}
                          className={`block px-4 py-3 hover:bg-gray-100 transition-colors ${
                            !hasAccess ? 'cursor-not-allowed opacity-60' : ''
                          } ${isCurrent ? 'bg-purple-50' : ''}`}
                          onClick={(e) => !hasAccess && e.preventDefault()}
                        >
                          <div className="flex items-center gap-3">
                            {/* Progress Icon */}
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>

                            {/* Content Icon */}
                            <div className="flex-shrink-0">
                              {getContentIcon(lesson.content_type, hasAccess)}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium truncate ${
                                  isCurrent ? 'text-purple-700' : (hasAccess ? 'text-gray-900' : 'text-gray-500')
                                }`}>
                                  {lesson.title}
                                </p>
                                {lesson.is_free && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Free
                                  </span>
                                )}
                                {lesson.is_preview && !lesson.is_free && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Preview
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500">
                                  {lesson.content_type.charAt(0).toUpperCase() + lesson.content_type.slice(1)}
                                </span>
                                <div className="flex items-center gap-2">
                                  {!hasAccess && <Lock className="h-3 w-3 text-gray-400" />}
                                  {lesson.duration && (
                                    <span className="text-xs text-gray-500">
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
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