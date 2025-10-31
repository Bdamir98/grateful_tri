'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Plus, Trash2, Link as LinkIcon, Share2 } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

export function FooterEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [settings, setSettings] = useState({
    brandName: 'The Grateful Tribe',
    brandDescription: 'Empowering communities through digital opportunities and education.',
    copyrightText: 'All rights reserved.',
    logo: '',
    socialLinks: {
      facebook: '',
      youtube: '',
      telegram: '',
      email: ''
    },
    sections: [
      {
        title: 'Quick Links',
        links: [
          { label: 'About Us', href: '/#about' },
          { label: 'Courses', href: '/#courses' },
          { label: 'Projects', href: '/#projects' },
          { label: 'Gallery', href: '/#gallery' }
        ]
      },
      {
        title: 'Resources',
        links: [
          { label: 'All Courses', href: '/courses' },
          { label: 'My Dashboard', href: '/dashboard' },
          { label: 'Login', href: '/login' },
          { label: 'Sign Up', href: '/signup' }
        ]
      }
    ] as FooterSection[]
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'footer')
        .maybeSingle()

      if (error) {
        console.error('Database error:', error)
      }

      if (data?.setting_value) {
        setSettings({
          brandName: data.setting_value.brandName || settings.brandName,
          brandDescription: data.setting_value.brandDescription || settings.brandDescription,
          copyrightText: data.setting_value.copyrightText || settings.copyrightText,
          logo: data.setting_value.logo || settings.logo,
          socialLinks: data.setting_value.socialLinks || settings.socialLinks,
          sections: data.setting_value.sections || settings.sections
        })
      }
    } catch (error) {
      console.error('Error loading footer settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      console.log('Saving footer settings...', settings)
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'footer',
          setting_value: settings
        }, {
          onConflict: 'setting_key'
        })

      if (error) throw error
      
      alert('Footer settings saved successfully!')
      window.location.reload()
    } catch (error: any) {
      console.error('Error saving:', error)
      alert(`Failed to save footer settings: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const updateBrandInfo = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value })
  }

  const updateSocialLink = (platform: string, value: string) => {
    setSettings({
      ...settings,
      socialLinks: { ...settings.socialLinks, [platform]: value }
    })
  }

  const addSection = () => {
    setSettings({
      ...settings,
      sections: [
        ...settings.sections,
        {
          title: 'New Section',
          links: [{ label: 'Link 1', href: '#' }]
        }
      ]
    })
  }

  const deleteSection = (index: number) => {
    if (confirm('Delete this section?')) {
      setSettings({
        ...settings,
        sections: settings.sections.filter((_, i) => i !== index)
      })
    }
  }

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...settings.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setSettings({ ...settings, sections: newSections })
  }

  const addLink = (sectionIndex: number) => {
    const newSections = [...settings.sections]
    newSections[sectionIndex].links.push({ label: 'New Link', href: '#' })
    setSettings({ ...settings, sections: newSections })
  }

  const updateLink = (sectionIndex: number, linkIndex: number, field: string, value: string) => {
    const newSections = [...settings.sections]
    newSections[sectionIndex].links[linkIndex] = {
      ...newSections[sectionIndex].links[linkIndex],
      [field]: value
    }
    setSettings({ ...settings, sections: newSections })
  }

  const deleteLink = (sectionIndex: number, linkIndex: number) => {
    const newSections = [...settings.sections]
    newSections[sectionIndex].links = newSections[sectionIndex].links.filter((_, i) => i !== linkIndex)
    setSettings({ ...settings, sections: newSections })
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-white border-b pb-4 mb-4 flex justify-between items-center shadow-sm p-4 -m-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Footer Settings</h2>
          <p className="text-gray-600">Customize your website footer content and links</p>
        </div>
        <Button 
          onClick={saveSettings} 
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : '💾 Save Changes'}
        </Button>
      </div>

      {/* Brand Information */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Brand Name</Label>
            <Input
              value={settings.brandName}
              onChange={(e) => updateBrandInfo('brandName', e.target.value)}
              placeholder="The Grateful Tribe"
            />
          </div>

          <div>
            <Label>Footer Logo</Label>
            <ImageUpload
              label="Upload footer logo"
              currentImage={settings.logo}
              onUpload={(url: string) => updateBrandInfo('logo', url)}
              storagePath="branding"
            />
          </div>

          <div>
            <Label>Brand Description</Label>
            <Textarea
              value={settings.brandDescription}
              onChange={(e) => updateBrandInfo('brandDescription', e.target.value)}
              placeholder="Empowering communities through digital opportunities..."
              rows={3}
            />
          </div>

          <div>
            <Label>Copyright Text</Label>
            <Input
              value={settings.copyrightText}
              onChange={(e) => updateBrandInfo('copyrightText', e.target.value)}
              placeholder="All rights reserved."
            />
            <p className="text-sm text-gray-500 mt-1">
              Year and brand name are added automatically
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Social Media Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Facebook URL</Label>
            <Input
              value={settings.socialLinks.facebook}
              onChange={(e) => updateSocialLink('facebook', e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <Label>YouTube URL</Label>
            <Input
              value={settings.socialLinks.youtube}
              onChange={(e) => updateSocialLink('youtube', e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>

          <div>
            <Label>Telegram URL</Label>
            <Input
              value={settings.socialLinks.telegram}
              onChange={(e) => updateSocialLink('telegram', e.target.value)}
              placeholder="https://t.me/yourgroup"
            />
          </div>

          <div>
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={settings.socialLinks.email}
              onChange={(e) => updateSocialLink('email', e.target.value)}
              placeholder="contact@gratefultribe.org"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer Sections */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Footer Sections
            </CardTitle>
            <Button onClick={addSection} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings.sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Section {sectionIndex + 1}</CardTitle>
                <Button
                  onClick={() => deleteSection(sectionIndex)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Section Title */}
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                    placeholder="Quick Links"
                  />
                </div>

                {/* Links */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Links</Label>
                    <Button
                      onClick={() => addLink(sectionIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="grid grid-cols-2 gap-2">
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            updateLink(sectionIndex, linkIndex, 'label', e.target.value)
                          }
                          placeholder="Link Label"
                        />
                        <div className="flex gap-2">
                          <Input
                            value={link.href}
                            onChange={(e) =>
                              updateLink(sectionIndex, linkIndex, 'href', e.target.value)
                            }
                            placeholder="/page or #section"
                          />
                          <Button
                            onClick={() => deleteLink(sectionIndex, linkIndex)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {settings.sections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No sections yet. Click "Add Section" to create one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}
