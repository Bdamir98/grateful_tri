'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '../RichTextEditor'
import { ImageUpload } from '../ImageUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, Plus, Trash2, Check } from 'lucide-react'

export function PartnerPageEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState({
    hero: {
      title: 'Partner with Us',
      subtitle: 'Join our mission to create positive change worldwide',
      description: '<p>Together we can make a difference...</p>',
      heroImage: ''
    },
    benefits: [
      { icon: '🤝', title: 'Community Support', description: 'Access to global network' },
      { icon: '💰', title: 'Revenue Sharing', description: '50/50 profit split model' },
      { icon: '📈', title: 'Growth Opportunities', description: 'Scale your impact' }
    ],
    tiers: [
      {
        name: 'Bronze Partner',
        price: '$99',
        period: 'month',
        features: [
          'Community access',
          'Basic training',
          'Email support'
        ],
        highlighted: false
      },
      {
        name: 'Silver Partner',
        price: '$199',
        period: 'month',
        features: [
          'All Bronze features',
          'Advanced training',
          'Priority support',
          '1-on-1 mentorship'
        ],
        highlighted: true
      },
      {
        name: 'Gold Partner',
        price: '$499',
        period: 'month',
        features: [
          'All Silver features',
          'Exclusive events',
          '24/7 support',
          'Co-marketing opportunities'
        ],
        highlighted: false
      }
    ],
    cta: {
      title: 'Ready to Partner?',
      description: 'Get started today and make a difference',
      buttonText: 'Apply Now',
      buttonLink: '/apply'
    }
  })

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'partner')
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
          page_key: 'partner',
          section_key: 'all',
          content,
          is_active: true
        }, {
          onConflict: 'page_key,section_key'
        })

      if (error) throw error
      alert('Partner page updated successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: string, value: any) => {
    setContent({ ...content, hero: { ...content.hero, [field]: value } })
  }

  const addBenefit = () => {
    setContent({
      ...content,
      benefits: [...content.benefits, { icon: '✨', title: 'New Benefit', description: '' }]
    })
  }

  const updateBenefit = (index: number, field: string, value: string) => {
    const newBenefits = [...content.benefits]
    newBenefits[index] = { ...newBenefits[index], [field]: value }
    setContent({ ...content, benefits: newBenefits })
  }

  const deleteBenefit = (index: number) => {
    setContent({ ...content, benefits: content.benefits.filter((_, i) => i !== index) })
  }

  const addTier = () => {
    setContent({
      ...content,
      tiers: [...content.tiers, {
        name: 'New Tier',
        price: '$0',
        period: 'month',
        features: [],
        highlighted: false
      }]
    })
  }

  const updateTier = (index: number, field: string, value: any) => {
    const newTiers = [...content.tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setContent({ ...content, tiers: newTiers })
  }

  const deleteTier = (index: number) => {
    setContent({ ...content, tiers: content.tiers.filter((_, i) => i !== index) })
  }

  const addFeatureToTier = (tierIndex: number) => {
    const newTiers = [...content.tiers]
    newTiers[tierIndex].features.push('New feature')
    setContent({ ...content, tiers: newTiers })
  }

  const updateTierFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const newTiers = [...content.tiers]
    newTiers[tierIndex].features[featureIndex] = value
    setContent({ ...content, tiers: newTiers })
  }

  const deleteTierFeature = (tierIndex: number, featureIndex: number) => {
    const newTiers = [...content.tiers]
    newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, i) => i !== featureIndex)
    setContent({ ...content, tiers: newTiers })
  }

  const updateCTA = (field: string, value: string) => {
    setContent({ ...content, cta: { ...content.cta, [field]: value } })
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Save Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Partner Page Editor</h2>
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

          <div>
            <Label>Description</Label>
            <RichTextEditor content={content.hero.description} onChange={(html) => updateHero('description', html)} />
          </div>

          <ImageUpload
            label="Hero Image"
            currentImage={content.hero.heroImage}
            onUpload={(url) => updateHero('heroImage', url)}
            storagePath="partner"
            helpText="Upload hero banner image"
          />
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Partnership Benefits</CardTitle>
            <Button onClick={addBenefit} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Benefit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.benefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Icon (Emoji)</Label>
                        <Input value={benefit.icon} onChange={(e) => updateBenefit(index, 'icon', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <Label>Benefit Title</Label>
                        <Input value={benefit.title} onChange={(e) => updateBenefit(index, 'title', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={benefit.description} onChange={(e) => updateBenefit(index, 'description', e.target.value)} />
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteBenefit(index)} className="ml-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Partnership Tiers / Pricing</CardTitle>
            <Button onClick={addTier} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Tier
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.tiers.map((tier, tierIndex) => (
            <Card key={tierIndex} className={tier.highlighted ? 'border-purple-500 border-2' : ''}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-2">
                        <Label>Tier Name</Label>
                        <Input value={tier.name} onChange={(e) => updateTier(tierIndex, 'name', e.target.value)} />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input value={tier.price} onChange={(e) => updateTier(tierIndex, 'price', e.target.value)} />
                      </div>
                      <div>
                        <Label>Period</Label>
                        <Input value={tier.period} onChange={(e) => updateTier(tierIndex, 'period', e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={tier.highlighted}
                          onChange={(e) => updateTier(tierIndex, 'highlighted', e.target.checked)}
                          className="rounded"
                        />
                        <Label>Highlight this tier (Recommended)</Label>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Features</Label>
                        <Button onClick={() => addFeatureToTier(tierIndex)} size="sm" variant="outline">
                          <Plus className="mr-1 h-3 w-3" />
                          Add Feature
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {tier.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => updateTierFeature(tierIndex, featureIndex, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTierFeature(tierIndex, featureIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteTier(tierIndex)} className="ml-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>CTA Title</Label>
            <Input value={content.cta.title} onChange={(e) => updateCTA('title', e.target.value)} />
          </div>

          <div>
            <Label>CTA Description</Label>
            <Textarea value={content.cta.description} onChange={(e) => updateCTA('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Button Text</Label>
              <Input value={content.cta.buttonText} onChange={(e) => updateCTA('buttonText', e.target.value)} />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input value={content.cta.buttonLink} onChange={(e) => updateCTA('buttonLink', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
