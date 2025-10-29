'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function JoinSalVisionSection() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-6">Join Sal's Vision</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Share in this remarkable journey of empowerment and purpose. Together, we're not just <strong>making an impact for the community as a tribe.</strong> Join The Grateful Tribe and help turn visions into reality.
          </p>
          <Button className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-bold px-8 py-6 text-lg rounded-full shadow-xl">
            Join Our Tribe
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
