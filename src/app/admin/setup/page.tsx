'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AdminSetupPage() {
  const [email, setEmail] = useState('admin@gratefultribe.org')
  const [password, setPassword] = useState('Admin123!')
  const [fullName, setFullName] = useState('Site Administrator')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const createAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🚀 Creating admin user...')

      // Step 1: Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      console.log('✅ User created:', signUpData)

      // Step 2: Update profile to admin role (if profile was created)
      if (signUpData.user) {
        // Wait a bit for profile to be created by trigger
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', signUpData.user.id)

        if (updateError) {
          console.warn('Profile update error (might need manual SQL):', updateError)
        } else {
          console.log('✅ Profile updated to admin')
        }
      }

      setResult({
        success: true,
        message: 'Admin user created successfully!',
        user: signUpData.user,
        needsEmailConfirmation: signUpData.user?.identities?.length === 0,
      })

    } catch (err: any) {
      console.error('❌ Error:', err)
      setResult({
        success: false,
        error: err.message || 'Failed to create admin user',
      })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setResult({
        success: true,
        message: 'Login successful! ✅',
        user: data.user,
      })
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Admin User Setup</CardTitle>
            <CardDescription>
              Create or test admin login credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gratefultribe.org"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin123!"
                />
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Site Administrator"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={createAdmin} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : '1. Create Admin User'}
              </Button>

              <Button 
                onClick={testLogin} 
                disabled={loading}
                variant="secondary"
                className="flex-1"
              >
                {loading ? 'Testing...' : '2. Test Login'}
              </Button>
            </div>

            {result && (
              <div className={`p-4 rounded border ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`font-bold mb-2 ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? '✅ Success' : '❌ Error'}
                </p>
                
                {result.message && (
                  <p className="mb-2">{result.message}</p>
                )}

                {result.error && (
                  <p className="text-red-700 mb-2">{result.error}</p>
                )}

                {result.needsEmailConfirmation && (
                  <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
                    <p className="font-bold text-yellow-900">⚠️ Action Required:</p>
                    <p className="text-yellow-800 text-sm mt-1">
                      You need to confirm the email. Check your Supabase Dashboard → Authentication → Users 
                      and manually confirm the user, OR check your email for confirmation link.
                    </p>
                  </div>
                )}

                {result.user && (
                  <details className="mt-3">
                    <summary className="cursor-pointer font-semibold">View Details</summary>
                    <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-60">
                      {JSON.stringify(result.user, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
              <p className="font-bold text-blue-900 mb-2">📝 Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>Click "Create Admin User" to create the account</li>
                <li>If email confirmation is required, confirm in Supabase Dashboard</li>
                <li>Click "Test Login" to verify credentials work</li>
                <li>Go to <a href="/admin/login" className="underline">/admin/login</a> and login</li>
              </ol>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded p-4 text-sm">
              <p className="font-bold text-purple-900 mb-2">⚠️ If Creation Fails:</p>
              <p className="text-purple-800 mb-2">
                The automatic profile creation might not work if the database trigger isn't set up. 
                In that case, run this SQL in Supabase Dashboard → SQL Editor:
              </p>
              <pre className="bg-white p-2 rounded text-xs overflow-auto">
{`-- Create trigger (run once)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Then promote to admin
UPDATE public.profiles SET role = 'admin' 
WHERE email = '${email}';`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
