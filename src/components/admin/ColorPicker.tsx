'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value)

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="color"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className="w-20 h-10 cursor-pointer"
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
      <div 
        className="w-full h-10 rounded border"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
