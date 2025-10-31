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

        {/* Enhanced Project Cards Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                {/* Animated Background Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 rounded-[2rem] opacity-0 group-hover:opacity-20 transition-all duration-500 blur-2xl" />

                <Card className="relative h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden bg-white backdrop-blur-sm">
                  {/* Image Section with Enhanced Effects */}
                  <CardHeader className="p-0 relative">
                    {project.image_url && (
                      <div className="relative h-64 md:h-72 overflow-hidden">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-yellow-500/20" />

                        {/* Main Image */}
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        />

                        {/* Dynamic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                        {/* Status Badges with Animation */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                          {project.status === 'active' && (
                            <motion.div
                              initial={{ scale: 0, rotate: -10 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg backdrop-blur-sm"
                            >
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              Active Project
                            </motion.div>
                          )}
                          {project.status === 'upcoming' && (
                            <motion.div
                              initial={{ scale: 0, rotate: 10 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg backdrop-blur-sm"
                            >
                              🚀 Coming Soon
                            </motion.div>
                          )}
                          {project.status === 'completed' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-lg backdrop-blur-sm"
                            >
                              ✅ Completed
                            </motion.div>
                          )}
                        </div>

                        {/* Floating Action Button */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="absolute bottom-6 right-6"
                        >
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer group/btn">
                            <ExternalLink className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-8">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <CardTitle className="text-2xl md:text-3xl font-black mb-4 text-purple-900 leading-tight">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 leading-relaxed mb-6">
                          {project.description}
                        </CardDescription>
                      </motion.div>

                      {/* Impact Stats with Enhanced Styling */}
                      {project.impact_stats && Object.keys(project.impact_stats).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex flex-wrap gap-3 mb-6"
                        >
                          {project.impact_stats.members && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm text-purple-600 font-medium">Members</div>
                                <div className="text-lg font-bold text-purple-900">{project.impact_stats.members}</div>
                              </div>
                            </div>
                          )}
                          {project.impact_stats.returns && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm text-yellow-600 font-medium">Returns</div>
                                <div className="text-lg font-bold text-yellow-900">{project.impact_stats.returns}</div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Technologies with Better Design */}
                      {project.technologies && Array.isArray(project.technologies) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="mb-6"
                        >
                          <div className="grid grid-cols-1 gap-3">
                            {project.technologies.map((tech: string, i: number) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 + index * 0.1 + i * 0.05 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-gray-700 font-medium">{tech}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>

                  {/* Enhanced Footer */}
                  <CardFooter className="px-8 pb-8">
                    {project.external_link && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="w-full"
                      >
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-bold py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 group/btn rounded-2xl"
                        >
                          <a href={project.external_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                            <span>Join This Project</span>
                            <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-all duration-300" />
                          </a>
                        </Button>
                      </motion.div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
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

