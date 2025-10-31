'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X, Eye, Video } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

interface ImageUploadProps {
  label: string
  currentImage?: string | null
  onUpload: (url: string) => void
  storagePath?: string
  acceptVideo?: boolean
  maxSizeMB?: number
  helpText?: string
}

export function ImageUpload({ label, currentImage, onUpload, storagePath = 'website', acceptVideo = false, maxSizeMB = 5, helpText }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [showPreview, setShowPreview] = useState(false)

  // Update preview when currentImage changes (for editing existing items)
  useEffect(() => {
    console.log('ImageUpload currentImage changed:', currentImage)
    setPreview(currentImage || null)
  }, [currentImage])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    console.log('File selected:', file.name, 'Size:', file.size)

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (maxSizeMB && fileSizeMB > maxSizeMB) {
      alert(`File size must be less than ${maxSizeMB}MB. Your file is ${fileSizeMB.toFixed(2)}MB.`)
      return
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    console.log('Local preview set:', localPreview)

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${storagePath}/${fileName}`

      console.log('Uploading to path:', filePath)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('Upload successful:', uploadData)

      const { data: urlData } = supabase.storage
        .from('website-assets')
        .getPublicUrl(filePath)

      console.log('Public URL:', urlData.publicUrl)

      const publicUrl = urlData.publicUrl
      setPreview(publicUrl)
      
      // Call onUpload callback immediately
      if (onUpload) {
        console.log('Calling onUpload with URL:', publicUrl)
        onUpload(publicUrl)
      }
      
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
      // Reset to current image if upload failed
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
      // Clear the input value so the same file can be selected again if needed
      e.target.value = ''
    }
  }

  const clearImage = () => {
    setPreview(null)
    if (onUpload) {
      onUpload('')
    }
  }

  const isVideo = preview && (preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov'))

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      
      <div className="flex items-start gap-4">
        {/* Preview */}
        {preview && (
          <div className="relative w-48 h-32 border rounded-lg overflow-hidden bg-gray-50">
            {isVideo ? (
              <video
                src={preview}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="h-7 w-7 p-0"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-7 w-7 p-0"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex-1">
          <input
            type="file"
            accept={acceptVideo ? "image/*,video/*" : "image/*"}
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-')}`}
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.getElementById(`file-upload-${label.replace(/\s+/g, '-')}`) as HTMLInputElement
              if (input) {
                console.log('Clicking file input')
                input.click()
              } else {
                console.error('File input not found')
              }
            }}
            disabled={uploading}
            className="w-full"
          >
            {acceptVideo ? <Video className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploading ? 'Uploading...' : preview ? (acceptVideo ? 'Change File' : 'Change Image') : (acceptVideo ? 'Upload Image/Video' : 'Upload Image')}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            {acceptVideo ? `Images & Videos • Max ${maxSizeMB}MB` : `JPG, PNG, WebP • Max ${maxSizeMB}MB`}
          </p>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showPreview && preview && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[80vh]">
            {isVideo ? (
              <video
                src={preview}
                controls
                className="max-w-full max-h-[80vh]"
              />
            ) : (
              <Image
                src={preview}
                alt="Full preview"
                width={1200}
                height={800}
                className="object-contain"
              />
            )}
            <Button
              className="absolute top-4 right-4"
              variant="secondary"
              onClick={() => setShowPreview(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
