'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'

export default function SectionsPage() {
  const [sections, setSections] = useState<any[]>([])
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    const { data } = await supabase
      .from('content_sections')
      .select('*')
      .order('section_key')

    setSections(data || [])
  }

  const handleSave = async () => {
    if (!selectedSection) return

    setLoading(true)
    await supabase
      .from('content_sections')
      .update({
        title: selectedSection.title,
        subtitle: selectedSection.subtitle,
        content: selectedSection.content,
      })
      .eq('id', selectedSection.id)

    setLoading(false)
    loadSections()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Sections</h1>
        <p className="text-gray-600">Manage homepage section content</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section)}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selectedSection?.id === section.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">{section.section_key}</div>
                  <div className="text-sm opacity-80">{section.title}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedSection ? `Edit ${selectedSection.section_key}` : 'Select a section'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSection ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={selectedSection.title}
                    onChange={(e) =>
                      setSelectedSection({ ...selectedSection, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={selectedSection.subtitle}
                    onChange={(e) =>
                      setSelectedSection({ ...selectedSection, subtitle: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content (JSON)</Label>
                  <textarea
                    className="w-full min-h-[200px] p-2 border rounded"
                    value={JSON.stringify(selectedSection.content, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        setSelectedSection({ ...selectedSection, content: parsed })
                      } catch (err) {
                        // Invalid JSON, ignore
                      }
                    }}
                  />
                </div>

                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                Select a section from the list to edit
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
