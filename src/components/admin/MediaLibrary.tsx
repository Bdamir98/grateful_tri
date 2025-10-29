'use client'

import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { X, Search, Upload, Trash2, Eye, Copy, Check } from 'lucide-react'
import Image from 'next/image'

interface MediaFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  created_at: string
}

interface MediaLibraryProps {
  onSelect?: (url: string) => void
  multiple?: boolean
  accept?: string
}

export function MediaLibrary({ onSelect, multiple = false, accept = 'image/*' }: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const { data: mediaData } = await supabase
        .from('page_media')
        .select('*')
        .order('created_at', { ascending: false })

      if (mediaData) {
        setFiles(mediaData.map((m: any) => ({
          id: m.id,
          name: m.file_name || m.media_key,
          url: m.media_url || '',
          size: 0,
          type: m.media_type,
          created_at: m.created_at
        })))
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    let successCount = 0
    let failCount = 0
    
    for (const file of acceptedFiles) {
      try {
        // Sanitize filename - remove special characters and spaces
        const sanitizedName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, '_')
          .replace(/_{2,}/g, '_')
        
        const fileExt = sanitizedName.split('.').pop()
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        const fileName = `${timestamp}_${randomStr}.${fileExt}`
        const filePath = `gallery/${fileName}`

        console.log('Uploading:', fileName, 'Size:', file.size, 'Type:', file.type)

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('website-assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error details:', uploadError)
          throw new Error(uploadError.message || 'Upload failed')
        }

        console.log('Upload successful:', uploadData)

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('website-assets')
          .getPublicUrl(filePath)

        console.log('Public URL:', urlData.publicUrl)

        // Save to database
        const { error: dbError } = await supabase.from('page_media').insert({
          page_key: 'library',
          media_key: fileName,
          media_type: file.type.startsWith('image/') ? 'image' : 'document',
          media_url: urlData.publicUrl,
          storage_path: filePath,
          file_name: file.name
        })

        if (dbError) {
          console.error('Database error:', dbError)
          throw dbError
        }

        successCount++
      } catch (error: any) {
        failCount++
        console.error('Upload error for', file.name, ':', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
      }
    }

    setUploading(false)
    
    if (successCount > 0) {
      alert(`Successfully uploaded ${successCount} file(s)${failCount > 0 ? `, ${failCount} failed` : ''}`)
    } else if (failCount > 0) {
      alert(`Failed to upload ${failCount} file(s). Check console for details.`)
    }
    
    loadFiles()
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple: true
  })

  const deleteFile = async (fileId: string, storagePath?: string) => {
    if (!confirm('Delete this file?')) return

    try {
      // Delete from storage if path exists
      if (storagePath) {
        await supabase.storage.from('website-assets').remove([storagePath])
      }

      // Delete from database
      await supabase.from('page_media').delete().eq('id', fileId)
      
      loadFiles()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete file')
    }
  }

  const toggleSelect = (url: string) => {
    if (!multiple) {
      setSelectedFiles([url])
      onSelect?.(url)
      return
    }

    setSelectedFiles(prev =>
      prev.includes(url)
        ? prev.filter(f => f !== url)
        : [...prev, url]
    )
  }

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Supports: Images, Documents, Videos
        </p>
      </div>

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">Uploading files...</p>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={loadFiles}>
          Refresh
        </Button>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No files found' : 'No files uploaded yet'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className={`relative group cursor-pointer transition-all ${
                selectedFiles.includes(file.url) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleSelect(file.url)}
            >
              <div className="aspect-square relative bg-gray-100">
                {file.type === 'image' ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(file.url, '_blank')
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyUrl(file.url)
                    }}
                  >
                    {copiedUrl === file.url ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteFile(file.id, file.url)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected Checkmark */}
                {selectedFiles.includes(file.url) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="p-2">
                <p className="text-xs font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Selection Actions */}
      {selectedFiles.length > 0 && onSelect && (
        <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg p-4">
          <p className="text-sm font-medium mb-2">{selectedFiles.length} selected</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (multiple) {
                  selectedFiles.forEach(url => onSelect(url))
                } else {
                  onSelect(selectedFiles[0])
                }
              }}
            >
              Insert {selectedFiles.length} file(s)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedFiles([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
