'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { Save, RefreshCw } from 'lucide-react'

export function ThemeCustomizer() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState({
    colors: {
      primary: '#7c3aed',
      secondary: '#fbbf24',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    }
  })

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const { data } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('theme_key', 'default')
        .single()

      if (data) {
        setTheme({
          colors: data.colors,
          fonts: data.fonts
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveTheme = async () => {
    setSaving(true)
    try {
      await supabase
        .from('theme_settings')
        .upsert({
          theme_key: 'default',
          colors: theme.colors,
          fonts: theme.fonts,
          is_active: true
        })
      alert('Theme updated successfully!')
      window.location.reload()
    } catch (error) {
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const updateColor = (key: string, value: string) => {
    setTheme({
      ...theme,
      colors: { ...theme.colors, [key]: value }
    })
  }

  const updateFont = (key: string, value: string) => {
    setTheme({
      ...theme,
      fonts: { ...theme.fonts, [key]: value }
    })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(theme.colors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="h-10 w-20 cursor-pointer rounded border"
                />
                <Input
                  value={value}
                  onChange={(e) => updateColor(key, e.target.value)}
                  placeholder="#000000"
                />
              </div>
              <div 
                className="h-12 rounded border"
                style={{ backgroundColor: value }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fonts */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Heading Font</Label>
            <select
              value={theme.fonts.heading}
              onChange={(e) => updateFont('heading', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Open Sans">Open Sans</option>
            </select>
            <p style={{ fontFamily: theme.fonts.heading }} className="text-2xl font-bold">
              Heading Preview
            </p>
          </div>

          <div className="space-y-2">
            <Label>Body Font</Label>
            <select
              value={theme.fonts.body}
              onChange={(e) => updateFont('body', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Open Sans">Open Sans</option>
            </select>
            <p style={{ fontFamily: theme.fonts.body }}>
              Body text preview - The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3 justify-end">
        <Button onClick={loadTheme} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={saveTheme} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Theme'}
        </Button>
      </div>
    </div>
  )
}
