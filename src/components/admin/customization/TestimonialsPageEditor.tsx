'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '../ImageUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, Plus, Trash2, Star } from 'lucide-react'

export function TestimonialsPageEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState({
    hero: {
      title: 'What People Say',
      subtitle: 'Hear from our community members'
    },
    testimonials: [
      {
        name: 'John Doe',
        title: 'Community Member',
        avatar: '',
        testimonial: 'This community changed my life! The support and opportunities are incredible.',
        rating: 5,
        featured: true
      },
      {
        name: 'Jane Smith',
        title: 'Partner',
        avatar: '',
        testimonial: 'Best decision I ever made. The training and resources are top-notch.',
        rating: 5,
        featured: false
      }
    ]
  })

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'testimonials')
        .eq('section_key', 'all')
        .maybeSingle()

      if (error) {
        console.error('Database error:', error)
      }

      if (data?.content) {
        setContent({ ...content, ...data.content })
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_key: 'testimonials',
          section_key: 'all',
          content,
          is_active: true
        }, {
          onConflict: 'page_key,section_key'
        })

      if (error) throw error
      alert('Testimonials page updated successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: string, value: string) => {
    setContent({ ...content, hero: { ...content.hero, [field]: value } })
  }

  const addTestimonial = () => {
    setContent({
      ...content,
      testimonials: [...content.testimonials, {
        name: 'New Person',
        title: 'Role/Title',
        avatar: '',
        testimonial: 'Write testimonial here...',
        rating: 5,
        featured: false
      }]
    })
  }

  const updateTestimonial = (index: number, field: string, value: any) => {
    const newTestimonials = [...content.testimonials]
    newTestimonials[index] = { ...newTestimonials[index], [field]: value }
    setContent({ ...content, testimonials: newTestimonials })
  }

  const deleteTestimonial = (index: number) => {
    setContent({ ...content, testimonials: content.testimonials.filter((_, i) => i !== index) })
  }

  const renderStars = (rating: number, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate?.(star)}
            className={`${onRate ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`h-5 w-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Save Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials Page Editor</h2>
        <Button onClick={saveContent} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Page Title</Label>
            <Input value={content.hero.title} onChange={(e) => updateHero('title', e.target.value)} />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input value={content.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Testimonials</CardTitle>
            <Button onClick={addTestimonial} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.testimonials.map((testimonial, index) => (
            <Card key={index} className={testimonial.featured ? 'border-purple-500 border-2' : ''}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Title/Role</Label>
                        <Input
                          value={testimonial.title}
                          onChange={(e) => updateTestimonial(index, 'title', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Testimonial Text</Label>
                      <Textarea
                        value={testimonial.testimonial}
                        onChange={(e) => updateTestimonial(index, 'testimonial', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">Rating</Label>
                      {renderStars(testimonial.rating, (rating) => updateTestimonial(index, 'rating', rating))}
                    </div>

                    <ImageUpload
                      label="Avatar Photo"
                      currentImage={testimonial.avatar}
                      onUpload={(url) => updateTestimonial(index, 'avatar', url)}
                      storagePath="testimonials"
                      helpText="Upload person's photo (square recommended)"
                    />

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id={`featured-${index}`}
                        checked={testimonial.featured}
                        onChange={(e) => updateTestimonial(index, 'featured', e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor={`featured-${index}`} className="text-sm font-medium">
                        Feature this testimonial on homepage
                      </label>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTestimonial(index)}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {content.testimonials.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No testimonials yet. Click "Add Testimonial" to create one.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">Testimonials Tips</h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Use authentic, real testimonials from actual customers</li>
                  <li>Include full names and titles for credibility</li>
                  <li>Add profile photos to make testimonials more trustworthy</li>
                  <li>Feature your best testimonials on the homepage</li>
                  <li>Keep testimonials concise and focused on specific benefits</li>
                  <li>Regularly update with fresh testimonials</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
