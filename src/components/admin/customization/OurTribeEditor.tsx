'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '../ImageUpload'
import { RichTextEditor } from '../RichTextEditor'
import { supabase } from '@/lib/supabase/client'
import { Save, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react'

interface Section {
  id: string
  type: 'hero' | 'mission' | 'vision' | 'values' | 'team' | 'custom'
  title: string
  subtitle?: string
  content: string
  image?: string
  display_order: number
}

export function OurTribeEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [pageContent, setPageContent] = useState({
    heroTitle: 'Who We Are',
    heroSubtitle: "We're a community-driven organization dedicated to making a meaningful difference",
    heroImage: ''
  })

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'our_tribe')
        .eq('section_key', 'all')
        .maybeSingle()

      if (error) {
        console.error('Database error:', error)
      }

      if (data?.content) {
        setPageContent(data.content.hero || pageContent)
        setSections(data.content.sections || [])
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
      const content = {
        hero: pageContent,
        sections
      }

      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_key: 'our_tribe',
          section_key: 'all',
          content
        }, {
          onConflict: 'page_key,section_key'
        })

      if (error) throw error
      alert('Our Tribe page updated successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: `New ${type} Section`,
      content: '',
      display_order: sections.length
    }
    setSections([...sections, newSection])
  }

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSection = (id: string) => {
    if (!confirm('Delete this section?')) return
    setSections(sections.filter(s => s.id !== id))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= sections.length) return
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    newSections.forEach((s, i) => s.display_order = i)
    
    setSections(newSections)
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input
              value={pageContent.heroTitle}
              onChange={(e) => setPageContent({ ...pageContent, heroTitle: e.target.value })}
              placeholder="Who We Are"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={pageContent.heroSubtitle}
              onChange={(e) => setPageContent({ ...pageContent, heroSubtitle: e.target.value })}
              rows={3}
            />
          </div>

          <ImageUpload
            label="Hero Background Image"
            currentImage={pageContent.heroImage}
            onUpload={(url) => setPageContent({ ...pageContent, heroImage: url })}
            storagePath="our-tribe/hero"
          />
        </CardContent>
      </Card>

      {/* Dynamic Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Page Sections</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => addSection('mission')} variant="outline">
              + Mission
            </Button>
            <Button size="sm" onClick={() => addSection('vision')} variant="outline">
              + Vision
            </Button>
            <Button size="sm" onClick={() => addSection('values')} variant="outline">
              + Values
            </Button>
            <Button size="sm" onClick={() => addSection('custom')} variant="outline">
              + Custom
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sections yet. Click a button above to add a section.
            </div>
          ) : (
            sections.map((section, index) => (
              <Card key={section.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium uppercase">
                        {section.type}
                      </span>
                      <span className="text-sm text-gray-500">Section {index + 1}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === sections.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      placeholder="Section title"
                    />
                  </div>

                  {section.subtitle !== undefined && (
                    <div className="space-y-2">
                      <Label>Subtitle (Optional)</Label>
                      <Input
                        value={section.subtitle || ''}
                        onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                        placeholder="Section subtitle"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <RichTextEditor
                      content={section.content}
                      onChange={(html) => updateSection(section.id, { content: html })}
                      placeholder="Write your content here..."
                    />
                  </div>

                  <ImageUpload
                    label="Section Image (Optional)"
                    currentImage={section.image}
                    onUpload={(url) => updateSection(section.id, { image: url })}
                    storagePath={`our-tribe/${section.type}`}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Preview Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Section Order Matters</h4>
              <p className="text-sm text-blue-800">
                Sections will appear on your website in the order shown above. Use the ↑↓ buttons to reorder them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-4 bg-white p-4 border-t">
        <Button variant="outline" onClick={loadContent}>
          Reset Changes
        </Button>
        <Button onClick={saveContent} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}
