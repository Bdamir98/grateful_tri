'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Palette, 
  BookOpen, 
  FileText, 
  Users, 
  BarChart3,
  LogOut,
  FolderOpen,
  Image,
  MessageSquare,
  Settings
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/website-customization', label: 'Website Customization', icon: Settings },
    { href: '/admin/customization', label: 'Theme Colors', icon: Palette },
    { href: '/admin/courses', label: 'Courses', icon: BookOpen },
    { href: '/admin/content/sections', label: 'Sections', icon: FileText },
    { href: '/admin/content/projects', label: 'Projects', icon: FolderOpen },
    { href: '/admin/content/gallery', label: 'Gallery', icon: Image },
    { href: '/admin/content/testimonials', label: 'Testimonials', icon: MessageSquare },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-400">The Grateful Tribe</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
