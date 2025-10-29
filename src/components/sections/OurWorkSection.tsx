'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'

interface WorkProject {
  id: string
  category: string
  title: string
  description: string
  image: string
  details: string[]
  bgColor?: string
}

interface ImpactStat {
  number: string
  label: string
  sublabel: string
}

export function OurWorkSection() {
  const [stats, setStats] = useState<ImpactStat[]>([
    { number: '3000+', label: 'Lives Impacted', sublabel: 'Across our projects' },
    { number: '1000+', label: 'Meals Served', sublabel: 'Every single day' },
    { number: '12+', label: 'Communities', sublabel: 'Actively serving' }
  ])
  const [projects, setProjects] = useState<WorkProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      console.log('Loading Our Work content...')
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'our_work')
        .eq('section_key', 'all')
        .maybeSingle()

      console.log('Our Work data:', data)
      console.log('Our Work error:', error)

      if (error) {
        console.error('Database error:', error)
      }

      if (data?.content) {
        console.log('Found content:', data.content)
        if (data.content.stats) {
          console.log('Loading stats:', data.content.stats)
          setStats(data.content.stats)
        }
        if (data.content.projects) {
          console.log('Loading projects:', data.content.projects)
          setProjects(data.content.projects)
        }
      } else {
        console.log('No content found in database, using defaults')
      }
    } catch (error) {
      console.error('Error loading our work content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900">
        <div className="container mx-auto px-4 text-center text-white">
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Impact by Numbers Section */}
      <section className="py-16 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-2">Impact by the Numbers</h2>
            <p className="text-white/80 text-lg">Real change, measurable impact</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-black text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-bold mb-1">{stat.label}</div>
                <div className="text-white/70">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-purple-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stories of transformation, hope, and lasting impact
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto space-y-16">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                {/* Text Content */}
                <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                  <div className="inline-block px-4 py-2 bg-yellow-400 text-purple-900 rounded-full text-sm font-bold mb-4">
                    {project.category}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-purple-900 mb-4">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="space-y-3">
                    <div className="font-bold text-purple-900 mb-2">Key Details:</div>
                    {project.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-yellow-500 text-lg mt-1">👉</span>
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={project.image || '/placeholder-project.jpg'}
                      alt={project.title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No projects added yet. Add projects from the admin panel!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
