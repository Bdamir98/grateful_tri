'use client'

import { motion } from 'framer-motion'

export function FounderTribeSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💛</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-purple-900">The Grateful Tribe</h2>
              </div>

              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  More than an organization, <strong>it's a community dedicated to</strong> making everyone realize that we can do more and be more to help others. We believe in the power of gratitude and collective growth.
                </p>
                <p>
                  Sal's philosophy on life is that we can contribute energetically and fully for the common good when people are united globally. That contribution is precisely the type of energy that creates sustainable change worldwide.
                </p>
                <p>
                  The Grateful Tribe was born from the idea that we are responsible in creating a peaceful place. This might sound intimidating, but with your <strong>skills and actions around the world</strong>, we can build a meaningful future together.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <img
                  src="/gallery-1.jpg"
                  alt="Impact"
                  className="rounded-2xl shadow-lg w-full h-48 object-cover"
                />
                <img
                  src="/gallery-2.jpg"
                  alt="Community"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="/gallery-3.jpg"
                  alt="Children"
                  className="rounded-2xl shadow-lg w-full h-56 object-cover"
                />
                <img
                  src="/gallery-4.jpg"
                  alt="Together"
                  className="rounded-2xl shadow-lg w-full h-56 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
