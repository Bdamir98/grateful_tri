'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseService } from '@/services/course.service'
import { Upload, FileText, Video, Music, Book, HelpCircle, X, Plus, Download } from 'lucide-react'

interface LessonManagerProps {
  moduleId: string
  onLessonCreated?: () => void
}

interface AttachmentFile {
  file: File
  name: string
  size: number
  type: string
}

export function LessonManager({ moduleId, onLessonCreated }: LessonManagerProps) {
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'video' as 'video' | 'pdf' | 'audio' | 'document' | 'quiz' | 'text',
    video_type: 'upload' as 'upload' | 'youtube' | 'url',
    video_url: '',
    duration: 0,
    is_free: false,
    is_preview: false,
    text_content: '',
    display_order: 0
  })

  const contentTypes = [
    { value: 'video', label: 'Video', icon: Video },
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'document', label: 'Document', icon: FileText },
    { value: 'text', label: 'Text Content', icon: Book },
    { value: 'quiz', label: 'Quiz', icon: HelpCircle }
  ]

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const videoUrl = await CourseService.uploadVideo(file, `lessons/${moduleId}/${Date.now()}_${file.name}`)
      if (videoUrl) {
        setFormData(prev => ({
          ...prev,
          video_url: videoUrl,
          video_type: 'upload'
        }))
      }
    } catch (error) {
      console.error('Error uploading video:', error)
    }
    setLoading(false)
  }

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }))
    setAttachments(prev => [...prev, ...newAttachments])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create lesson
      const lesson = await CourseService.createLesson({
        module_id: moduleId,
        video_storage_path: null,
        quiz_questions: null,
        ...formData
      })

      if (lesson) {
        // Upload and attach files
        for (const attachment of attachments) {
          const fileUrl = await CourseService.uploadAttachment(attachment.file, lesson.id)
          if (fileUrl) {
            await CourseService.addAttachmentToLesson(
              lesson.id,
              attachment.name,
              fileUrl,
              attachment.size,
              attachment.type
            )
          }
        }

        // Reset form
        setFormData({
          title: '',
          description: '',
          content_type: 'video',
          video_type: 'upload',
          video_url: '',
          duration: 0,
          is_free: false,
          is_preview: false,
          text_content: '',
          display_order: 0
        })
        setAttachments([])
        
        onLessonCreated?.()
      }
    } catch (error) {
      console.error('Error creating lesson:', error)
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Introduction to React"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Learn the basics of React components..."
            />
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <Label>Content Type *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contentTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, content_type: value as any }))}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                    formData.content_type === value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Content */}
          {formData.content_type === 'video' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold">Video Content</h3>
              
              <div className="space-y-2">
                <Label>Video Source</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, video_type: 'upload' }))}
                    className={`px-3 py-2 rounded text-sm ${
                      formData.video_type === 'upload'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, video_type: 'youtube' }))}
                    className={`px-3 py-2 rounded text-sm ${
                      formData.video_type === 'youtube'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, video_type: 'url' }))}
                    className={`px-3 py-2 rounded text-sm ${
                      formData.video_type === 'url'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    External URL
                  </button>
                </div>
              </div>

              {formData.video_type === 'upload' && (
                <div className="space-y-2">
                  <Label>Upload Video File</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={loading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Video
                    </Button>
                    {formData.video_url && (
                      <span className="text-sm text-green-600">✓ Video uploaded</span>
                    )}
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
              )}

              {(formData.video_type === 'youtube' || formData.video_type === 'url') && (
                <div className="space-y-2">
                  <Label htmlFor="video_url">
                    {formData.video_type === 'youtube' ? 'YouTube URL' : 'Video URL'}
                  </Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder={
                      formData.video_type === 'youtube'
                        ? 'https://www.youtube.com/watch?v=...'
                        : 'https://example.com/video.mp4'
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/* Text Content */}
          {formData.content_type === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="text_content">Text Content</Label>
              <textarea
                id="text_content"
                value={formData.text_content}
                onChange={(e) => setFormData(prev => ({ ...prev, text_content: e.target.value }))}
                placeholder="Enter your lesson content here..."
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg resize-vertical"
              />
            </div>
          )}

          {/* URL for other content types */}
          {['pdf', 'audio', 'document'].includes(formData.content_type) && (
            <div className="space-y-2">
              <Label htmlFor="content_url">File URL</Label>
              <Input
                id="content_url"
                value={formData.video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://example.com/file.pdf"
              />
            </div>
          )}

          {/* Access Control */}
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold">Access Control</h3>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_free: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Free lesson (accessible to all users)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_preview}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_preview: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Preview lesson (limited access)</span>
              </label>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-4 p-4 border rounded-lg bg-green-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Lesson Resources</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Files
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleAttachmentUpload}
              className="hidden"
            />

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Creating...' : 'Create Lesson'}
            </Button>
            <Button type="button" variant="outline" onClick={() => {
              setFormData({
                title: '',
                description: '',
                content_type: 'video',
                video_type: 'upload',
                video_url: '',
                duration: 0,
                is_free: false,
                is_preview: false,
                text_content: '',
                display_order: 0
              })
              setAttachments([])
            }}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}