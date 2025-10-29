'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Routes that should not show navbar/footer
  const hideNavbarFooter = pathname?.startsWith('/admin') || 
                          pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/login') || 
                          pathname?.startsWith('/signup')

  if (hideNavbarFooter) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-screen w-full">
      <Navbar />
      <main className="relative z-10 w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
