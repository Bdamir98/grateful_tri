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
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400/20">
              {content.founderImage ? (
                <img
                  src={content.founderImage}
                  alt={`${content.founderName} - ${content.founderTitle}`}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-purple-600 flex items-center justify-center">
                  <p className="text-white">No image uploaded</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2 text-center md:text-left"
          >
            <div className="inline-block px-4 py-2 bg-yellow-400 text-purple-900 rounded-full text-sm font-bold mb-4">
              {content.title || 'Our Grateful Founder'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              Meet {content.founderName}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-4 leading-relaxed">
              {content.founderTitle}
            </p>
            <div 
              className="text-base md:text-lg text-white/80 mb-8 leading-relaxed prose prose-invert"
              dangerouslySetInnerHTML={{ __html: content.founderBio }}
            />
            <Button className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-bold px-8 py-6 text-lg rounded-full shadow-xl">
              Learn About Our Mission →
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
