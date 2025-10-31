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
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [showModal, setShowModal] = useState(false)

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative max-w-8xl mx-auto"
            >
              {/* Creative Hexagonal Mosaic Layout */}
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
                  <div className="absolute bottom-32 right-32 w-40 h-40 bg-yellow-400 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-400 rounded-full blur-3xl" />
                </div>

                {/* Main Grid Container */}
                <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 p-4">
                  {filteredImages.map((image, index) => {
                    // Create varied sizes for organic feel
                    const sizes = [
                      'col-span-1 row-span-1', // Small square
                      'col-span-1 row-span-2', // Tall rectangle
                      'col-span-2 row-span-1', // Wide rectangle
                      'col-span-2 row-span-2', // Large square
                      'col-span-1 row-span-1', // Small square
                      'col-span-2 row-span-1', // Wide rectangle
                    ]
                    const sizeClass = sizes[index % sizes.length]

                    return (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          delay: index * 0.12,
                          duration: 0.6,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                        className={`${sizeClass} group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer`}
                        style={{
                          background: 'linear-gradient(135deg, rgba(147,51,234,0.1), rgba(234,179,8,0.1))',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                        onClick={() => {
                          setSelectedImage(image)
                          setShowModal(true)
                        }}
                      >
                        {/* Image Container with Creative Effects */}
                        <div className="relative w-full h-full overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-1"
                          />

                          {/* Animated Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-pink-500/60 to-yellow-400/80 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="text-3xl md:text-4xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                  {image.type === 'video' ? '▶️' : '📷'}
                                </div>
                                <div className="text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                  {image.type === 'video' ? 'Watch Video' : 'View Photo'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Floating Elements */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                            <div className="flex gap-2">
                              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <span className="text-white text-sm">❤️</span>
                              </div>
                              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-125 transition-transform duration-300 delay-100">
                                <span className="text-white text-sm">⭐</span>
                              </div>
                            </div>
                          </div>

                          {/* Type Badge */}
                          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400">
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                              {image.type === 'video' ? '🎬 Video' : '📸 Photo'}
                            </div>
                          </div>

                          {/* Decorative Border Animation */}
                          <div className="absolute inset-0 border-2 border-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100" />
                          <div className="absolute inset-1 border border-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 scale-95 group-hover:scale-100" />
                        </div>

                        {/* Hover Shadow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl -z-10" />
                      </motion.div>
                    )
                  })}
                </div>

                {/* Floating Navigation Dots */}
                <div className="flex justify-center mt-8 space-x-3">
                  {Array.from({ length: Math.ceil(filteredImages.length / 6) }).map((_, pageIndex) => (
                    <motion.button
                      key={pageIndex}
                      className="w-3 h-3 rounded-full bg-purple-300 hover:bg-purple-500 transition-colors duration-300"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
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

      {/* Full Screen Image Modal */}
      {showModal && selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors duration-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{selectedImage.alt}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        {selectedImage.type === 'video' ? '🎬 Video' : '📸 Photo'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                      <span className="text-2xl">❤️</span>
                    </button>
                    <button className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                      <span className="text-2xl">📤</span>
                    </button>
                    <button className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                      <span className="text-2xl">⭐</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
                    setSelectedImage(filteredImages[prevIndex])
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
                    const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
                    setSelectedImage(filteredImages[nextIndex])
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            {filteredImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
