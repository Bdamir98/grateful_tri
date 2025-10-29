import { supabase } from '@/lib/supabase/client'
import { Section, GalleryItem, Project, Testimonial } from '@/types/database.types'

export class ContentService {
  // NEW SYSTEM - Page Content
  static async getPageContent(pageKey: string, sectionKey: string = 'all'): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', pageKey)
        .eq('section_key', sectionKey)
        .single()
      
      if (error) throw error
      return data?.content || null
    } catch (error) {
      console.error(`Error fetching content for ${pageKey}/${sectionKey}:`, error)
      return null
    }
  }

  static async getSection(key: string): Promise<any> {
    try {
      // Try new system first
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('section_key', key)
        .single()
      
      if (error) throw error
      return data?.content || null
    } catch (error) {
      console.error(`Error fetching section ${key}:`, error)
      return null
    }
  }

  static async updatePageContent(pageKey: string, sectionKey: string, content: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_key: pageKey,
          section_key: sectionKey,
          content,
          is_active: true
        }, {
          onConflict: 'page_key,section_key'
        })
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating page content:', error)
      return false
    }
  }

  // Gallery
  static async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      return []
    }
  }

  static async createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryItem | null> {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .insert(item)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating gallery item:', error)
      return null
    }
  }

  static async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      return false
    }
  }

  // Projects
  static async getProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching projects:', error)
      return []
    }
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      return null
    }
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating project:', error)
      return false
    }
  }

  static async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      return false
    }
  }

  // Testimonials
  static async getTestimonials(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      return []
    }
  }

  static async getFeaturedTestimonials(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching featured testimonials:', error)
      return []
    }
  }

  static async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial | null> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert(testimonial)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating testimonial:', error)
      return null
    }
  }

  static async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating testimonial:', error)
      return false
    }
  }

  static async deleteTestimonial(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      return false
    }
  }

  // Upload media
  static async uploadMedia(file: File, bucket: string, path: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading media:', error)
      return null
    }
  }
}
