'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Heart, DollarSign, Sparkles, Users, Target, Award } from 'lucide-react'

export function AboutSection() {
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

      if (data?.content?.hero) {
        setContent(data.content.hero)
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fallback = {
    heroTitle: 'Who We Are',
    heroSubtitle: "We're a community-driven organization dedicated to making a meaningful difference in the lives of those who need it most",
    heroImage: ''
  }

  const data = content || fallback

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-gradient-to-b from-white via-purple-50/30 to-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="who-we-are" className="relative py-24 md:py-36 bg-gradient-to-br from-white via-purple-50/50 to-white overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-30" />
        <div className="absolute top-40 right-32 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-30" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-30" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full mb-8 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-purple-900">Who We Are</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 bg-clip-text text-transparent">
              {data.heroTitle}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            {data.heroSubtitle}
          </motion.p>
        </motion.div>

        {/* Enhanced Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Heart,
              title: 'Community First',
              description: 'We believe in the power of united communities to create lasting change and support those who need it most.',
              color: 'from-purple-500 to-purple-700'
            },
            {
              icon: Users,
              title: 'People Focused',
              description: 'Every decision we make is centered around improving lives and building stronger, more connected communities.',
              color: 'from-yellow-400 to-yellow-600'
            },
            {
              icon: Target,
              title: 'Impact Driven',
              description: 'We measure our success by the tangible positive changes we create in the world around us.',
              color: 'from-purple-500 to-purple-700'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.2 + 0.8,
                duration: 0.6,
                type: "spring",
                stiffness: 120
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl bg-gradient-to-r ${feature.color}`} />

              <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-100 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    index % 2 === 0 ? 'from-purple-50 to-purple-100' : 'from-yellow-50 to-yellow-100'
                  }`} />
                </div>

                <div className="relative z-10 text-center">
                  {/* Icon with Enhanced Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 1, type: "spring" }}
                    className={`w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </motion.div>

                  {/* Title with Gradient */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 1.2 }}
                    className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 group-hover:text-purple-700 transition-colors"
                  >
                    {feature.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 1.4 }}
                    className="text-gray-600 leading-relaxed font-medium"
                  >
                    {feature.description}
                  </motion.p>
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                  index % 2 === 0 ? 'bg-purple-400' : 'bg-yellow-400'
                } animate-pulse`} />
                <div className={`absolute bottom-4 left-4 w-2 h-2 rounded-full ${
                  index % 2 === 0 ? 'bg-purple-300' : 'bg-yellow-300'
                } animate-pulse`} style={{ animationDelay: '1s' }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full text-purple-900 font-semibold shadow-lg">
            <Award className="w-5 h-5" />
            <span>Join Our Growing Community</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

