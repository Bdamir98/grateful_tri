'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

export function FounderHeroSection() {
  const [content, setContent] = useState({
    title: 'Our Founder',
    subtitle: 'Meet the visionary behind The Grateful Tribe',
    founderName: 'John Doe',
    founderTitle: 'Founder & CEO',
    founderImage: '/sl_founder.jpg',
    founderBio: '<p>Passionate about creating positive change...</p>'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'founder')
        .eq('section_key', 'all')
        .maybeSingle()

      if (error) {
        console.error('Database error:', error)
      }

      if (data?.content?.hero) {
        setContent(data.content.hero)
      }
    } catch (error) {
      console.error('Error loading founder content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-24 md:py-36 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-400/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="order-2 lg:order-1"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-yellow-400/20">
                {content.founderImage ? (
                  <img
                    src={content.founderImage}
                    alt={`${content.founderName} - ${content.founderTitle}`}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-purple-700 to-purple-800 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl">👤</span>
                      <p className="text-white font-semibold mt-4">Founder Photo</p>
                      <p className="text-white/70 text-sm">Coming Soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 rounded-full text-sm font-bold mb-6 shadow-lg"
            >
              ✨ {content.title || 'Our Founder'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Meet{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                {content.founderName}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-white/90 mb-6 font-medium"
            >
              {content.founderTitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-lg text-white/80 mb-10 leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content.founderBio }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Learn About Our Mission →
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
