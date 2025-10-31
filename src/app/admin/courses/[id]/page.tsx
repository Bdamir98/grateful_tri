'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Upload, X } from 'lucide-react'

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [modules, setModules] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor_name: '',
    price: 0,
    thumbnail_url: '',
    is_published: false,
  })

  useEffect(() => {
    if (params.id) {
      loadCourse()
      loadModules()
    }
  }, [params.id])

  const loadCourse = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single()

    if (data) {
      setFormData(data)
    }
  }

  const loadModules = async () => {
    const { data } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', params.id)
      .order('display_order')

    setModules(data || [])
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
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

      setFormData(prev => ({ ...prev, thumbnail_url: urlData.publicUrl }))
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await supabase
      .from('courses')
      .update(formData)
      .eq('id', params.id)

    setLoading(false)
    router.push('/admin/courses')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Course</h1>
        <p className="text-gray-600">Update course details and manage content</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor Name</Label>
                <Input
                  id="instructor"
                  value={formData.instructor_name}
                  onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Course Thumbnail</Label>
                <div className="space-y-3">
                  {formData.thumbnail_url ? (
                    <div className="relative">
                      <img 
                        src={formData.thumbnail_url} 
                        alt="Thumbnail preview" 
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload course thumbnail</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Choose Image'}
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <Input
                    placeholder="Or paste image URL"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                  Publish this course (make it visible on the website)
                </Label>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Course Modules</CardTitle>
            <Button size="sm" asChild>
              <Link href={`/admin/courses/${params.id}/modules`}>
                <Plus className="mr-2 h-3 w-3" />
                Add Module
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {modules.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No modules yet. Add your first module!</p>
            ) : (
              <div className="space-y-2">
                {modules.map((module) => (
                  <Link
                    key={module.id}
                    href={`/admin/courses/${params.id}/modules/${module.id}`}
                    className="block p-3 border rounded hover:bg-gray-50 hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">Manage →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
