'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('🔐 Login attempt:', { email })

    try {
      console.log('📞 Calling signIn...')
      await signIn(email, password)
      console.log('✅ Sign in successful!')
      
      // Check if profile exists and has admin role
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Current user:', user?.email)
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', user?.id)
        .single()
      
      console.log('👤 Profile:', profile)
      console.log('🔑 Role:', profile?.role)
      
      if (profileError) {
        console.error('❌ Profile error:', profileError)
        throw new Error('Profile not found. Please contact administrator.')
      }
      
      if (profile?.role !== 'admin') {
        throw new Error('You do not have admin access.')
      }
      
      console.log('✅ Redirecting to admin dashboard...')
      
      // Wait a bit for cookies to be set and force session refresh
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Use router.push with refresh to ensure session is recognized
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      console.error('❌ Login error:', err)
      setError(err.message || err.error_description || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
