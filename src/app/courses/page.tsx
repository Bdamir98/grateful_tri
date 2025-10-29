'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CourseService } from '@/services/course.service'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BookOpen } from 'lucide-react'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const data = await CourseService.getPublishedCourses()
    console.log('Published courses loaded:', data)
    setCourses(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">All Courses</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive course catalog and start learning today
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No courses available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <img
                      src={course.thumbnail_url || '/placeholder-course.jpg'}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        By {course.instructor_name || 'The Grateful Tribe'}
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ${course.price}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Course
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
