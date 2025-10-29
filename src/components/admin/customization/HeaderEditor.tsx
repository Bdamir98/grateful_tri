'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { Save, Image as ImageIcon } from 'lucide-react'

export function HeaderEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [settings, setSettings] = useState({
    logo: '/TGT-LOGO-removebg.png',
    siteName: 'The Grateful Tribe',
    tagline: 'Empowering Communities'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'header')
        .maybeSingle()

      if (error) {
        console.error('Database error:', error)
      }

      if (data?.setting_value) {
        setSettings({
          logo: data.setting_value.logo || settings.logo,
          siteName: data.setting_value.siteName || settings.siteName,
          tagline: data.setting_value.tagline || settings.tagline
        })
      }
    } catch (error) {
      console.error('Error loading header settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      console.log('Saving header settings...', settings)
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'header',
          setting_value: settings
        }, {
          onConflict: 'setting_key'
        })

      if (error) throw error
      
      // Clear frontend cache so changes reflect immediately
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tgt_header_settings')
        localStorage.removeItem('tgt_header_timestamp')
      }
      
      alert('Header settings saved successfully!')
      
      // Reload page to apply changes
      window.location.reload()
    } catch (error: any) {
      console.error('Error saving:', error)
      alert(`Failed to save header settings: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value })
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-white border-b pb-4 mb-4 flex justify-between items-center shadow-sm p-4 -m-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Header & Logo Settings</h2>
          <p className="text-gray-600">Customize your website header and logo</p>
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

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Website Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Logo</Label>
            {settings.logo && (
              <div className="mt-2 p-4 border rounded-lg bg-gray-50 flex items-center justify-center">
                <img 
                  src={settings.logo} 
                  alt="Logo preview" 
                  className="h-16 object-contain"
                />
              </div>
            )}
          </div>
          
          <div>
            <Label>Upload New Logo</Label>
            <p className="text-sm text-gray-500 mb-2">
              Recommended: PNG with transparent background, 200x60px
            </p>
            <ImageUpload
              label="Choose logo image"
              currentImage={settings.logo}
              onUpload={(url: string) => updateSetting('logo', url)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Site Name */}
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Site Name</Label>
            <Input
              value={settings.siteName}
              onChange={(e) => updateSetting('siteName', e.target.value)}
              placeholder="The Grateful Tribe"
            />
            <p className="text-sm text-gray-500 mt-1">
              Displayed in the header and throughout the site
            </p>
          </div>

          <div>
            <Label>Tagline (Optional)</Label>
            <Input
              value={settings.tagline}
              onChange={(e) => updateSetting('tagline', e.target.value)}
              placeholder="Empowering Communities"
            />
            <p className="text-sm text-gray-500 mt-1">
              Short description shown below site name (if applicable)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <img 
                src={settings.logo} 
                alt="Logo preview" 
                className="h-12 object-contain"
              />
              <div>
                <div className="font-bold text-lg">{settings.siteName}</div>
                {settings.tagline && (
                  <div className="text-sm text-gray-600">{settings.tagline}</div>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This is how your header will look. Save and refresh to see changes on the actual site.
          </p>
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
