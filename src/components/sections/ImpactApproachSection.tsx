'use client'

import { useEffect, useState } from 'react'
import { ContentService } from '@/services/content.service'
import { motion } from 'framer-motion'
import { Users, Leaf, Eye, Lightbulb, Handshake, ShieldCheck } from 'lucide-react'

const iconMap: Record<string, any> = {
  'Community-Centered': Users,
  'Sustainable Solutions': Leaf,
  'Transparency': Eye,
  'Innovation': Lightbulb,
  'Collaboration': Handshake,
  'Accountability': ShieldCheck,
}

export function ImpactApproachSection() {
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    ContentService.getSection('impact_approach').then(setContent)
  }, [])

  const fallback = {
    title: 'Our Impact Approach',
    subtitle:
      'Every action we take is guided by core principles that ensure maximum impact',
    content: {
      principles: [
        {
          title: 'Community-Centered',
          description:
            'We listen to and work directly with communities to understand their unique needs and co-create solutions.',
        },
        {
          title: 'Sustainable Solutions',
          description:
            'Our programs are designed to create lasting change, not just temporary relief.',
        },
        {
          title: 'Transparency',
          description:
            'We maintain open communication about our work, impact, and how resources are utilized.',
        },
        {
          title: 'Innovation',
          description:
            'We continuously seek new and better ways to address complex challenges.',
        },
        {
          title: 'Collaboration',
          description:
            'We partner with local organizations, businesses, and individuals to amplify our impact.',
        },
        {
          title: 'Accountability',
          description:
            'We measure our impact rigorously and hold ourselves accountable to the communities we serve.',
        },
      ],
    },
  }

  const data = {
    title: content?.title || fallback.title,
    subtitle: content?.subtitle || fallback.subtitle,
  }

  const dbPrinciples = content?.content?.principles || []
  const principles = dbPrinciples.length >= 6 ? dbPrinciples : fallback.content.principles

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-purple-50/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-purple-900">
            {data.title}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {principles.map((principle: any, index: number) => {
            const Icon = iconMap[principle.title] || Users
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-4 text-center">
                  {principle.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  {principle.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

