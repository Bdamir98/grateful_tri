import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Public admin pages (no auth required)
  const publicAdminPages = ['/admin/login', '/admin/test-connection', '/admin/setup']
  const isPublicAdminPage = publicAdminPages.some(page => request.nextUrl.pathname.startsWith(page))

  // Protect admin routes (except public pages)
  if (request.nextUrl.pathname.startsWith('/admin') && !isPublicAdminPage) {
    console.log('🔒 Middleware: Checking admin access for:', request.nextUrl.pathname)
    console.log('👤 User:', user?.email || 'No user')
    
    if (!user) {
      console.log('❌ No user found, redirecting to login')
      const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url))
      // Copy cookies from the session refresh to the redirect response
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      return redirectResponse
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single()

    console.log('👤 Profile:', profile)
    console.log('🔑 Role:', profile?.role)
    console.log('❌ Profile Error:', profileError)

    if (profileError || !profile) {
      console.log('❌ Profile not found, redirecting to home')
      const redirectResponse = NextResponse.redirect(new URL('/', request.url))
      // Copy cookies from the session refresh to the redirect response
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      return redirectResponse
    }

    if (profile.role !== 'admin') {
      console.log('❌ User is not admin (role:', profile.role, '), redirecting to home')
      const redirectResponse = NextResponse.redirect(new URL('/', request.url))
      // Copy cookies from the session refresh to the redirect response
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      return redirectResponse
    }

    console.log('✅ Admin access granted')
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
      // Copy cookies from the session refresh to the redirect response
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      return redirectResponse
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
