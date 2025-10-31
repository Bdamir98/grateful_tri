'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { cache } from '@/lib/cache'

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
    const cacheKey = 'our_work_content'
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      setStats(cachedData.stats)
      setProjects(cachedData.projects)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'our_work')
        .eq('section_key', 'all')
        .maybeSingle()

      const content = {
        stats: data?.content?.stats || [
          { number: '3000+', label: 'Lives Impacted', sublabel: 'Across our projects' },
          { number: '1000+', label: 'Meals Served', sublabel: 'Every single day' },
          { number: '12+', label: 'Communities', sublabel: 'Actively serving' }
        ],
        projects: data?.content?.projects || []
      }
      
      cache.set(cacheKey, content, 1)
      setStats(content.stats)
      setProjects(content.projects)
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

          <div className="max-w-7xl mx-auto">
            {projects && projects.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    className="group"
                  >
                    {/* Image Container */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-purple-50 to-yellow-50 p-2">
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          src={project.image || '/placeholder-project.jpg'}
                          alt={project.title}
                          className="w-full h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-6 left-6">
                          <span className="inline-flex items-center px-4 py-2 bg-yellow-400 text-purple-900 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm bg-opacity-95">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="px-2">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                      >
                        <h3 className="text-2xl md:text-3xl font-black text-purple-900 mb-4 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                          {project.description}
                        </p>

                        {/* Key Details */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-purple-900 text-lg">Key Highlights:</h4>
                          <div className="grid gap-3">
                            {project.details.slice(0, 3).map((detail, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 + 0.4 + idx * 0.1 }}
                                className="flex items-start gap-4 p-3 bg-gradient-to-r from-purple-50 to-yellow-50 rounded-xl border border-purple-100"
                              >
                                <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                                  <span className="text-purple-900 font-bold text-sm">{idx + 1}</span>
                                </div>
                                <span className="text-gray-700 leading-relaxed pt-1">{detail}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">No Projects Yet</h3>
                  <p className="text-gray-600 text-lg">
                    Add your first project from the admin panel to showcase your impact and stories.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
