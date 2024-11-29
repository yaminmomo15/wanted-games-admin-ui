import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Trash2, ImageIcon, Send, Check } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface GalleryCardProps {
  id: string
  sortId: number
  defaultImage?: string
  onDelete: (id: string) => void
  onReorder: () => void
  onSubmit: (data: {
    id: string
    image: string,
  }) => Promise<void>
  submitRef: React.MutableRefObject<(() => void) | null>
}

const GalleryCard = ({ 
  id,
  defaultImage = "/placeholder.svg",
  onDelete,
  onReorder,
  onSubmit,
  submitRef
}: GalleryCardProps) => {
  const [image, setImage] = useState<string>(defaultImage)
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
        image,
      });

      setIsSubmitted(true)
      
      setTimeout(() => {
        setIsSubmitted(false)
      }, 1500)

    } catch (error) {
      console.error('Error submitting gallery item:', error);
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden mb-6">
      <CardContent className="p-6">
        {/* Image Section */}
        <div
          {...getRootProps()}
          className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
        >
          <input {...getInputProps()} />
          {image ? (
            <img
              src={image}
              alt="Gallery image"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Updated Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
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

export { GalleryCard }
export type { GalleryCardProps }
