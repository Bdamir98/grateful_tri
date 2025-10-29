'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { Save, Plus, Trash2, TrendingUp } from 'lucide-react'

interface ImpactStat {
  number: string
  label: string
  sublabel: string
}

interface WorkProject {
  id: string
  category: string
  title: string
  description: string
  image: string
  details: string[]
  bgColor?: string
}

export function OurWorkEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [stats, setStats] = useState<ImpactStat[]>([
    { number: '3000+', label: 'Lives Impacted', sublabel: 'Across our projects' },
    { number: '1000+', label: 'Meals Served', sublabel: 'Every single day' },
    { number: '12+', label: 'Communities', sublabel: 'Actively serving' }
  ])

  const [projects, setProjects] = useState<WorkProject[]>([
    {
      id: '1',
      category: 'Education',
      title: '100 kids, 100 dreams. One big project 🎓',
      description: 'Providing quality education and resources to underprivileged children in rural communities. Our comprehensive program includes school supplies, nutritious meals, and after-school tutoring.',
      image: '',
      details: [
        'Distributed school supplies to 100+ students',
        'Provided daily nutritious meals',
        'Established after-school tutoring program'
      ]
    }
  ])

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'our_work')
        .eq('section_key', 'all')
        .maybeSingle()

      if (error) {
        console.error('Database error:', error)
      }

      if (data?.content) {
        if (data.content.stats) setStats(data.content.stats)
        if (data.content.projects) setProjects(data.content.projects)
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    try {
      console.log('Saving Our Work content...')
      console.log('Stats:', stats)
      console.log('Projects:', projects)
      
      const { data, error } = await supabase
        .from('page_content')
        .upsert({
          page_key: 'our_work',
          section_key: 'all',
          content: {
            stats,
            projects
          }
        }, {
          onConflict: 'page_key,section_key'
        })
        .select()

      console.log('Save result:', data)
      console.log('Save error:', error)

      if (error) throw error
      alert('Our Work content saved successfully!')
    } catch (error: any) {
      console.error('Error saving:', error)
      alert(`Failed to save content: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const updateStat = (index: number, field: keyof ImpactStat, value: string) => {
    const newStats = [...stats]
    newStats[index][field] = value
    setStats(newStats)
  }

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        category: 'New Category',
        title: 'New Project Title',
        description: 'Project description...',
        image: '',
        details: ['Detail 1', 'Detail 2', 'Detail 3']
      }
    ])
  }

  const updateProject = (id: string, field: keyof WorkProject, value: any) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const deleteProject = (id: string) => {
    if (confirm('Delete this project?')) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  const addDetail = (projectId: string) => {
    setProjects(projects.map(p =>
      p.id === projectId
        ? { ...p, details: [...p.details, 'New detail'] }
        : p
    ))
  }

  const updateDetail = (projectId: string, detailIndex: number, value: string) => {
    setProjects(projects.map(p =>
      p.id === projectId
        ? {
            ...p,
            details: p.details.map((d, i) => i === detailIndex ? value : d)
          }
        : p
    ))
  }

  const deleteDetail = (projectId: string, detailIndex: number) => {
    setProjects(projects.map(p =>
      p.id === projectId
        ? { ...p, details: p.details.filter((_, i) => i !== detailIndex) }
        : p
    ))
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-white border-b pb-4 mb-4 flex justify-between items-center shadow-sm p-4 -m-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Our Work Page Editor</h2>
          <p className="text-gray-600">Manage impact statistics and featured projects</p>
        </div>
        <Button 
          onClick={saveContent} 
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : '💾 Save Changes'}
        </Button>
      </div>

      {/* Impact Statistics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Impact by the Numbers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {stats.map((stat, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Number</Label>
                <Input
                  value={stat.number}
                  onChange={(e) => updateStat(index, 'number', e.target.value)}
                  placeholder="3000+"
                />
              </div>
              <div>
                <Label>Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  placeholder="Lives Impacted"
                />
              </div>
              <div>
                <Label>Sublabel</Label>
                <Input
                  value={stat.sublabel}
                  onChange={(e) => updateStat(index, 'sublabel', e.target.value)}
                  placeholder="Across our projects"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Featured Projects Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Featured Projects</CardTitle>
            <Button onClick={addProject} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {projects.map((project, index) => (
            <Card key={project.id} className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Project {index + 1}</CardTitle>
                <Button
                  onClick={() => deleteProject(project.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category */}
                <div>
                  <Label>Category Badge</Label>
                  <Input
                    value={project.category}
                    onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                    placeholder="Education, Health, Community, etc."
                  />
                </div>

                {/* Title */}
                <div>
                  <Label>Project Title</Label>
                  <Input
                    value={project.title}
                    onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                    placeholder="100 kids, 100 dreams. One big project 🎓"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    rows={4}
                    placeholder="Detailed project description..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Project Image</Label>
                  <ImageUpload
                    label="Upload project image"
                    currentImage={project.image}
                    onUpload={(url: string) => updateProject(project.id, 'image', url)}
                  />
                </div>

                {/* Key Details */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Key Details</Label>
                    <Button
                      onClick={() => addDetail(project.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Detail
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {project.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex gap-2">
                        <Input
                          value={detail}
                          onChange={(e) =>
                            updateDetail(project.id, detailIndex, e.target.value)
                          }
                          placeholder="Detail point"
                        />
                        <Button
                          onClick={() => deleteDetail(project.id, detailIndex)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No projects yet. Click "Add Project" to create one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button onClick={saveContent} disabled={saving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}
