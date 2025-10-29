'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ConfigService } from '@/services/config.service'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  accentLight: string
  background: string
  text: string
}

interface ThemeContextType {
  colors: ThemeColors
  updateColors: (colors: Partial<ThemeColors>) => Promise<void>
  refreshTheme: () => Promise<void>
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>({
    primary: '#6B2C91',
    secondary: '#8B3CB1',
    accent: '#E8C547',
    accentLight: '#F5D76E',
    background: '#FFFFFF',
    text: '#1F2937'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const themeColors = await ConfigService.getThemeColors()
      setColors(themeColors)
      applyTheme(themeColors)
    } catch (error) {
      console.error('Error loading theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyTheme = (themeColors: ThemeColors) => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', themeColors.primary)
    root.style.setProperty('--color-secondary', themeColors.secondary)
    root.style.setProperty('--color-accent', themeColors.accent)
    root.style.setProperty('--color-accent-light', themeColors.accentLight)
    root.style.setProperty('--color-background', themeColors.background)
    root.style.setProperty('--color-text', themeColors.text)
  }

  const updateColors = async (newColors: Partial<ThemeColors>) => {
    const updated = { ...colors, ...newColors }
    setColors(updated)
    applyTheme(updated)
    await ConfigService.updateConfig('theme_colors', updated)
  }

  return (
    <ThemeContext.Provider value={{ colors, updateColors, refreshTheme: loadTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
