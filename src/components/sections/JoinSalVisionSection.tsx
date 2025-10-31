'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface JoinVision {
  title: string
  content: string
  buttonText: string
  buttonLink?: string
}

export function JoinSalVisionSection() {
  const [content, setContent] = useState<JoinVision>({
    title: "Join Sal's Vision",
    content: '<p>Share in this remarkable journey of empowerment and purpose. Together, we\'re not just <strong>making an impact for the community as a tribe.</strong> Join The Grateful Tribe and help turn visions into reality.</p>',
    buttonText: 'Join Our Tribe'
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

      if (data?.content?.callToAction) {
        setContent(prev => ({ ...prev, ...data.content.callToAction }))
      }
    } catch (error) {
      console.error('Error loading call to action:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
      {/* Beautiful background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='50' cy='50' r='0.5' fill='%23ffffff' opacity='0.03'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grain)'/%3E%3C/svg%3E")`,
            width: '100%',
            height: '100%'
          }} />
        </div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-400/12 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-32 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
        <div className="absolute top-48 right-40 w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-48 w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-32 right-32 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Section badge */}
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-purple-900 rounded-full text-lg font-bold mb-8 shadow-2xl"
          >
            🚀 Join The Movement
          </motion.div>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
              {content.title}
            </span>
          </motion.h2>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed prose prose-invert prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />

          {/* Enhanced CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, type: "spring" }}
          >
            <Button
              asChild
              className="group relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-purple-900 font-bold px-10 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 overflow-hidden"
            >
              <a href={content.buttonLink || '#'} className="relative z-10 flex items-center gap-3">
                <span>{content.buttonText}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </a>
            </Button>
          </motion.div>

          {/* Supporting elements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1 }}
            className="flex justify-center items-center gap-6 mt-16"
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold">Community First</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold">Impact Driven</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold">Future Focused</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
