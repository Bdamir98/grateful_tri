'use client'

import { useState } from 'react'
import { CourseModuleWithLessons } from '@/types/database.types'
import { ChevronDown, ChevronUp, Play, FileText, Music, FileCheck, HelpCircle, Book, Lock, Eye, Download, Clock } from 'lucide-react'
import Link from 'next/link'

interface CourseContentProps {
  courseId: string
  modules: CourseModuleWithLessons[]
  totalLectures: number
  totalDuration: number
  isEnrolled?: boolean
  userType?: 'free' | 'paid' | 'guest'
}

export function CourseContent({ 
  courseId, 
  modules, 
  totalLectures, 
  totalDuration, 
  isEnrolled = false,
  userType = 'guest'
}: CourseContentProps) {
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
    return `${hours}h ${mins}m total length`
  }

  const getContentIcon = (contentType: string, hasAccess: boolean) => {
    const iconClass = `h-4 w-4 ${hasAccess ? 'text-gray-700' : 'text-gray-400'}`
    
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
        return <FileCheck className={iconClass} />
    }
  }

  const canAccessLesson = (lesson: any) => {
    // Free users can access free and preview content
    if (lesson.is_free || lesson.is_preview) return true
    
    // Paid users (enrolled) can access all content
    if (isEnrolled && userType === 'paid') return true
    
    return false
  }

  const canDownloadAttachments = (lesson: any) => {
    // Only enrolled paid users can download attachments
    return isEnrolled && userType === 'paid'
  }

  const getAccessLabel = (lesson: any) => {
    if (lesson.is_free) return 'Free'
    if (lesson.is_preview) return 'Preview'
    if (isEnrolled) return 'Play'
    return null
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Course content</h2>
          <button
            onClick={expandedModules.size === modules.length ? collapseAll : expandAll}
            className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium transition-colors"
          >
            {expandedModules.size === modules.length ? 'Collapse all sections' : 'Expand all sections'}
          </button>
        </div>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span>{modules.length} sections</span>
          <span>•</span>
          <span>{totalLectures} lectures</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTotalDuration(totalDuration)}
          </span>
        </p>
      </div>

      {/* Modules List */}
      <div className="divide-y divide-gray-200">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id)
          const moduleDuration = module.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0
          const lectureCount = module.lessons?.length || 0
          const freeCount = module.lessons?.filter(l => l.is_free || l.is_preview).length || 0

          return (
            <div key={module.id} className="">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="transition-transform duration-200">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-900 group-hover:text-purple-700 transition-colors">
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  <div className="text-right">
                    <div>{lectureCount} {lectureCount === 1 ? 'lecture' : 'lectures'} • {formatDuration(moduleDuration)}</div>
                    {!isEnrolled && freeCount > 0 && (
                      <div className="text-xs text-green-600 mt-1">{freeCount} free</div>
                    )}
                  </div>
                </div>
              </button>

              {/* Lessons List */}
              {isExpanded && module.lessons && (
                <div className="bg-gray-50/50">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const hasAccess = canAccessLesson(lesson)
                    const canDownload = canDownloadAttachments(lesson)
                    const accessLabel = getAccessLabel(lesson)
                    
                    return (
                      <div key={lesson.id} className="border-t border-gray-100 first:border-t-0">
                        <div className="px-6 py-3 flex items-center justify-between hover:bg-gray-100/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0">
                              {getContentIcon(lesson.content_type, hasAccess)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium truncate ${
                                  hasAccess ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {lesson.title}
                                </p>
                                {lesson.is_free && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Free
                                  </span>
                                )}
                                {lesson.is_preview && !lesson.is_free && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Preview
                                  </span>
                                )}
                              </div>
                              {lesson.description && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{lesson.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                            {hasAccess ? (
                              <Link
                                href={`/courses/${courseId}/lesson/${lesson.id}`}
                                className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:text-purple-800 transition-colors"
                              >
                                <Eye className="h-3 w-3" />
                                {accessLabel}
                              </Link>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Lock className="h-3 w-3" />
                                <span className="text-xs">Locked</span>
                              </div>
                            )}
                            {lesson.duration && (
                              <span className="text-sm text-gray-500 w-12 text-right">
                                {formatDuration(lesson.duration)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Attachments Preview */}
                        {hasAccess && lesson.attachments && lesson.attachments.length > 0 && (
                          <div className="px-6 pb-3">
                            <div className="ml-7 space-y-1">
                              {lesson.attachments.map((attachment: any) => (
                                <div key={attachment.id} className="flex items-center gap-2 text-xs text-gray-600">
                                  <FileText className="h-3 w-3" />
                                  <span className="truncate">{attachment.file_name}</span>
                                  {canDownload ? (
                                    <a
                                      href={attachment.file_url}
                                      download
                                      className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                    >
                                      <Download className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    <Lock className="h-3 w-3 text-gray-400" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
