'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Default navigation items (fallback)
const DEFAULT_NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'who-we-are', label: 'Our Tribe', href: '/about' },
  { id: 'founder', label: 'Our Founder', href: '/founder' },
  { id: 'projects', label: 'Partner with Us', href: '/projects' },
  { id: 'courses', label: 'Courses', href: '/courses' },
  { id: 'gallery', label: 'Gallery', href: '/gallery' },
  { id: 'our-work', label: 'Our Work', href: '/our-work' },
]

// Cache keys
const CACHE_KEYS = {
  HEADER_SETTINGS: 'tgt_header_settings',
  CACHE_TIMESTAMP: 'tgt_header_timestamp',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
}

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [navItems, setNavItems] = useState<any[]>(DEFAULT_NAV_ITEMS)
  
  // Initialize with cached data if available, otherwise use defaults
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEYS.HEADER_SETTINGS)
      if (cached) {
        try {
          const { logo } = JSON.parse(cached)
          return logo || null
        } catch (e) {
          return null
        }
      }
    }
    return null
  })
  
  const [siteName, setSiteName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEYS.HEADER_SETTINGS)
      if (cached) {
        try {
          const { siteName } = JSON.parse(cached)
          return siteName || 'The Grateful Tribe'
        } catch (e) {
          return 'The Grateful Tribe'
        }
      }
    }
    return 'The Grateful Tribe'
  })

  useEffect(() => {
    // Load header settings in background (doesn't block render)
    loadHeaderSettings()
  }, [])

  const loadHeaderSettings = async () => {
    try {
      // Check if cache is fresh
      const cacheTimestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP)
      const now = Date.now()
      
      if (cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_KEYS.CACHE_DURATION) {
        // Cache is fresh, no need to fetch
        return
      }

      // Fetch fresh data from database
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'header')
        .maybeSingle()

      if (data?.setting_value) {
        const settings = {
          logo: data.setting_value.logo || null,
          siteName: data.setting_value.siteName || 'The Grateful Tribe'
        }
        
        // Update state (will update UI if changed)
        if (settings.logo) setLogoUrl(settings.logo)
        if (settings.siteName) setSiteName(settings.siteName)
        
        // Update cache for next time
        localStorage.setItem(CACHE_KEYS.HEADER_SETTINGS, JSON.stringify(settings))
        localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, now.toString())
      }
    } catch (error) {
      console.error('Error loading header settings:', error)
      // Silently fail - UI continues with cached/default data
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 backdrop-blur-xl shadow-2xl border-b border-purple-500/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="h-12 w-auto transition-transform group-hover:scale-110 drop-shadow-lg" 
                onError={(e) => {
                  // If image fails, hide it and show text instead
                  e.currentTarget.style.display = 'none';
                  setLogoUrl(null);
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-purple-900 font-bold text-lg">TGT</span>
                </div>
                <span className="text-yellow-400 font-bold text-xl tracking-wide">
                  {siteName}
                </span>
              </div>
            )}
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="px-4 py-2 text-white/90 hover:text-white font-semibold transition-all duration-200 rounded-lg hover:bg-white/20 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-yellow-400 group-hover:w-3/4 transition-all duration-300 shadow-lg shadow-yellow-400/50" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-full ring-2 ring-purple-200 hover:ring-purple-400 transition-all">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white font-semibold">
                        {profile.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Login
              </Button>
            )}
          </div>

          <button className="md:hidden text-white hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-white/20">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block text-white hover:text-yellow-400 font-semibold py-3 px-4 rounded-lg hover:bg-white/10 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && profile ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10 hover:text-yellow-400 font-semibold"
                  onClick={() => {
                    router.push('/dashboard')
                    setIsOpen(false)
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:text-yellow-400 font-semibold"
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 font-bold shadow-lg mt-2"
                onClick={() => {
                  router.push('/login')
                  setIsOpen(false)
                }}
              >
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
