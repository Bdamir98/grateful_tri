'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestConnectionPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Test 1: Check Supabase URL
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      console.log('🔍 Testing Supabase connection...')
      console.log('URL:', url)
      console.log('Anon Key:', anonKey ? '✓ Present' : '✗ Missing')

      // Test 2: Check database connection
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('email, role')
        .limit(5)

      // Test 3: Check auth
      const { data: authData, error: authError } = await supabase.auth.getSession()

      setResult({
        env: {
          url: url || '❌ Missing',
          anonKey: anonKey ? '✅ Present' : '❌ Missing',
        },
        database: {
          status: profileError ? '❌ Error' : '✅ Connected',
          error: profileError?.message,
          profiles: profiles?.length || 0,
          sampleData: profiles,
        },
        auth: {
          status: authError ? '❌ Error' : '✅ Working',
          session: authData.session ? '✅ Logged in' : 'No session',
          error: authError?.message,
        },
      })

      console.log('Test results:', {
        profileError,
        profiles,
        authData,
        authError,
      })
    } catch (err: any) {
      console.error('Test error:', err)
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Supabase Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>

            {result && (
              <div className="mt-6 space-y-4">
                {result.error ? (
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-red-800 font-bold">Error:</p>
                    <p className="text-red-600">{result.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Environment Variables */}
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <p className="font-bold text-blue-900 mb-2">Environment Variables</p>
                      <div className="space-y-1 text-sm">
                        <p>URL: {result.env.url}</p>
                        <p>Anon Key: {result.env.anonKey}</p>
                      </div>
                    </div>

                    {/* Database */}
                    <div className="bg-green-50 border border-green-200 rounded p-4">
                      <p className="font-bold text-green-900 mb-2">Database Connection</p>
                      <div className="space-y-1 text-sm">
                        <p>Status: {result.database.status}</p>
                        <p>Profiles found: {result.database.profiles}</p>
                        {result.database.error && (
                          <p className="text-red-600">Error: {result.database.error}</p>
                        )}
                        {result.database.sampleData && (
                          <details className="mt-2">
                            <summary className="cursor-pointer font-semibold">
                              View sample profiles
                            </summary>
                            <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                              {JSON.stringify(result.database.sampleData, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>

                    {/* Auth */}
                    <div className="bg-purple-50 border border-purple-200 rounded p-4">
                      <p className="font-bold text-purple-900 mb-2">Authentication</p>
                      <div className="space-y-1 text-sm">
                        <p>Status: {result.auth.status}</p>
                        <p>Session: {result.auth.session}</p>
                        {result.auth.error && (
                          <p className="text-red-600">Error: {result.auth.error}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="font-bold mb-2">Full Response:</p>
                  <pre className="text-xs overflow-auto max-h-96 bg-white p-2 rounded">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
