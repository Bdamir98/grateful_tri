'use client'

import { useEffect, useState } from 'react'
import { CourseService } from '@/services/course.service'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react'

export function CoursesSection() {
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    CourseService.getPublishedCourses().then(data => setCourses(data.slice(0, 3)))
  }, [])

  return (
    <section id="courses" className="py-20 md:py-32 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Learn & Earn</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 bg-clip-text text-transparent">
            Our Courses
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Learn new skills and create income opportunities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <Card className="relative h-full border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 rounded-2xl overflow-hidden bg-white shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail_url || '/placeholder-course.jpg'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {course.price === 0 && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                        FREE
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <CardTitle className="text-xl font-bold mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      By {course.instructor_name || 'The Grateful Tribe'}
                    </span>
                    <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      ${course.price}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6">
                  <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn">
                    <Link href={`/courses/${course.id}`}>
                      View Course
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <Button asChild size="lg" className="bg-white hover:bg-gray-50 text-purple-700 border-2 border-purple-300 hover:border-purple-400 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/courses">
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
