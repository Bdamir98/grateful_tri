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
    const courseData = await CourseService.getCourseWithContent(params.id as string, true)
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
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                <span>Instructor: {course.instructor_name || 'The Grateful Tribe'}</span>
                <span>•</span>
                <span>{course.totalLectures} lectures</span>
                <span>•</span>
                <span>{Math.floor((course.totalDuration || 0) / 3600)}h {Math.floor(((course.totalDuration || 0) % 3600) / 60)}m total</span>
                {course.freeLectures && course.freeLectures > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{course.freeLectures} free</span>
                  </>
                )}
              </div>

              <div className="mt-8">
                <CourseContent
                  courseId={course.id}
                  modules={course.modules || []}
                  totalLectures={course.totalLectures || 0}
                  totalDuration={course.totalDuration || 0}
                  isEnrolled={isEnrolled}
                  userType={isEnrolled ? 'paid' : (user ? 'free' : 'guest')}
                />
              </div>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-primary mb-2">${course.price}</p>
                    <p className="text-gray-600">One-time payment</p>
                    {course.freeLectures && course.freeLectures > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        {course.freeLectures} free {course.freeLectures === 1 ? 'lecture' : 'lectures'} available
                      </p>
                    )}
                  </div>
                  {isEnrolled ? (
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => router.push(`/courses/${course.id}/learn`)}
                      >
                        Continue Learning
                      </Button>
                      <p className="text-center text-sm text-green-600">✓ You're enrolled in this course</p>
                    </div>
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
                    <p>✓ Downloadable resources</p>
                    <p>✓ Certificate of completion</p>
                    <p>✓ 30-Day Money-Back Guarantee</p>
                    <p>✓ Full Lifetime Access</p>
                  </div>
                  
                  {course.freeLectures && course.freeLectures > 0 && !isEnrolled && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        🎯 Try before you buy!
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Access {course.freeLectures} free {course.freeLectures === 1 ? 'lesson' : 'lessons'} to get started
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full border-green-300 text-green-700 hover:bg-green-100"
                        onClick={() => router.push(`/courses/${course.id}/learn`)}
                      >
                        Start Free Lessons
                      </Button>
                    </div>
                  )}
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
