'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Globe, Users, Target, ArrowRight, Sparkles } from 'lucide-react'

export function MissionSection() {
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

      // Find the mission section from the sections array
      if (data?.content?.sections) {
        const missionSection = data.content.sections.find((section: any) => section.type === 'mission')
        if (missionSection) {
          setContent(missionSection)
        }
      }
    } catch (error) {
      console.error('Error loading mission content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fallback = {
    title: 'Our Mission',
    content: '<p>At The Grateful Tribe, we believe in the power of gratitude and collective action. Our mission is to create sustainable, positive change in communities by addressing critical needs and empowering individuals to reach their full potential.</p><p>We work tirelessly to ensure that no one goes hungry, that children have access to education, and that communities have the resources they need to thrive.</p>',
    image: ''
  }

  const data = content || fallback

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-purple-50/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 md:py-36 bg-gradient-to-b from-white via-purple-50/50 to-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-200/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Enhanced Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-purple-900 leading-tight">
                    {data.title}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full mt-4" />
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

              {/* Call to Action Elements */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-900 font-semibold">Global Impact</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                  <Users className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-900 font-semibold">Community First</span>
                </div>
              </motion.div>

              {/* Enhanced CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="inline-block"
              >
                <button className="group bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
                  <span>Learn More About Our Work</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </motion.div>
            </motion.div>

            {/* Enhanced Visual Section */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 80 }}
              className="relative"
            >
              {/* Main Featured Card */}
              <div className="relative">
                <motion.div
                  initial={{ rotate: -2, scale: 0.95 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-1"
                >
                  <div className="relative bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-8 md:p-12">
                    <div className="text-center text-white">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                      >
                        <Sparkles className="w-10 h-10 text-purple-900" />
                      </motion.div>

                      <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Making Dreams Reality
                      </h3>

                      <p className="text-purple-100 leading-relaxed mb-6">
                        Every contribution, every action, every moment of gratitude creates ripples of positive change across our communities.
                      </p>

                      <div className="flex justify-center gap-4">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse" />
                        <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
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
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl"
                >
                  <span className="text-2xl">🌟</span>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4, type: "spring" }}
                  className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl"
                >
                  <span className="text-xl">💜</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

