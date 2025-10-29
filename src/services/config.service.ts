import { supabase } from '@/lib/supabase/client'

export class ConfigService {
  // NEW SYSTEM - Site Settings
  static async getSiteSetting(key: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', key)
        .single()

      if (error) throw error
      return data?.setting_value
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error)
      return null
    }
  }

  static async getAllSettings(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')

      if (error) throw error
      
      // Convert array to object
      const settings: Record<string, any> = {}
      data?.forEach((item: any) => {
        settings[item.setting_key] = item.setting_value
      })
      return settings
    } catch (error) {
      console.error('Error fetching all settings:', error)
      return {}
    }
  }

  static async updateSiteSetting(key: string, value: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        }, {
          onConflict: 'setting_key'
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error)
      return false
    }
  }

  // Theme Settings
  static async getThemeColors(): Promise<{
    primary: string
    secondary: string
    accent: string
    accentLight: string
    background: string
    text: string
  }> {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('colors')
        .eq('theme_key', 'default')
        .eq('is_active', true)
        .single()

      if (error) throw error
      const colors = data?.colors || {}
      return {
        primary: colors.primary || '#6B2C91',
        secondary: colors.secondary || '#8B3CB1',
        accent: colors.accent || '#E8C547',
        accentLight: colors.accentLight || colors.accent_light || '#F5D76E',
        background: colors.background || '#FFFFFF',
        text: colors.text || '#1F2937'
      }
    } catch (error) {
      console.error('Error fetching theme colors:', error)
      return {
        primary: '#6B2C91',
        secondary: '#8B3CB1',
        accent: '#E8C547',
        accentLight: '#F5D76E',
        background: '#FFFFFF',
        text: '#1F2937'
      }
    }
  }

  static async updateConfig(key: string, value: any): Promise<boolean> {
    return await this.updateSiteSetting(key, value)
  }

  static async updateSiteSettings(settings: {
    siteName?: string
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
    heroVideo?: string
    impactGoal?: number
  }): Promise<boolean> {
    try {
      const updates: Array<Promise<boolean>> = []

      if (settings.siteName !== undefined) {
        updates.push(this.updateSiteSetting('site_name', settings.siteName))
      }
      if (settings.primaryColor !== undefined) {
        updates.push(this.updateSiteSetting('primary_color', settings.primaryColor))
      }
      if (settings.secondaryColor !== undefined) {
        updates.push(this.updateSiteSetting('secondary_color', settings.secondaryColor))
      }
      if (settings.accentColor !== undefined) {
        updates.push(this.updateSiteSetting('accent_color', settings.accentColor))
      }
      if (settings.heroVideo !== undefined) {
        updates.push(this.updateSiteSetting('hero_video', settings.heroVideo))
      }
      if (settings.impactGoal !== undefined) {
        updates.push(this.updateSiteSetting('impact_goal', settings.impactGoal))
      }

      const results = await Promise.all(updates)
      return results.every(result => result === true)
    } catch (error) {
      console.error('Error updating site settings:', error)
      return false
    }
  }

  static async getSiteSettings(): Promise<Record<string, any>> {
    try {
      const settings = await this.getAllSettings()
      const themeColors = await this.getThemeColors()
      return {
        siteName: settings.site_name || 'The Grateful Tribe',
        tagline: settings.site_tagline || 'Empowering Communities Worldwide',
        logo: settings.site_logo || '/TGT-LOGO-removebg.png',
        heroVideo: settings.hero_video || '/website-intro.mp4',
        impactGoal: settings.impact_goal || 10000,
        contactEmail: settings.contact_email || 'contact@gratefultribe.org',
        primaryColor: settings.primary_color || themeColors.primary,
        secondaryColor: settings.secondary_color || themeColors.secondary,
        accentColor: settings.accent_color || themeColors.accent
      }
    } catch (error) {
      console.error('Error fetching site settings:', error)
      return {
        siteName: 'The Grateful Tribe',
        tagline: 'Empowering Communities Worldwide',
        logo: '/TGT-LOGO-removebg.png',
        heroVideo: '/website-intro.mp4',
        impactGoal: 10000,
        contactEmail: 'contact@gratefultribe.org',
        primaryColor: '#6B2C91',
        secondaryColor: '#8B3CB1',
        accentColor: '#E8C547'
      }
    }
  }

  static async getSocialLinks(): Promise<Record<string, string>> {
    const social = await this.getSiteSetting('social_links')
    return social || {}
  }

  static async getNavigation(): Promise<{ items: Array<{ id: string; label: string; href: string }> }> {
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('menu_key', 'main')
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error

      const items = data?.map((item: any) => ({
        id: item.id,
        label: item.label,
        href: item.url
      })) || []

      return { items: items.length > 0 ? items : [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'who-we-are', label: 'Our Tribe', href: '/about' },
        { id: 'founder', label: 'Our Founder', href: '/founder' },
        { id: 'projects', label: 'Partner with Us', href: '/projects' },
        { id: 'courses', label: 'Courses', href: '/courses' },
        { id: 'gallery', label: 'Gallery', href: '/gallery' },
        { id: 'testimonials', label: 'Testimonials', href: '/testimonials' },
      ]}
    } catch (error) {
      console.error('Error fetching navigation:', error)
      return {
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'who-we-are', label: 'Our Tribe', href: '/about' },
          { id: 'founder', label: 'Our Founder', href: '/founder' },
          { id: 'projects', label: 'Partner with Us', href: '/projects' },
          { id: 'courses', label: 'Courses', href: '/courses' },
          { id: 'gallery', label: 'Gallery', href: '/gallery' },
          { id: 'testimonials', label: 'Testimonials', href: '/testimonials' },
        ]
      }
    }
  }
}
