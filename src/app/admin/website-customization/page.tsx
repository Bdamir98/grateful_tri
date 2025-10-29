'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { HomePageEditor } from '@/components/admin/customization/HomePageEditor'
import { OurTribeEditor } from '@/components/admin/customization/OurTribeEditor'
import { FounderPageEditor } from '@/components/admin/customization/FounderPageEditor'
import { PartnerPageEditor } from '@/components/admin/customization/PartnerPageEditor'
import { GalleryPageEditor } from '@/components/admin/customization/GalleryPageEditor'
import { OurWorkEditor } from '@/components/admin/customization/OurWorkEditor'
import { HeaderEditor } from '@/components/admin/customization/HeaderEditor'
import { FooterEditor } from '@/components/admin/customization/FooterEditor'
import { ThemeCustomizer } from '@/components/admin/customization/ThemeCustomizer'
import { 
  Home, 
  Users, 
  User, 
  Handshake, 
  Images, 
  Briefcase,
  Layout,
  AlignHorizontalJustifyEnd, 
  Palette 
} from 'lucide-react'

export default function WebsiteCustomizationPage() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Website Customization</h1>
        <p className="text-gray-600">Customize your website content, images, colors, and fonts</p>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-9 gap-4 mb-8">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="tribe" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Our Tribe
            </TabsTrigger>
            <TabsTrigger value="founder" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Founder
            </TabsTrigger>
            <TabsTrigger value="partner" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Partner
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="our-work" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Our Work
            </TabsTrigger>
            <TabsTrigger value="header" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Header
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center gap-2">
              <AlignHorizontalJustifyEnd className="h-4 w-4" />
              Footer
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <HomePageEditor />
          </TabsContent>

          <TabsContent value="tribe">
            <OurTribeEditor />
          </TabsContent>

          <TabsContent value="founder">
            <FounderPageEditor />
          </TabsContent>

          <TabsContent value="partner">
            <PartnerPageEditor />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryPageEditor />
          </TabsContent>

          <TabsContent value="our-work">
            <OurWorkEditor />
          </TabsContent>

          <TabsContent value="header">
            <HeaderEditor />
          </TabsContent>

          <TabsContent value="footer">
            <FooterEditor />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeCustomizer />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
