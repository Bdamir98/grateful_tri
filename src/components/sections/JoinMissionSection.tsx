"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function JoinMissionSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-purple-700 to-purple-900 text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">Join Us In Our Mission</h2>
          <p className="text-white/90 text-lg md:text-xl mb-8">
            Together, we can create a world where everyone has the opportunity to thrive
          </p>
          <Button className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-bold px-8 py-6 text-lg rounded-full shadow-xl">
            Get Involved Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
