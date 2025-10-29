'use client'

import { useEffect, useState } from 'react'
import { ContentService } from '@/services/content.service'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Quote } from 'lucide-react'

export function FounderPreviewSection() {
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    ContentService.getSection('founder_preview').then(setContent)
  }, [])

  if (!content) return null

  return (
    <section id="founder" className="py-20 md:py-32 bg-gradient-to-b from-white to-purple-50/50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            {/* Image Container with Gradient Border */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-yellow-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl" />
              <div className="relative bg-gradient-to-br from-purple-100 to-yellow-100 p-2 rounded-3xl">
                <img
                  src={content.content?.image}
                  alt="Founder"
                  className="rounded-2xl shadow-2xl w-full object-cover aspect-[3/4]"
                />
              </div>
              {/* Decorative Quote Icon */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-xl">
                <Quote className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4"
              >
                <span className="text-sm font-semibold text-purple-900">Meet Our Founder</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent leading-tight">
                {content.title}
              </h2>
              <p className="text-xl md:text-2xl text-purple-600 mb-6 font-semibold">{content.subtitle}</p>
            </div>
            
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-yellow-500 rounded-full" />
              <p className="text-lg text-gray-700 leading-relaxed pl-6">{content.content?.description}</p>
            </div>
            
            <div className="pt-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                {content.content?.ctaText || 'Learn More'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
