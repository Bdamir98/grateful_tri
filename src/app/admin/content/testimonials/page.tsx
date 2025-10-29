'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2 } from 'lucide-react'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_role: '',
    content: '',
    avatar_url: '',
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    setTestimonials(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('testimonials').insert([formData])
    setFormData({ author_name: '', author_role: '', content: '', avatar_url: '' })
    setShowForm(false)
    loadTestimonials()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    loadTestimonials()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
          <p className="text-gray-600">Manage customer testimonials</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Testimonial</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Author Name</Label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Author Role</Label>
                <Input
                  value={formData.author_role}
                  onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <textarea
                  className="w-full min-h-[100px] p-2 border rounded"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Avatar URL (optional)</Label>
                <Input
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Add Testimonial</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                {testimonial.avatar_url && (
                  <img src={testimonial.avatar_url} alt={testimonial.author_name} className="w-12 h-12 rounded-full" />
                )}
                <div>
                  <CardTitle>{testimonial.author_name}</CardTitle>
                  <p className="text-sm text-gray-600">{testimonial.author_role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{testimonial.content}</p>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(testimonial.id)}>
                <Trash2 className="mr-2 h-3 w-3" />Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
