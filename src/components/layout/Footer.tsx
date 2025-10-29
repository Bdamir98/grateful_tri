'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Facebook, Youtube, Send, Mail, Heart, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FooterSettings {
  brandName: string
  brandDescription: string
  copyrightText: string
  socialLinks: {
    facebook: string
    youtube: string
    telegram: string
    email: string
  }
  sections: Array<{
    title: string
    links: Array<{
      label: string
      href: string
    }>
  }>
}

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings>({
    brandName: 'The Grateful Tribe',
    brandDescription: 'Empowering communities through digital opportunities and education.',
    copyrightText: 'All rights reserved.',
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
    ]
  })

  useEffect(() => {
    loadFooterData()
  }, [])

  const loadFooterData = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'footer')
        .maybeSingle()

      if (error) {
        console.error('Error loading footer:', error)
        return
      }

      if (data?.setting_value) {
        setSettings({
          brandName: data.setting_value.brandName || settings.brandName,
          brandDescription: data.setting_value.brandDescription || settings.brandDescription,
          copyrightText: data.setting_value.copyrightText || settings.copyrightText,
          socialLinks: data.setting_value.socialLinks || settings.socialLinks,
          sections: data.setting_value.sections || settings.sections
        })
      }
    } catch (error) {
      console.error('Error loading footer data:', error)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              {settings.brandName}
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              {settings.brandDescription}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>for humanity</span>
            </div>
          </div>

          {/* Dynamic Sections */}
          {settings.sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-lg mb-6 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-purple-400 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect Section */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Connect With Us</h4>
            <div className="flex flex-wrap gap-3 mb-6">
              {settings.socialLinks.youtube && (
                <a 
                  href={settings.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-red-500 hover:to-red-700 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 group"
                >
                  <Youtube className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {settings.socialLinks.facebook && (
                <a 
                  href={settings.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-700 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 group"
                >
                  <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {settings.socialLinks.telegram && (
                <a 
                  href={settings.socialLinks.telegram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-sky-500 hover:to-sky-700 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/50 group"
                >
                  <Send className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {settings.socialLinks.email && (
                <a 
                  href={`mailto:${settings.socialLinks.email}`} 
                  className="w-12 h-12 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-purple-500 hover:to-purple-700 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50 group"
                >
                  <Mail className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
            </div>
            <Button
              onClick={scrollToTop}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Back to Top
              <ArrowUp className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {settings.brandName}. {settings.copyrightText}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
