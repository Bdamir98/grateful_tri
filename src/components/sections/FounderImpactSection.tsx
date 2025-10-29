'use client'

import { motion } from 'framer-motion'
import { Globe, Users, Award } from 'lucide-react'

export function FounderImpactSection() {
  const stats = [
    {
      icon: Globe,
      value: '36+',
      label: 'countries reached',
      color: 'purple',
    },
    {
      icon: Users,
      value: '1000+',
      label: 'lives changed',
      color: 'yellow',
    },
    {
      icon: Award,
      value: '15+',
      label: 'Years experience',
      color: 'purple',
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-purple-900 mb-4">
            Global Impact & Achievement
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Results that speak volumes on what we can contribute to the world
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow border border-purple-100"
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  stat.color === 'purple'
                    ? 'bg-gradient-to-br from-purple-600 to-purple-800'
                    : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                }`}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-purple-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
