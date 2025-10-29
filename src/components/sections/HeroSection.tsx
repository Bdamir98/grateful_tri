'use client'

import { useEffect, useState } from 'react'
import { ConfigService } from '@/services/config.service'
import { ContentService } from '@/services/content.service'
import CountUp from 'react-countup'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Heart, Users, Globe, TrendingUp, Award, Target } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  const [settings, setSettings] = useState<any>(null)
  const [heroContent, setHeroContent] = useState<any>(null)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const [siteSettings, heroSection] = await Promise.all([
        ConfigService.getSiteSettings(),
        ContentService.getPageContent('home', 'all')
      ])
      
      console.log('Loaded hero section:', heroSection)
      console.log('Site settings:', siteSettings)
      
      setSettings(siteSettings)
      
      // Use loaded content or fallback
      const heroData = heroSection?.hero || {
        title: "Lives Waiting to Be Changed Through Your Digital Success",
        subtitle: "Join a revolutionary movement combining digital education with real-world impact.",
        badge: "Empowering Communities Worldwide",
        ctaText: "Join the Projects",
        videoUrl: siteSettings?.heroVideo || '/website-intro.mp4'
      }
      
      console.log('Final hero content:', heroData)
      setHeroContent(heroData)
    } catch (error) {
      console.error('Error loading hero content:', error)
      // Set fallback data on error
      setSettings({
        siteName: 'The Grateful Tribe',
        impactGoal: 10000,
        heroVideo: '/website-intro.mp4'
      })
      setHeroContent({
        title: "Lives Waiting to Be Changed Through Your Digital Success",
        subtitle: "Join a revolutionary movement combining digital education with real-world impact.",
        badge: "Empowering Communities Worldwide",
        ctaText: "Join the Projects",
        videoUrl: '/website-intro.mp4'
      })
    }
  }

  if (!settings || !heroContent) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        {heroContent.videoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroContent.videoUrl} type="video/mp4" />
          </video>
        )}
        
        {/* Gradient Overlays - Light overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-purple-800/20 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10" />
        
        {/* Animated Particles - Reduced for clearer video */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold">{heroContent.badge || 'Empowering Communities Worldwide'}</span>
            </motion.div>

            {/* Impact Number */}
            <motion.h1 
              className="text-7xl md:text-9xl font-black mb-4 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            >
              <CountUp end={settings.impactGoal} duration={3} separator="," />
            </motion.h1>
            
            {/* Main Title */}
            <motion.p 
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {heroContent.title}
            </motion.p>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-gray-100 max-w-4xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {heroContent.subtitle}
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                asChild
                size="lg" 
                className="text-lg px-10 py-7 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 font-bold shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 group"
              >
                <Link href="/projects">
                  {heroContent.ctaText || 'Join the Projects'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="text-lg px-10 py-7 border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm text-white font-semibold bg-gray-900"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
              >
                <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-purple-900 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Users, value: '10K+', label: 'Community Members' },
              { icon: Globe, value: '50+', label: 'Countries Reached' },
              { icon: Award, value: '100+', label: 'Success Stories' },
              { icon: TrendingUp, value: '95%', label: 'Success Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center text-white"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20"
                >
                  <stat.icon className="w-8 h-8 text-yellow-300" />
                </motion.div>
                <h3 className="text-4xl font-black mb-2 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-gray-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-purple-800 via-purple-900 to-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
              Why Choose <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">The Grateful Tribe</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join a global movement that transforms lives through digital opportunities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Heart,
                title: 'Make an Impact',
                description: 'Every action you take helps children in need. Your success directly contributes to changing lives.',
                color: 'from-red-500 to-pink-500',
              },
              {
                icon: TrendingUp,
                title: 'Earn While You Learn',
                description: 'Access cutting-edge training in crypto, AI, and digital skills. Create multiple income streams.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Users,
                title: 'Global Community',
                description: 'Connect with like-minded individuals worldwide. Share knowledge, grow together, succeed together.',
                color: 'from-blue-500 to-cyan-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full hover:border-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Target className="w-20 h-20 text-yellow-300" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Ready to <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">Transform Your Life</span>?
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
              Join thousands of people who are earning income while making a difference in the world.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="text-xl px-12 py-8 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 font-black shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300"
              >
                <Link href="/projects">
                  Get Started Today
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
