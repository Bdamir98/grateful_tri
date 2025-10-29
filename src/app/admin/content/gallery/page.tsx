'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2 } from 'lucide-react'

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })

    setImages(data || [])
  }

  const handleAdd = async () => {
    if (!newImageUrl) return

    await supabase.from('gallery_images').insert([{ image_url: newImageUrl }])

    setNewImageUrl('')
    loadImages()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return

    await supabase.from('gallery_images').delete().eq('id', id)
    loadImages()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gallery</h1>
        <p className="text-gray-600">Manage gallery images</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="pt-6">
              <img
                src={image.image_url}
                alt="Gallery"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
