import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Send, ArrowUpDown, Trash2, Check } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface SocialCardProps {
  id: string
  sortId: number
  defaultImage?: string
  defaultUrl?: string
  onDelete: (id: string) => void
  onReorder: () => void
  onSubmit: (data: {
    id: string
    image: string
    url: string
  }) => Promise<void>
  submitRef: React.MutableRefObject<(() => void) | null>
}

const SocialCard = ({
  id,
  defaultImage = "/placeholder.svg",
  defaultUrl = "",
  onDelete,
  onReorder,
  onSubmit,
  submitRef
}: SocialCardProps) => {
  const [image, setImage] = useState(defaultImage)
  const [url, setUrl] = useState(defaultUrl)
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
        url: url.trim()
      });

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
      }, 1500)
    } catch (error) {
      console.error('Error submitting social link:', error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden mb-4">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Icon Image Upload */}
          <div
            {...getRootProps()}
            className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
          >
            <input {...getInputProps()} />
            {image ? (
              <img
                src={image}
                alt="Social icon"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">
                  Upload icon image
                </p>
              </div>
            )}
          </div>

          {/* URL Input */}
          <div className="md:col-span-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
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

export { SocialCard }
export type { SocialCardProps }
