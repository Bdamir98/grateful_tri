'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaLibrary } from '../MediaLibrary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function GalleryPageEditor() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gallery Page Editor</h2>
        <p className="text-gray-600">Manage your website gallery images and videos</p>
      </div>

      <Tabs defaultValue="media" className="w-full">
        <TabsList>
          <TabsTrigger value="media">Media Library</TabsTrigger>
          <TabsTrigger value="settings">Gallery Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Media Library</CardTitle>
              <p className="text-sm text-gray-600">
                Upload and manage your gallery images. Drag and drop to upload multiple files at once.
              </p>
            </CardHeader>
            <CardContent>
              <MediaLibrary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gallery Layout</label>
                <select className="w-full border rounded-md p-2">
                  <option value="grid">Grid Layout</option>
                  <option value="masonry">Masonry Layout</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Items Per Row</label>
                <select className="w-full border rounded-md p-2">
                  <option value="2">2 Columns</option>
                  <option value="3">3 Columns</option>
                  <option value="4">4 Columns</option>
                  <option value="5">5 Columns</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image Aspect Ratio</label>
                <select className="w-full border rounded-md p-2">
                  <option value="square">Square (1:1)</option>
                  <option value="landscape">Landscape (16:9)</option>
                  <option value="portrait">Portrait (3:4)</option>
                  <option value="auto">Original</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enable-lightbox"
                  className="rounded"
                  defaultChecked
                />
                <label htmlFor="enable-lightbox" className="text-sm font-medium">
                  Enable Lightbox (Click to enlarge images)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enable-captions"
                  className="rounded"
                  defaultChecked
                />
                <label htmlFor="enable-captions" className="text-sm font-medium">
                  Show Image Captions
                </label>
              </div>

              <div className="pt-4">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Save Gallery Settings
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Gallery Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload high-quality images for best results (recommended: 1920x1080px)</li>
                  <li>Supported formats: JPG, PNG, WebP, GIF</li>
                  <li>Use descriptive filenames for better SEO</li>
                  <li>Images are automatically optimized for web performance</li>
                  <li>You can drag images to reorder them in the gallery</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
