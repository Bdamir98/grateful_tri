'use client'

import { useEffect, useState } from 'react'
import { ContentService } from '@/services/content.service'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ExternalLink, TrendingUp, Users, DollarSign, GraduationCap, Heart } from 'lucide-react'

export function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    ContentService.getProjects().then(setProjects)
  }, [])

  return (
    <section id="projects" className="py-20 md:py-32 bg-gradient-to-b from-purple-50/50 via-white to-purple-50/50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 bg-clip-text text-transparent">
            Our Projects
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Join meaningful projects that create real impact. Earn income while helping children in need and developing valuable skills for your future.
          </p>
        </motion.div>

        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-4xl font-extrabold text-purple-900 mb-2">Active & Upcoming Projects</h3>
          <p className="text-gray-700 max-w-3xl mx-auto">Choose a project that aligns with your skills and interests. Every contribution makes a difference.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <Card className="relative h-full border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 rounded-3xl overflow-hidden bg-white shadow-xl">
                <CardHeader className="p-0">
                  {project.image_url && (
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {project.status === 'active' && (
                        <div className="absolute top-4 right-4 z-20 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          Active
                        </div>
                      )}
                      {project.status === 'upcoming' && (
                        <div className="absolute top-4 right-4 z-20 px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <CardTitle className="text-2xl md:text-3xl font-black mb-3 group-hover:text-purple-700 transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                {project.impact_stats && Object.keys(project.impact_stats).length > 0 && (
                  <div className="px-6 pb-4">
                    <div className="flex gap-4">
                      {project.impact_stats.members && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-900">{project.impact_stats.members} Members</span>
                        </div>
                      )}
                      {project.impact_stats.returns && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-900">{project.impact_stats.returns} Returns</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <CardContent className="px-6 pb-6">
                  {project.technologies && Array.isArray(project.technologies) && (
                    <ul className="space-y-3">
                      {project.technologies.map((tech: string, i: number) => (
                        <li key={i} className="flex items-start group/item">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mr-3 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-700 leading-relaxed">{tech}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter className="px-6 pb-6">
                  {project.external_link && (
                    <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group/btn">
                      <a href={project.external_link} target="_blank" rel="noopener noreferrer">
                        Join Now
                        <ExternalLink className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-4xl font-extrabold text-white/0 bg-clip-text bg-gradient-to-r from-purple-900 to-purple-700 text-transparent">Why Join Our Projects?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 text-center">
              <div className="w-14 h-14 rounded-full bg-yellow-400/90 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-purple-900" />
              </div>
              <div className="font-extrabold text-purple-900 text-xl mb-2">Earn Income</div>
              <p className="text-gray-600">Get paid for your contributions and enjoy financial freedom.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 text-center">
              <div className="w-14 h-14 rounded-full bg-yellow-400/90 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-7 h-7 text-purple-900" />
              </div>
              <div className="font-extrabold text-purple-900 text-xl mb-2">Develop Skills</div>
              <p className="text-gray-600">Learn valuable skills that enhance your professional portfolio.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 text-center">
              <div className="w-14 h-14 rounded-full bg-yellow-400/90 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-purple-900" />
              </div>
              <div className="font-extrabold text-purple-900 text-xl mb-2">Make Impact</div>
              <p className="text-gray-600">Directly contribute to changing children’s lives worldwide.</p>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h3 className="text-2xl md:text-4xl font-extrabold text-purple-900 mb-3">Ready to Get Started?</h3>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">Join thousands of Grateful Tribe members who are making a difference while building their future. Start your journey today.</p>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold px-6 py-6 text-lg rounded-full shadow-xl">
            Join Our Projects
          </Button>
        </div>
      </div>
    </section>
  )
}

