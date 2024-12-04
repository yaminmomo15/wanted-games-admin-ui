import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Send, ArrowUpDown, Trash2, ImageIcon, Pencil, Check } from 'lucide-react'

interface AboutCardProps {
  id: string
  sortId: number
  defaultTitle?: string
  defaultImage?: string
  defaultParagraph1?: string
  defaultParagraph2?: string
  defaultParagraph3?: string
  onDelete: (id: string) => void
  onReorder: () => void
  onSubmit: (data: {
    id: string
    title: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
    image: string
  }) => Promise<void>
  submitRef: React.MutableRefObject<(() => void) | null>
}

const AboutCard = ({
  id,
  sortId,
  defaultTitle = "New About Section",
  defaultImage = "/placeholder.svg",
  defaultParagraph1 = "Enter first paragraph here...",
  defaultParagraph2 = "Enter second paragraph here...",
  defaultParagraph3 = "Enter third paragraph here...",
  onDelete,
  onReorder,
  onSubmit,
  submitRef
}: AboutCardProps) => {
  const [title, setTitle] = useState(defaultTitle)
  const [image, setImage] = useState<string>(defaultImage)
  const [paragraph1, setParagraph1] = useState(defaultParagraph1)
  const [paragraph2, setParagraph2] = useState(defaultParagraph2)
  const [paragraph3, setParagraph3] = useState(defaultParagraph3)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingP1, setIsEditingP1] = useState(false)
  const [isEditingP2, setIsEditingP2] = useState(false)
  const [isEditingP3, setIsEditingP3] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  })

  submitRef.current = async () => {
    try {
      await onSubmit({
        id,
        title: title.trim() || 'New About Section',
        paragraph1: paragraph1.trim() || 'Enter first paragraph here...',
        paragraph2: paragraph2.trim() || 'Enter second paragraph here...',
        paragraph3: paragraph3.trim() || 'Enter third paragraph here...',
        image,
      });

      setIsSubmitted(true)
      
      setTimeout(() => {
        setIsSubmitted(false)
      }, 1500)

      setIsEditingTitle(false)
      setIsEditingP1(false)
      setIsEditingP2(false)
      setIsEditingP3(false)
    } catch (error) {
      console.error('Error submitting about section:', error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div
            {...getRootProps()}
            className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
          >
            <input {...getInputProps()} />
            {image ? (
              <img
                src={image}
                alt="About section"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            {isEditingTitle ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="text-2xl font-bold"
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
              />
            ) : (
              <h2 
                className="text-2xl font-bold cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setIsEditingTitle(true)}
              >
                {title}
              </h2>
            )}

            {[
              { value: paragraph1, setValue: setParagraph1, isEditing: isEditingP1, setIsEditing: setIsEditingP1 },
              { value: paragraph2, setValue: setParagraph2, isEditing: isEditingP2, setIsEditing: setIsEditingP2 },
              { value: paragraph3, setValue: setParagraph3, isEditing: isEditingP3, setIsEditing: setIsEditingP3 },
            ].map((paragraph, index) => (
              <div key={index}>
                {paragraph.isEditing ? (
                  <Textarea
                    value={paragraph.value}
                    onChange={(e) => paragraph.setValue(e.target.value)}
                    placeholder={`Enter paragraph ${index + 1}`}
                    className="min-h-[100px]"
                    onBlur={() => paragraph.setIsEditing(false)}
                    autoFocus
                  />
                ) : (
                  <p 
                    className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => paragraph.setIsEditing(true)}
                  >
                    {paragraph.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => submitRef.current?.()}
                >
                  {isSubmitted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Submit</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onReorder}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reorder</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}

export { AboutCard }
export type { AboutCardProps }
