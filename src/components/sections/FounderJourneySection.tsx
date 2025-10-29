'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export function FounderJourneySection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-purple-900 mb-8">A Journey of Purpose</h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Sal K. was living a dream of globalization, vitality, and discovering communities for making a difference in the world.
            </p>
            <p>
              What he experienced wasn't meant to be a <strong>career</strong> but aspiration to make a mark in the life experiences of communities in all walks of life. This journey started with an education in the Philippines but took on epic levels of meaning.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-purple-700 to-purple-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-yellow-400 opacity-50" />
            <blockquote className="relative text-xl md:text-2xl font-semibold text-center italic leading-relaxed">
              "Success isn't measured by what we accomplish, but by what we
              give back and the lives we touch along the way"
            </blockquote>
            <p className="text-center mt-6 text-yellow-400 font-bold">— Sal Khan</p>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto mt-12 space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Through walks of life shared in diverse cultures and communities, Sal was finding opportunities not only to learn from different families and their communities in underprivileged communities, but being able to contribute and share a sense of gratitude with them.
          </p>
          <p>
            But it wasn't his vision or his power that made change — it was a team of grateful contributors who knew Sal and his ambitions and trusted his leadership.
          </p>
        </div>
      </div>
    </section>
  )
}
