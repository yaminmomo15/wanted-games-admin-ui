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
  defaultHeader = "New Header",
  defaultParagraph1 = "Enter first paragraph here...",
  defaultParagraph2 = "Enter second paragraph here...",
  defaultAction = "Click here",
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
        header: header.trim() || 'New Header',
        paragraph1: paragraph1.trim() || 'Enter first paragraph here...',
        paragraph2: paragraph2.trim() || 'Enter second paragraph here...',
        action: action.trim() || 'Click here',
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
            {isEditingHeader ? (
              <Input
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                placeholder="Enter header"
                className="text-2xl font-bold"
                onBlur={() => setIsEditingHeader(false)}
                autoFocus
              />
            ) : (
              <h2 
                className="text-2xl font-bold cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setIsEditingHeader(true)}
              >
                {header || "Header"}
              </h2>
            )}

            {isEditingPara1 ? (
              <Textarea
                value={paragraph1}
                onChange={(e) => setParagraph1(e.target.value)}
                placeholder="Enter first paragraph"
                className="min-h-[100px]"
                onBlur={() => setIsEditingPara1(false)}
                autoFocus
              />
            ) : (
              <p 
                className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setIsEditingPara1(true)}
              >
                {paragraph1 || "First paragraph goes here"}
              </p>
            )}

            {isEditingPara2 ? (
              <Textarea
                value={paragraph2}
                onChange={(e) => setParagraph2(e.target.value)}
                placeholder="Enter second paragraph"
                className="min-h-[100px]"
                onBlur={() => setIsEditingPara2(false)}
                autoFocus
              />
            ) : (
              <p 
                className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setIsEditingPara2(true)}
              >
                {paragraph2 || "Second paragraph goes here"}
              </p>
            )}

            {isEditingAction ? (
              <Input
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="Enter action text"
                onBlur={() => setIsEditingAction(false)}
                autoFocus
              />
            ) : (
              <p 
                className="text-blue-600 cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setIsEditingAction(true)}
              >
                {action || "Action text"}
              </p>
            )}
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
                  onClick={() => {
                    setIsEditingHeader(true)
                    setIsEditingPara1(true)
                    setIsEditingPara2(true)
                    setIsEditingAction(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>

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
