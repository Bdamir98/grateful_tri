'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export function FeaturedProjectsSection() {
  const projects = [
    {
      id: 1,
      badge: 'Our Impact',
      badgeColor: 'yellow',
      title: '150 kids. 100 dreams. One Big smile! 😊',
      description:
        'Last year, we had a very special moment in our journey – We impacted 150 children in our community. Each of these children received not only support but hope. Our team witnessed the smiles on their faces knowing they have a community that cares about their well-being and future.',
      keyPoints: [
        'Provided education resources to children',
        '50 volunteers participated in the event',
        'Distributed 300+ school supplies and books',
        'Created lasting bonds with the community',
      ],
      image: '/project-kids.jpg',
      imagePosition: 'right',
    },
    {
      id: 2,
      badge: 'Our Impact',
      badgeColor: 'yellow',
      title: '💝 Hearts in Action: Caring for All Ages@niles all around! 🤗💝',
      description:
        'One of our most heartfelt endeavors is caring for aging adults who have so much wisdom and love to share. Our volunteers spend time with them, bringing companionship, joy, and the reminder that their lives still matter deeply to our community. Through visits and shared moments, we celebrate the beauty of every generation.',
      keyPoints: [
        'Weekly visits to 25+ seniors in the community',
        'Organized group activities and celebrations',
        'Provided essential supplies and support',
        'Created meaningful intergenerational connections',
      ],
      image: '/project-seniors.jpg',
      imagePosition: 'left',
    },
    {
      id: 3,
      badge: 'Our Impact',
      badgeColor: 'yellow',
      title: 'Dancing Smiles, Changing Lives',
      description:
        "When we see children dancing and playing, we see more than just fun – we see hope for the future. We've been able to organize community events that bring kids together for celebration, learning, and growth. These programs give children a safe space to explore their creativity and develop skills that will serve them for life.",
      keyPoints: [
        'Hosted 12+ community celebration events',
        'Engaged 200+ children in creative programs',
        'Provided music and dance education',
        'Built confidence and social skills',
      ],
      image: '/project-dance.jpg',
      imagePosition: 'right',
    },
    {
      id: 4,
      badge: 'Our Impact',
      badgeColor: 'yellow',
      title: '💝 Bringing Hope to Street Children',
      description:
        "Every child deserves love, safety, and opportunity. We've made it our mission to reach out to street children, offering them not just material support but emotional care and guidance. Through outreach programs, we provide meals, education resources, and pathways to a brighter future.",
      keyPoints: [
        'Daily meal programs for 100+ street children',
        'Education and skills training opportunities',
        'Partnered with local shelters and organizations',
        'Created safe spaces for children to thrive',
      ],
      image: '/project-street.jpg',
      imagePosition: 'left',
    },
    {
      id: 5,
      badge: 'Milestone',
      badgeColor: 'yellow',
      title: 'A birthday to remember — shared with little hearts full of dreams! 💝',
      description:
        "Birthdays are special, but they're even more meaningful when shared with those who need it most. We celebrated a birthday with children in our community, bringing cake, games, and gifts. It wasn't just about the celebration – it was about showing these kids that they are valued, loved, and have a community that cares about their happiness.",
      keyPoints: [
        'Celebrated with 80+ children and their families',
        'Distributed gifts, cakes, and treats',
        'Organized games and entertainment',
        'Created memories that will last a lifetime',
      ],
      image: '/project-birthday.jpg',
      imagePosition: 'right',
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-purple-900 mb-4">Featured Projects</h2>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
            Explore the work that drives us forward and see the impact we're creating
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-20">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                project.imagePosition === 'left' ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={project.imagePosition === 'left' ? 'md:order-2' : 'md:order-1'}>
                <div className="mb-4">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      project.badgeColor === 'yellow'
                        ? 'bg-yellow-400 text-purple-900'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {project.badge}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-purple-900 mb-4">{project.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{project.description}</p>

                <div className="space-y-3">
                  <p className="font-bold text-purple-900">Key Impacts:</p>
                  <ul className="space-y-2">
                    {project.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={project.imagePosition === 'left' ? 'md:order-1' : 'md:order-2'}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
