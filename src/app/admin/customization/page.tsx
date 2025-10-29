'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColorPicker } from '@/components/admin/ColorPicker'
import { ConfigService } from '@/services/config.service'
import { useTheme } from '@/contexts/ThemeContext'

export default function CustomizationPage() {
  const { refreshTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [config, setConfig] = useState({
    site_name: '',
    primary_color: '#000000',
    secondary_color: '#000000',
    accent_color: '#000000',
    hero_video: '',
    impact_goal: 0,
  })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const settings = await ConfigService.getSiteSettings()
    if (settings) {
      setConfig({
        site_name: settings.siteName,
        primary_color: settings.primaryColor,
        secondary_color: settings.secondaryColor,
        accent_color: settings.accentColor,
        hero_video: settings.heroVideo,
        impact_goal: settings.impactGoal,
      })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    const success = await ConfigService.updateSiteSettings({
      siteName: config.site_name,
      primaryColor: config.primary_color,
      secondaryColor: config.secondary_color,
      accentColor: config.accent_color,
      heroVideo: config.hero_video,
      impactGoal: config.impact_goal,
    })

    if (success) {
      setMessage('Settings saved successfully!')
      await refreshTheme()
    } else {
      setMessage('Failed to save settings')
    }

    setLoading(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Website Customization</h1>
        <p className="text-gray-600">Customize your website appearance and settings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
            <CardDescription>Customize your website color scheme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColorPicker
              label="Primary Color"
              value={config.primary_color}
              onChange={(value) => setConfig({ ...config, primary_color: value })}
            />
            <ColorPicker
              label="Secondary Color"
              value={config.secondary_color}
              onChange={(value) => setConfig({ ...config, secondary_color: value })}
            />
            <ColorPicker
              label="Accent Color"
              value={config.accent_color}
              onChange={(value) => setConfig({ ...config, accent_color: value })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure general website settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={config.site_name}
                onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                placeholder="The Grateful Tribe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroVideo">Hero Video URL</Label>
              <Input
                id="heroVideo"
                value={config.hero_video}
                onChange={(e) => setConfig({ ...config, hero_video: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impactGoal">Impact Goal (Number)</Label>
              <Input
                id="impactGoal"
                type="number"
                value={config.impact_goal}
                onChange={(e) => setConfig({ ...config, impact_goal: parseInt(e.target.value) })}
                placeholder="10000"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}
        <Button onClick={handleSave} disabled={loading} size="lg">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
