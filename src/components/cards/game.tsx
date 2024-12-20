import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HexColorPicker, HexColorInput } from "react-colorful"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Send, ArrowUpDown, Trash2, ImageIcon, Check } from 'lucide-react'

interface GameCardProps {
  id: string
  sortId: number
  defaultTitle?: string
  defaultDescription1?: string
  defaultDescription2?: string
  defaultImage?: string
  defaultSmallImages?: string[]
  defaultBackgroundColor?: string
  defaultTextColor?: string
  defaultUrl?: string
  onDelete: (id: string) => void
  onReorder: () => void
  onSubmit: (data: {
    id: string
    title: string,
    description1: string,
    description2: string,
    url: string,
    mainImage: string,
    smallImages: string[]
    backgroundColor: string,
    textColor: string
  }) => Promise<void>
  submitRef: React.MutableRefObject<(() => void) | null>
}

const GameCard = ({ 
  id,
  // sortId,
  defaultTitle = "",
  defaultDescription1 = "",
  defaultDescription2 = "",
  defaultImage = "/placeholder.svg",
  defaultSmallImages = [],
  defaultBackgroundColor = "#ffffff",
  defaultTextColor = "#000000",
  defaultUrl = "",
  onDelete,
  onReorder,
  onSubmit,
  submitRef
}: GameCardProps) => {
  const [title, setTitle] = useState(defaultTitle)
  const [description1, setDescription1] = useState(defaultDescription1)
  const [description2, setDescription2] = useState(defaultDescription2)
  const [url, setUrl] = useState(defaultUrl)
  const [mainImage, setMainImage] = useState<string>(defaultImage)
  const [smallImages, setSmallImages] = useState<string[]>(
    defaultSmallImages.length > 0 
      ? defaultSmallImages 
      : Array(3).fill('/placeholder.svg')
  )
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDesc1, setIsEditingDesc1] = useState(false)
  const [isEditingDesc2, setIsEditingDesc2] = useState(false)
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState(defaultBackgroundColor)
  const [textColor, setTextColor] = useState(defaultTextColor)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { getRootProps: getMainProps, getInputProps: getMainInput } = useDropzone({
    accept: {
      "image/*": []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      const imageUrl = URL.createObjectURL(file)
      setMainImage(imageUrl)
    }
  })

  const handleSmallImageUpload = (index: number) => (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const imageUrl = URL.createObjectURL(file)
    const newSmallImages = [...smallImages]
    newSmallImages[index] = imageUrl
    setSmallImages(newSmallImages)
  }

  submitRef.current = async () => {
    try {
      await onSubmit({
        id,
        title: title.trim() || '',
        description1: description1.trim() || '',
        description2: description2.trim() || '',
        url: url.trim() || '',
        mainImage,
        smallImages,
        backgroundColor,
        textColor
      });

      // Show tick icon
      setIsSubmitted(true)
      
      // Reset after 1 second
      setTimeout(() => {
        setIsSubmitted(false)
      }, 1500)

      setIsEditingTitle(false);
      setIsEditingDesc1(false);
      setIsEditingDesc2(false);
      setIsEditingUrl(false);
    } catch (error) {
      console.error('Error submitting game:', error);
    }
  }

  const smallImageDropzone0 = useDropzone({
    accept: { "image/*": [] },
    onDrop: handleSmallImageUpload(0)
  });
  const smallImageDropzone1 = useDropzone({
    accept: { "image/*": [] },
    onDrop: handleSmallImageUpload(1)
  });
  const smallImageDropzone2 = useDropzone({
    accept: { "image/*": [] },
    onDrop: handleSmallImageUpload(2)
  });

  const smallImageDropzones = [smallImageDropzone0, smallImageDropzone1, smallImageDropzone2];

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Image Section */}
          <div
            {...getMainProps()}
            className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
          >
            <input {...getMainInput()} />
            {mainImage ? (
              <img
                src={mainImage}
                alt="Game cover"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">
                  Drag and drop or click to upload main image
                </p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="text-2xl font-bold"
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
              />

              <Textarea
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
                placeholder="Enter first description"
                className="min-h-[100px]"
                onBlur={() => setIsEditingDesc1(false)}
                autoFocus
              />

              <Textarea
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
                placeholder="Enter second description"
                className="min-h-[100px]"
                onBlur={() => setIsEditingDesc2(false)}
                autoFocus
              />

              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                className="w-full"
                onBlur={() => setIsEditingUrl(false)}
                autoFocus
              />

            {/* Small Images Section */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {smallImageDropzones.map((dropzone, index) => (
                <div
                  key={index}
                  {...dropzone.getRootProps()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer flex items-center justify-center"
                >
                  <input {...dropzone.getInputProps()} />
                  {smallImages[index] ? (
                    <img
                      src={smallImages[index]}
                      alt={`Small image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div>
              <Label htmlFor="bg-color" className="mb-1 block">Background</Label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="bg-color"
                      variant="outline"
                      className="w-[42px] h-[42px] p-0"
                      style={{ backgroundColor }}
                    >
                      <span className="sr-only">Pick a background color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                  </PopoverContent>
                </Popover>
                <HexColorInput
                  color={backgroundColor}
                  onChange={setBackgroundColor}
                  prefixed
                  alpha
                  className="w-[100px] h-[42px] px-2 border rounded"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="text-color" className="mb-1 block">Text</Label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="text-color"
                      variant="outline"
                      className="w-[42px] h-[42px] p-0"
                      style={{ backgroundColor: textColor }}
                    >
                      <span className="sr-only">Pick a text color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <HexColorPicker color={textColor} onChange={setTextColor} />
                  </PopoverContent>
                </Popover>
                <HexColorInput
                  color={textColor}
                  onChange={setTextColor}
                  prefixed
                  alpha
                  className="w-[100px] h-[42px] px-2 border rounded"
                />
              </div>
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
        </div>
      </CardContent>
    </Card>
  )
}

export { GameCard }
export type { GameCardProps }