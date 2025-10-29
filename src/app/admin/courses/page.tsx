'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    
    setCourses(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (!error) {
      loadCourses()
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('courses')
      .update({ is_published: !currentStatus })
      .eq('id', id)
    
    loadCourses()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-gray-600">Manage your course catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">No courses yet. Create your first course!</p>
            <Button asChild>
              <Link href="/admin/courses/create">Create Course</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <img
                  src={course.thumbnail_url || '/placeholder-course.jpg'}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">${course.price}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/admin/courses/${course.id}`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublish(course.id, course.is_published)}
                  >
                    {course.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
