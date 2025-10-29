'use client'

import { motion } from 'framer-motion'

export function ImpactStatsSection() {
  const stats = [
    {
      value: '3000+',
      label: 'Lives Impacted',
      description: 'Directly changing lives',
      color: 'yellow',
    },
    {
      value: '1000+',
      label: 'Projects Completed',
      description: 'Making real impact',
      color: 'white',
    },
    {
      value: '12+',
      label: 'Communities',
      description: 'Around the globe',
      color: 'yellow',
    },
  ]

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4">Impact by the Numbers</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            Real, measurable impact on communities around the world
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative p-8 rounded-3xl text-center ${
                stat.color === 'yellow'
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-purple-900'
                  : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
              }`}
            >
              <div className="text-5xl md:text-6xl font-black mb-2">{stat.value}</div>
              <div className="text-xl font-bold mb-1">{stat.label}</div>
              <div className={stat.color === 'yellow' ? 'text-purple-800' : 'text-white/80'}>
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
