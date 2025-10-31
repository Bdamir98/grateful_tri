'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface FounderStory {
  title: string
  content: string
  quote: {
    text: string
    author: string
  }
  additionalContent: string
  story?: {
    title: string
    content: string
    quote: {
      text: string
      author: string
    }
    additionalContent: string
  }
}

export function FounderJourneySection() {
  const [content, setContent] = useState<FounderStory>({
    title: 'A Journey of Purpose',
    content: '<p>Sal K. was living a dream of globalization, vitality, and discovering communities for making a difference in the world.</p><p>What he experienced wasn\'t meant to be a <strong>career</strong> but aspiration to make a mark in the life experiences of communities in all walks of life. This journey started with an education in the Philippines but took on epic levels of meaning.</p>',
    quote: {
      text: "Success isn't measured by what we accomplish, but by what we give back and the lives we touch along the way",
      author: 'Sal Khan'
    },
    additionalContent: '<p>Through walks of life shared in diverse cultures and communities, Sal was finding opportunities not only to learn from different families and their communities in underprivileged communities, but being able to contribute and share a sense of gratitude with them.</p><p>But it wasn\'t his vision or his power that made change — it was a team of grateful contributors who knew Sal and his ambitions and trusted his leadership.</p>',
    story: {
      title: 'A Journey of Purpose',
      content: '<p>Sal K. was living a dream of globalization, vitality, and discovering communities for making a difference in the world.</p><p>What he experienced wasn\'t meant to be a <strong>career</strong> but aspiration to make a mark in the life experiences of communities in all walks of life. This journey started with an education in the Philippines but took on epic levels of meaning.</p>',
      quote: {
        text: "Success isn't measured by what we accomplish, but by what we give back and the lives we touch along the way",
        author: 'Sal Khan'
      },
      additionalContent: '<p>Through walks of life shared in diverse cultures and communities, Sal was finding opportunities not only to learn from different families and their communities in underprivileged communities, but being able to contribute and share a sense of gratitude with them.</p><p>But it wasn\'t his vision or his power that made change — it was a team of grateful contributors who knew Sal and his ambitions and trusted his leadership.</p>'
    }
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

      if (data?.content?.story) {
        setContent(prev => ({ ...prev, ...data.content.story }))
      }
    } catch (error) {
      console.error('Error loading founder story:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-purple-50/30 to-white relative">
      {/* Subtle background decorations */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-200/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full text-sm font-bold mb-8 shadow-lg"
          >
            📖 The Story
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-purple-900 mb-10 leading-tight">
            {content.title}
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-8 text-gray-700 text-xl leading-relaxed prose prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-yellow-400 opacity-60" />
            <blockquote className="relative text-2xl md:text-3xl font-bold text-center italic leading-relaxed">
              "{content.quote.text}"
            </blockquote>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, type: "spring" }}
              className="text-center mt-6"
            >
              <span className="inline-block px-6 py-3 bg-yellow-400 text-purple-900 rounded-full text-lg font-bold shadow-lg">
                — {content.quote.author}
              </span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="text-gray-700 text-xl leading-relaxed prose prose-xl max-w-none space-y-8">
            <div dangerouslySetInnerHTML={{ __html: content.additionalContent }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
