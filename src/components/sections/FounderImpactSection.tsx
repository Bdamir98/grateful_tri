'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Users, Award } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface ImpactStats {
  value: string
  label: string
  icon: string
  color: 'purple' | 'yellow'
}

interface FounderImpact {
  title: string
  subtitle: string
  stats: ImpactStats[]
}

const iconMap = {
  globe: Globe,
  users: Users,
  award: Award,
}

export function FounderImpactSection() {
  const [content, setContent] = useState<FounderImpact>({
    title: 'Global Impact & Achievement',
    subtitle: 'Results that speak volumes on what we can contribute to the world',
    stats: [
      {
        icon: 'globe',
        value: '36+',
        label: 'countries reached',
        color: 'purple',
      },
      {
        icon: 'users',
        value: '1000+',
        label: 'lives changed',
        color: 'yellow',
      },
      {
        icon: 'award',
        value: '15+',
        label: 'Years experience',
        color: 'purple',
      },
    ]
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

      if (data?.content?.impact) {
        setContent(prev => ({ ...prev, ...data.content.impact }))
      }
    } catch (error) {
      console.error('Error loading founder impact:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-purple-50/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-purple-50/50 to-purple-100/30 relative overflow-hidden">
      {/* Beautiful background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-200/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full text-sm font-bold mb-6 shadow-xl"
          >
            🌟 Global Impact
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-purple-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 bg-clip-text text-transparent">
              {content.title}
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-gray-700 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-medium"
          >
            {content.subtitle}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {content.stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Globe
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                <div className="relative bg-white rounded-2xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-100 overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <div className={`absolute inset-0 ${
                      stat.color === 'purple'
                        ? 'bg-gradient-to-br from-purple-50 to-purple-100'
                        : 'bg-gradient-to-br from-yellow-50 to-yellow-100'
                    }`} />
                  </div>

                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 1, type: "spring" }}
                      className={`w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg ${
                        stat.color === 'purple'
                          ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                          : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                      }`}
                    >
                      <IconComponent className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 1.2, type: "spring" }}
                      className="text-4xl md:text-5xl lg:text-6xl font-black text-purple-900 mb-4 leading-none"
                    >
                      {stat.value}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 1.4 }}
                      className="text-gray-700 font-bold text-lg lg:text-xl"
                    >
                      {stat.label}
                    </motion.div>
                  </div>

                  {/* Decorative dots */}
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                    stat.color === 'purple' ? 'bg-purple-400' : 'bg-yellow-400'
                  } animate-pulse`} />
                  <div className={`absolute bottom-4 left-4 w-2 h-2 rounded-full ${
                    stat.color === 'purple' ? 'bg-purple-300' : 'bg-yellow-300'
                  } animate-pulse`} style={{ animationDelay: '1s' }} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
