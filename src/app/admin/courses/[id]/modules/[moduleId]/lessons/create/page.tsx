'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'

export default function CreateLessonPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<Array<{ file: File; progress: number }>>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'video' as 'video' | 'pdf' | 'audio' | 'document' | 'quiz' | 'text',
    video_type: 'youtube' as 'upload' | 'youtube' | 'url',
    video_url: '',
    duration: 0,
    is_preview: false,
    is_free: false,
    text_content: '',
    display_order: 1,
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        progress: 0
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const uploadFiles = async (lessonId: string) => {
    setUploading(true)
    
    for (let i = 0; i < files.length; i++) {
      const { file } = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `lessons/${lessonId}/${fileName}`

      try {
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-materials')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('course-materials')
          .getPublicUrl(filePath)

        // Save attachment record
        await supabase.from('lecture_attachments').insert({
          lesson_id: lessonId,
          file_name: file.name,
          file_type: fileExt || '',
          file_url: urlData.publicUrl,
          file_storage_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          display_order: i
        })

        // Update progress
        setFiles(prev => {
          const updated = [...prev]
          updated[i].progress = 100
          return updated
        })
      } catch (error) {
        console.error('Error uploading file:', error)
        alert(`Failed to upload ${file.name}`)
      }
    }
    
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create lesson
      const { data: lesson, error } = await supabase
        .from('course_lessons')
        .insert({
          module_id: params.moduleId as string,
          ...formData,
        })
        .select()
        .single()

      if (error) throw error

      // Upload files if any
      if (files.length > 0 && lesson) {
        await uploadFiles(lesson.id)
      }

      router.push(`/admin/courses/${params.id}/modules/${params.moduleId}`)
    } catch (error) {
      console.error('Error creating lesson:', error)
      alert('Failed to create lecture. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/admin/courses/${params.id}/modules/${params.moduleId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Module
        </Link>
        <h1 className="text-3xl font-bold mb-2">Add Lecture</h1>
        <p className="text-gray-600">Create a new lecture with content and attachments</p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {/* Main Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Lecture Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lecture Title *</Label>
              <Input
                id="title"
                required
                placeholder="e.g., Introduction to AI"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this lecture"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content_type">Content Type *</Label>
              <select
                id="content_type"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.content_type}
                onChange={(e) => setFormData({ ...formData, content_type: e.target.value as any })}
              >
                <option value="video">Video</option>
                <option value="pdf">PDF Document</option>
                <option value="audio">Audio</option>
                <option value="document">Document</option>
                <option value="text">Text/Article</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>

            {formData.content_type === 'video' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="video_type">Video Type</Label>
                  <select
                    id="video_type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.video_type}
                    onChange={(e) => setFormData({ ...formData, video_type: e.target.value as any })}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="url">External URL</option>
                    <option value="upload">Upload</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  />
                </div>
              </>
            )}

            {formData.content_type === 'text' && (
              <div className="space-y-2">
                <Label htmlFor="text_content">Text Content</Label>
                <Textarea
                  id="text_content"
                  placeholder="Enter the text content for this lecture"
                  value={formData.text_content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, text_content: e.target.value })}
                  rows={8}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  placeholder="300"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_preview"
                  checked={formData.is_preview}
                  onChange={(e) => setFormData({ ...formData, is_preview: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_preview" className="cursor-pointer">
                  🔓 Allow preview (visible without enrollment)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_free" className="cursor-pointer">
                  ✨ Free lecture (always accessible)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Attachments Card */}
        <Card>
          <CardHeader>
            <CardTitle>File Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Upload PDFs, videos, audio files, documents, etc.
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mp3,.wav,.zip"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Select Files
              </Button>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Selected Files ({files.length})</h4>
                {files.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(item.file.size)}
                        {item.progress > 0 && ` • ${item.progress}% uploaded`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-blue-900 mb-2">💡 Tip</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Students can download attached files</li>
                <li>• Supports: PDF, Word, Excel, PowerPoint, Videos, Audio</li>
                <li>• Files are stored securely in Supabase Storage</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="md:col-span-2 flex gap-3">
          <Button type="submit" disabled={loading || uploading}>
            {loading ? 'Creating...' : uploading ? 'Uploading Files...' : 'Create Lecture'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/courses/${params.id}/modules/${params.moduleId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
