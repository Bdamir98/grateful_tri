'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface GalleryImage {
  id: string
  src: string
  alt: string
  type: 'image' | 'video'
}

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGalleryImages()
  }, [])

  const loadGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('page_media')
        .select('*')
        .eq('page_key', 'library')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading gallery:', error)
        return
      }

      if (data) {
        const images: GalleryImage[] = data.map((item: any) => ({
          id: item.id,
          src: item.media_url,
          alt: item.file_name || 'Gallery image',
          type: (item.media_type === 'image' ? 'image' : 'video') as 'image' | 'video'
        }))
        setGalleryImages(images)
      }
    } catch (error) {
      console.error('Error loading gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = galleryImages.filter(image => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'photos') return image.type === 'image'
    if (activeFilter === 'videos') return image.type === 'video'
    return true
  })

  return (
    <>
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black text-purple-900 mb-4">Our Impact Gallery</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              See the faces, places, and moments that tell our story
            </p>
          </motion.div>

          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            <Button
              onClick={() => setActiveFilter('all')}
              className={`rounded-full px-6 py-2 font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
              }`}
            >
              All Projects
            </Button>
            <Button
              onClick={() => setActiveFilter('videos')}
              className={`rounded-full px-6 py-2 font-semibold transition-all ${
                activeFilter === 'videos'
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
              }`}
            >
              Videos
            </Button>
            <Button
              onClick={() => setActiveFilter('photos')}
              className={`rounded-full px-6 py-2 font-semibold transition-all ${
                activeFilter === 'photos'
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
              }`}
            >
              Photos
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">Loading gallery...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No images uploaded yet. Upload images from the admin panel!</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-7xl mx-auto">
              {filteredImages.map((image, index) => {
                // Create varied heights for masonry effect
                const heights = ['h-64', 'h-80', 'h-96', 'h-72']
                const heightClass = heights[index % heights.length]
                
                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`mb-4 break-inside-avoid ${heightClass}`}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">Follow Our Journey</h2>
            <p className="text-white/90 text-lg mb-8">
              Stay updated with our latest projects, impact stories and community events
            </p>

            <div className="flex justify-center gap-4 mb-8">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            <Button className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-bold px-8 py-6 text-lg rounded-full shadow-xl">
              Connect with Us
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
