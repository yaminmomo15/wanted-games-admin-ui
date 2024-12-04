import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Send, ArrowUpDown, Trash2, Pencil, Check, ImageIcon } from 'lucide-react'
import { useDropzone } from "react-dropzone"

interface HomeCardProps {
  id: string
  sortId: number
  defaultHeader?: string
  defaultParagraph1?: string
  defaultParagraph2?: string
  defaultAction?: string
  defaultImage?: string
  onDelete: (id: string) => void
  onReorder: () => void
  onSubmit: (data: {
    id: string
    header: string,
    paragraph1: string,
    paragraph2: string,
    action: string,
    image: string
  }) => Promise<void>
  submitRef: React.MutableRefObject<(() => void) | null>
}

const HomeCard = ({ 
  id,
  defaultHeader = "",
  defaultParagraph1 = "",
  defaultParagraph2 = "",
  defaultAction = "",
  defaultImage = "/placeholder.svg",
  onDelete,
  onReorder,
  onSubmit,
  submitRef
}: HomeCardProps) => {
  const [header, setHeader] = useState(defaultHeader)
  const [paragraph1, setParagraph1] = useState(defaultParagraph1)
  const [paragraph2, setParagraph2] = useState(defaultParagraph2)
  const [action, setAction] = useState(defaultAction)
  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [isEditingPara1, setIsEditingPara1] = useState(false)
  const [isEditingPara2, setIsEditingPara2] = useState(false)
  const [isEditingAction, setIsEditingAction] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [image, setImage] = useState<string>(defaultImage)

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
        header: header.trim() || '',
        paragraph1: paragraph1.trim() || '',
        paragraph2: paragraph2.trim() || '',
        action: action.trim() || '',
        image
      });

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
      }, 1500)

      setIsEditingHeader(false)
      setIsEditingPara1(false)
      setIsEditingPara2(false)
      setIsEditingAction(false)
    } catch (error) {
      console.error('Error submitting home content:', error)
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
                alt="Header image"
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
            <Input
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              placeholder="Enter header"
              className="text-2xl font-bold"
              onBlur={() => setIsEditingHeader(false)}
              autoFocus
            />

            <Textarea
              value={paragraph1}
              onChange={(e) => setParagraph1(e.target.value)}
              placeholder="Enter first paragraph"
              onBlur={() => setIsEditingPara1(false)}
              autoFocus
            />
            <Textarea
              value={paragraph2}
              onChange={(e) => setParagraph2(e.target.value)}
              placeholder="Enter second paragraph"
              onBlur={() => setIsEditingPara2(false)}
              autoFocus
            />
            <Input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Click here"
              onBlur={() => setIsEditingAction(false)}
              autoFocus
            />
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

export { HomeCard }
export type { HomeCardProps }
