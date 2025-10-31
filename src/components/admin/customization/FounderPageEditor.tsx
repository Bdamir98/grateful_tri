'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '../RichTextEditor'
import { ImageUpload } from '../ImageUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, Plus, Trash2 } from 'lucide-react'

export function FounderPageEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState({
    hero: {
      title: 'Our Founder',
      subtitle: 'Meet the visionary behind The Grateful Tribe',
      founderName: 'Sal Khan',
      founderTitle: 'Founder & CEO',
      founderImage: '',
      founderBio: '<p>Passionate about creating positive change and building communities that make a difference in the world...</p>'
    },
    story: {
      title: 'A Journey of Purpose',
      content: '<p>Sal K. was living a dream of globalization, vitality, and discovering communities for making a difference in the world.</p><p>What he experienced wasn\'t meant to be a <strong>career</strong> but aspiration to make a mark in the life experiences of communities in all walks of life. This journey started with an education in the Philippines but took on epic levels of meaning.</p>',
      quote: {
        text: "Success isn't measured by what we accomplish, but by what we give back and the lives we touch along the way",
        author: 'Sal Khan'
      },
      additionalContent: '<p>Through walks of life shared in diverse cultures and communities, Sal was finding opportunities not only to learn from different families and their communities in underprivileged communities, but being able to contribute and share a sense of gratitude with them.</p><p>But it wasn\'t his vision or his power that made change — it was a team of grateful contributors who knew Sal and his ambitions and trusted his leadership.</p>'
    },
    impact: {
      title: 'Global Impact & Achievement',
      subtitle: 'Results that speak volumes on what we can contribute to the world',
      stats: [
        { icon: 'globe', value: '36+', label: 'countries reached', color: 'purple' },
        { icon: 'users', value: '1000+', label: 'lives changed', color: 'yellow' },
        { icon: 'award', value: '15+', label: 'Years experience', color: 'purple' }
      ]
    },
    tribe: {
      title: 'The Grateful Tribe',
      content: '<p>More than an organization, <strong>it\'s a community dedicated to</strong> making everyone realize that we can do more and be more to help others. We believe in the power of gratitude and collective growth.</p><p>Sal\'s philosophy on life is that we can contribute energetically and fully for the common good when people are united globally. That contribution is precisely the type of energy that creates sustainable change worldwide.</p><p>The Grateful Tribe was born from the idea that we are responsible in creating a peaceful place. This might sound intimidating, but with your <strong>skills and actions around the world</strong>, we can build a meaningful future together.</p>',
      images: [
        { src: '/gallery-1.jpg', alt: 'Impact' },
        { src: '/gallery-2.jpg', alt: 'Community' },
        { src: '/gallery-3.jpg', alt: 'Children' },
        { src: '/gallery-4.jpg', alt: 'Together' }
      ]
    },
    callToAction: {
      title: "Join Sal's Vision",
      content: '<p>Share in this remarkable journey of empowerment and purpose. Together, we\'re not just <strong>making an impact for the community as a tribe.</strong> Join The Grateful Tribe and help turn visions into reality.</p>',
      buttonText: 'Join Our Tribe'
    },
    values: [
      { title: 'Integrity', description: 'We believe in honest and transparent practices' },
      { title: 'Impact', description: 'Every action we take creates meaningful change' },
      { title: 'Innovation', description: 'We embrace new ideas and technologies' }
    ],
    achievements: [
      { year: '2020', title: 'Founded The Grateful Tribe', description: 'Started the movement' },
      { year: '2021', title: 'Reached 10,000 members', description: 'Growing community' },
      { year: '2022', title: 'Impact milestone', description: 'Changed 1,000 lives' }
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
        .eq('page_key', 'founder')
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
          page_key: 'founder',
          section_key: 'all',
          content,
          is_active: true
        }, {
          onConflict: 'page_key,section_key'
        })

      if (error) throw error
      alert('Founder page updated successfully!')
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

  const updateStory = (field: string, value: any) => {
    setContent({
      ...content,
      story: { ...content.story, [field]: value }
    })
  }

  const addValue = () => {
    setContent({
      ...content,
      values: [...content.values, { title: 'New Value', description: '' }]
    })
  }

  const updateValue = (index: number, field: string, value: string) => {
    const newValues = [...content.values]
    newValues[index] = { ...newValues[index], [field]: value }
    setContent({ ...content, values: newValues })
  }

  const deleteValue = (index: number) => {
    setContent({
      ...content,
      values: content.values.filter((_, i) => i !== index)
    })
  }

  const addAchievement = () => {
    setContent({
      ...content,
      achievements: [...content.achievements, { year: '2024', title: '', description: '' }]
    })
  }

  const updateAchievement = (index: number, field: string, value: string) => {
    const newAchievements = [...content.achievements]
    newAchievements[index] = { ...newAchievements[index], [field]: value }
    setContent({ ...content, achievements: newAchievements })
  }

  const deleteAchievement = (index: number) => {
    setContent({
      ...content,
      achievements: content.achievements.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Save Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Founder Page Editor</h2>
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
            <Input
              value={content.hero.title}
              onChange={(e) => updateHero('title', e.target.value)}
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => updateHero('subtitle', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Founder Name</Label>
              <Input
                value={content.hero.founderName}
                onChange={(e) => updateHero('founderName', e.target.value)}
              />
            </div>

            <div>
              <Label>Founder Title</Label>
              <Input
                value={content.hero.founderTitle}
                onChange={(e) => updateHero('founderTitle', e.target.value)}
              />
            </div>
          </div>

          <ImageUpload
            label="Founder Photo"
            currentImage={content.hero.founderImage}
            onUpload={(url) => updateHero('founderImage', url)}
            storagePath="founder"
            helpText="Upload founder's profile photo (square recommended)"
          />

          <div>
            <Label>Founder Bio</Label>
            <RichTextEditor
              content={content.hero.founderBio}
              onChange={(html) => updateHero('founderBio', html)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Story Section */}
      <Card>
        <CardHeader>
          <CardTitle>The Story Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Story Title</Label>
            <Input
              value={content.story.title}
              onChange={(e) => updateStory('title', e.target.value)}
            />
          </div>

          <div>
            <Label>Story Content</Label>
            <RichTextEditor
              content={content.story.content}
              onChange={(html) => updateStory('content', html)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Core Values</CardTitle>
            <Button onClick={addValue} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Value
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.values.map((value, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label>Value Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteValue(index)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Tribe Section */}
      <Card>
        <CardHeader>
          <CardTitle>The Tribe Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tribe Title</Label>
            <Input
              value={content.tribe.title}
              onChange={(e) => setContent({
                ...content,
                tribe: { ...content.tribe, title: e.target.value }
              })}
            />
          </div>

          <div>
            <Label>Tribe Content</Label>
            <RichTextEditor
              content={content.tribe.content}
              onChange={(html) => setContent({
                ...content,
                tribe: { ...content.tribe, content: html }
              })}
            />
          </div>

          <div>
            <Label>Gallery Images</Label>
            <div className="grid grid-cols-2 gap-4">
              {content.tribe.images.map((image, index) => (
                <div key={index} className="space-y-2">
                  <ImageUpload
                    label={`Image ${index + 1}`}
                    currentImage={image.src}
                    onUpload={(url) => {
                      const newImages = [...content.tribe.images]
                      newImages[index] = { ...newImages[index], src: url }
                      setContent({
                        ...content,
                        tribe: { ...content.tribe, images: newImages }
                      })
                    }}
                    storagePath="tribe"
                    helpText={`Upload tribe image ${index + 1}`}
                  />
                  <Input
                    placeholder="Image alt text"
                    value={image.alt}
                    onChange={(e) => {
                      const newImages = [...content.tribe.images]
                      newImages[index] = { ...newImages[index], alt: e.target.value }
                      setContent({
                        ...content,
                        tribe: { ...content.tribe, images: newImages }
                      })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Timeline */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Achievements Timeline</CardTitle>
            <Button onClick={addAchievement} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.achievements.map((achievement, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Year</Label>
                        <Input
                          value={achievement.year}
                          onChange={(e) => updateAchievement(index, 'year', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Achievement Title</Label>
                        <Input
                          value={achievement.title}
                          onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={achievement.description}
                        onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAchievement(index)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
