'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Eye, Sparkles, Heart, Star } from 'lucide-react'

export function VisionSection() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'our_tribe')
        .eq('section_key', 'all')
        .maybeSingle()

      if (error) {
        console.error('Database error:', error)
      }

      // Find the vision section from the sections array
      if (data?.content?.sections) {
        const visionSection = data.content.sections.find((section: any) => section.type === 'vision')
        if (visionSection) {
          setContent(visionSection)
        }
      }
    } catch (error) {
      console.error('Error loading vision content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fallback = {
    title: 'Our Vision',
    content: '<p>We envision a world where every person has access to basic necessities, education, and opportunities to thrive in a caring community. Through strategic partnerships and innovative programs, we\'re building a future where gratitude and giving create ripples of positive change.</p><p>Our approach is holistic: addressing immediate needs while building long-term solutions that empower communities to sustain themselves.</p>',
    image: ''
  }

  const data = content || fallback

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 md:py-36 bg-gradient-to-b from-purple-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/15 rounded-full blur-3xl" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-32 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-30" />
        <div className="absolute top-48 left-40 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-30" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 right-48 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-30" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Enhanced Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="space-y-8 order-2 lg:order-1"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-purple-900 leading-tight">
                    {data.title}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-yellow-500 rounded-full mt-4" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-700 leading-relaxed prose prose-xl max-w-none space-y-6"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />

              {/* Vision Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-900 font-semibold">Inclusive Growth</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-900 font-semibold">Sustainable Change</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200 shadow-sm hover:shadow-md transition-shadow">
                  <Star className="w-5 h-5 text-pink-600" />
                  <span className="text-pink-900 font-semibold">Global Community</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Visual Section */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 80 }}
              className="relative order-1 lg:order-2"
            >
              {/* Main Vision Card */}
              <div className="relative">
                <motion.div
                  initial={{ rotate: 2, scale: 0.95 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-1"
                >
                  <div className="relative bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-8 md:p-12">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                      >
                        <Eye className="w-10 h-10 text-white" />
                      </motion.div>

                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        Looking Forward
                      </h3>

                      <p className="text-gray-700 leading-relaxed mb-6">
                        Every vision starts with a single step. Together, we're creating a future where possibility knows no bounds.
                      </p>

                      {/* Vision Timeline Dots */}
                      <div className="flex justify-center gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 bg-purple-500 rounded-full mb-2 animate-pulse" />
                          <span className="text-sm text-gray-600">Today</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full mb-2 animate-pulse" style={{ animationDelay: '0.5s' }} />
                          <span className="text-sm text-gray-600">Tomorrow</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 bg-pink-500 rounded-full mb-2 animate-pulse" style={{ animationDelay: '1s' }} />
                          <span className="text-sm text-gray-600">Future</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating decorative elements */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, type: "spring" }}
                  className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl"
                >
                  <span className="text-2xl">🌟</span>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4, type: "spring" }}
                  className="absolute -bottom-4 -right-4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl"
                >
                  <span className="text-xl">💫</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

