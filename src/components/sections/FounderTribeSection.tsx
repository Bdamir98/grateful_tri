'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'

interface FounderTribe {
  title: string
  content: string
  images: {
    src: string
    alt: string
  }[]
}

export function FounderTribeSection() {
  const [content, setContent] = useState<FounderTribe>({
    title: 'The Grateful Tribe',
    content: '<p>More than an organization, <strong>it\'s a community dedicated to</strong> making everyone realize that we can do more and be more to help others. We believe in the power of gratitude and collective growth.</p><p>Sal\'s philosophy on life is that we can contribute energetically and fully for the common good when people are united globally. That contribution is precisely the type of energy that creates sustainable change worldwide.</p><p>The Grateful Tribe was born from the idea that we are responsible in creating a peaceful place. This might sound intimidating, but with your <strong>skills and actions around the world</strong>, we can build a meaningful future together.</p>',
    images: []
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

      if (data?.content?.tribe) {
        setContent(prev => ({ ...prev, ...data.content.tribe }))
      }
    } catch (error) {
      console.error('Error loading founder tribe:', error)
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
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-purple-50/30 relative overflow-hidden">
      {/* Beautiful background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-purple-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-yellow-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Section */}
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
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-3xl">💛</span>
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-purple-900 leading-tight">
                    {content.title}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-4" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-gray-700 text-xl leading-relaxed prose prose-xl max-w-none space-y-6"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />

              {/* Enhanced Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-purple-900 font-semibold">Community Driven</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-yellow-900 font-semibold">Impact Focused</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 80 }}
              className="relative"
            >
              {/* Featured Image */}
              <div className="relative mb-6">
                <motion.div
                  initial={{ scale: 0.8, rotate: -1 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-purple-100 to-yellow-100 p-1"
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={content.images[0]?.src || '/placeholder-project.jpg'}
                      alt={content.images[0]?.alt || 'Community Impact'}
                      className="w-full h-80 md:h-96 object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white">
                        <h4 className="font-bold text-lg mb-1">Featured Moment</h4>
                        <p className="text-sm opacity-90">{content.images[0]?.alt || 'Making a difference together'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Secondary Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                {content.images.slice(1, 5).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.8 + index * 0.1,
                      type: "spring",
                      stiffness: 120
                    }}
                    className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-32 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs font-medium text-center truncate">{image.alt}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating decorative elements */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, type: "spring" }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl"
              >
                <span className="text-2xl">✨</span>
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
