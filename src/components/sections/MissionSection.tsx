'use client'

import { useEffect, useState } from 'react'
import { ContentService } from '@/services/content.service'
import { motion } from 'framer-motion'
import { Globe, Users, Target } from 'lucide-react'

export function MissionSection() {
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    ContentService.getSection('mission').then(setContent)
  }, [])

  const fallback = {
    title: 'Our Mission',
    content: {
      description:
        'At The Grateful Tribe, we believe in the power of gratitude and collective action. Our mission is to create sustainable, positive change in communities by addressing critical needs and empowering individuals to reach their full potential.',
      details:
        'We work tirelessly to ensure that no one goes hungry, that children have access to education, and that communities have the resources they need to thrive.',
    },
  }

  const data = content || fallback

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start gap-8"
          >
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-purple-900">{data.title}</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {data.content?.description}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {data.content?.details}
              </p>
            </motion.div>

            {/* Logo/Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div className="w-64 h-48 bg-gradient-to-br from-purple-600 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-900/80" />
                <div className="relative text-center p-6">
                  <div className="text-yellow-400 text-4xl font-black mb-2">THE Grateful TRIBE</div>
                  <div className="flex gap-2 justify-center">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                    <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

