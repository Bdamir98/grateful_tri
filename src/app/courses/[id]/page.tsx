'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CourseService } from '@/services/course.service'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CourseContent } from '@/components/course/CourseContent'
import Link from 'next/link'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadCourse()
    }
  }, [params.id, user])

  const loadCourse = async () => {
    const courseData = await CourseService.getCourseWithContent(params.id as string)
    setCourse(courseData)

    if (user) {
      const enrolled = await CourseService.isUserEnrolled(user.id, params.id as string)
      setIsEnrolled(enrolled)
    }

    setLoading(false)
  }

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setEnrolling(true)
    const success = await CourseService.enrollUser(user.id, params.id as string)
    if (success) {
      setIsEnrolled(true)
    }
    setEnrolling(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 pb-20 flex items-center justify-center">
          <p>Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 pb-20 flex items-center justify-center">
          <p>Course not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <img
                src={course.thumbnail_url || '/placeholder-course.jpg'}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-black mb-4">{course.title}</h1>
              <p className="text-lg text-gray-700 mb-6">{course.description}</p>
              <p className="text-gray-600 mb-4">
                Instructor: {course.instructor_name || 'The Grateful Tribe'}
              </p>

              <div className="mt-8">
                <CourseContent
                  courseId={course.id}
                  modules={course.modules || []}
                  totalLectures={course.totalLectures || 0}
                  totalDuration={course.totalDuration || 0}
                  isEnrolled={isEnrolled}
                />
              </div>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-primary mb-2">${course.price}</p>
                    <p className="text-gray-600">One-time payment</p>
                  </div>
                  {isEnrolled ? (
                    <Button className="w-full" size="lg" disabled>
                      Already Enrolled
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <p>✓ Lifetime access</p>
                    <p>✓ All course materials</p>
                    <p>✓ Certificate of completion</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
