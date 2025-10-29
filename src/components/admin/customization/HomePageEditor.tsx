'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '../ImageUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, Plus, Trash2 } from 'lucide-react'

export function HomePageEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState({
    hero: {
      badge: 'Empowering Communities Worldwide',
      title: 'Lives Waiting to Be Changed Through Your Digital Success',
      subtitle: 'Join a revolutionary movement combining digital education with real-world impact.',
      ctaText: 'Join the Projects',
      videoUrl: '',
      impactGoal: 10000
    },
    stats: [
      { value: '10K+', label: 'Community Members' },
      { value: '50+', label: 'Countries Reached' },
      { value: '100+', label: 'Success Stories' },
      { value: '95%', label: 'Success Rate' }
    ],
    features: [
      {
        title: 'Make an Impact',
        description: 'Every action you take helps children in need. Your success directly contributes to changing lives.'
      },
      {
        title: 'Earn While You Learn',
        description: 'Access cutting-edge training in crypto, AI, and digital skills. Create multiple income streams.'
      },
      {
        title: 'Global Community',
        description: 'Connect with like-minded individuals worldwide. Share knowledge, grow together, succeed together.'
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
        .eq('page_key', 'home')
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
          page_key: 'home',
          section_key: 'all',
          content
        }, {
          onConflict: 'page_key,section_key'
        })

      if (error) throw error
      alert('Home page updated successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: string, value: any) => {
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value }
    })
  }

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...content.stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setContent({ ...content, stats: newStats })
  }

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...content.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setContent({ ...content, features: newFeatures })
  }

  const addFeature = () => {
    setContent({
      ...content,
      features: [...content.features, { title: '', description: '' }]
    })
  }

  const removeFeature = (index: number) => {
    setContent({
      ...content,
      features: content.features.filter((_, i) => i !== index)
    })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input
              value={content.hero.badge}
              onChange={(e) => updateHero('badge', e.target.value)}
              placeholder="Empowering Communities Worldwide"
            />
          </div>

          <div className="space-y-2">
            <Label>Main Title</Label>
            <Textarea
              value={content.hero.title}
              onChange={(e) => updateHero('title', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={content.hero.subtitle}
              onChange={(e) => updateHero('subtitle', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Button Text</Label>
            <Input
              value={content.hero.ctaText}
              onChange={(e) => updateHero('ctaText', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Impact Goal (Number)</Label>
            <Input
              type="number"
              value={content.hero.impactGoal}
              onChange={(e) => updateHero('impactGoal', parseInt(e.target.value))}
            />
          </div>

          <ImageUpload
            label="Hero Background Video/Image"
            currentImage={content.hero.videoUrl}
            onUpload={(url) => updateHero('videoUrl', url)}
            storagePath="hero"
            acceptVideo={true}
            maxSizeMB={100}
            helpText="Upload background video or image for hero section (supports MP4, WebM, MOV up to 100MB)"
          />
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {content.stats.map((stat, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    placeholder="10K+"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    placeholder="Community Members"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Features Section</CardTitle>
          <Button size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.features.map((feature, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Feature {index + 1}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveContent} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
