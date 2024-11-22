import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Trash } from 'lucide-react'
import mainImage from '../assets/images/image_main.png'
import icon1 from '../assets/images/icon_1.png'
import icon2 from '../assets/images/icon_2.png'
import icon3 from '../assets/images/icon_3.png'

interface ProductContent {
  title: string
  mainDescription: string
  secondaryDescription: string
  mainImage: string
  icons: string[]
}

function GameEditor() {
  const [content, setContent] = useState<ProductContent>({
    title: 'Koi-Koi',
    mainDescription: 'Koi-Koi is a traditional Japanese card game played with Hanafuda cards, often enjoyed by two players. The goal is to create specific card combinations, called yaku, to earn points. The game consists of rounds where players alternately draw cards to match ones on the table, forming sets based on seasonal themes.',
    secondaryDescription: 'A player can declare "Koi-Koi" to extend the round for a chance at higher scores, but it risks their opponent earning more points. It\'s a strategic blend of matching, timing, and calculated risks, celebrated for its cultural significance and aesthetic beauty.',
    mainImage: mainImage,
    icons: [
      icon1,
      icon2,
      icon3
    ],
  })

  const handleDrop = useCallback((e: React.DragEvent, key: 'mainImage' | 'icons', index?: number) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFileUpload(file, key, index)
  }, [])

  const handleFileUpload = (file: File, key: 'mainImage' | 'icons', index?: number) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (key === 'mainImage') {
          setContent(prev => ({ ...prev, [key]: reader.result as string }))
        } else if (key === 'icons' && typeof index === 'number') {
          setContent(prev => ({
            ...prev,
            icons: prev.icons.map((icon, i) => i === index ? reader.result as string : icon)
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    // Implement submit logic here
    console.log('Submitting content:', content)
  }

  return (
    <div className="min-h-screen p-8 bg-amber-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end space-x-2 mb-4">
          <Button className="bg-amber-600 text-white hover:bg-amber-700" onClick={handleSubmit}>
            Submit
          </Button>
          <Button className="bg-red-600 text-white hover:bg-red-700">
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div 
              className="relative w-[480px] h-[480px] rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-amber-200"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, 'mainImage')}
            >
              <img
                src={content.mainImage}
                alt="Product"
                className="object-contain p-0"
                sizes="480px"
              />
              <label
                htmlFor="mainImage"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload className="w-8 h-8 text-white" />
              </label>
              <Input
                type="file"
                id="mainImage"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files?.[0] as File, 'mainImage')}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-8">
            <Input
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              className="text-4xl font-bold mb-4 text-amber-800 bg-amber-50 border-amber-200"
              placeholder="Enter title"
            />

            <Textarea
              value={content.mainDescription}
              onChange={(e) => setContent(prev => ({ ...prev, mainDescription: e.target.value }))}
              className="min-h-[100px] mb-4 text-amber-700 bg-amber-50 border-amber-200"
              placeholder="Enter main description"
            />

            <Textarea
              value={content.secondaryDescription}
              onChange={(e) => setContent(prev => ({ ...prev, secondaryDescription: e.target.value }))}
              className="min-h-[100px] mb-8 text-amber-700 bg-amber-50 border-amber-200"
              placeholder="Enter secondary description"
            />

            <div className="flex justify-between">
              {content.icons.map((icon, index) => (
                <div 
                  key={index} 
                  className="relative w-[112px] h-[112px] rounded-2xl overflow-hidden shadow-md border-2 border-amber-200 bg-white"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, 'icons', index)}
                >
                  <img
                    src={icon}
                    alt={`Icon ${index + 1}`}
                    className="object-cover p-2"
                    sizes="112px"
                  />
                  <label
                    htmlFor={`icon-${index}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-white" />
                  </label>
                  <Input
                    type="file"
                    id={`icon-${index}`}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files?.[0] as File, 'icons', index)}
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { GameEditor }

