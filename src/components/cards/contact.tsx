import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Send, Trash2, ImageIcon, Pencil, Check } from 'lucide-react'

interface ContactCardProps {
  id: string
  defaultEmail?: string
  defaultBackgroundImage?: string
  defaultIconImage?: string
  onSubmit: (data: {
    id: string
    email: string,
    background_image: string,
    logo: string
  }) => Promise<void>
  submitRef: React.MutableRefObject<(() => void) | null>
}

const ContactCard = ({ 
  id,
  defaultEmail = "",
  defaultBackgroundImage = "/placeholder.svg",
  defaultIconImage = "/placeholder.svg",
  onSubmit,
  submitRef
}: ContactCardProps) => {
  const [email, setEmail] = useState(defaultEmail)
  const [backgroundImage, setBackgroundImage] = useState<string>(defaultBackgroundImage)
  const [iconImage, setIconImage] = useState<string>(defaultIconImage)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { getRootProps: getBackgroundProps, getInputProps: getBackgroundInput } = useDropzone({
    accept: {
      "image/*": []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImage(imageUrl)
    }
  })

  const { getRootProps: getIconProps, getInputProps: getIconInput } = useDropzone({
    accept: {
      "image/*": []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      const imageUrl = URL.createObjectURL(file)
      setIconImage(imageUrl)
    }
  })

  submitRef.current = async () => {
    try {
      await onSubmit({
        id,
        email: email.trim() || '',
        background_image: backgroundImage,
        logo: iconImage
      });

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
      }, 1500)

      setIsEditingEmail(false);
    } catch (error) {
      console.error('Error submitting contact:', error);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Background Image Section */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  {...getBackgroundProps()}
                  className="relative aspect-video rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <input {...getBackgroundInput()} />
                  {backgroundImage ? (
                    <img
                      src={backgroundImage}
                      alt="Background"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-gray-500">
                        Drop background image here
                      </p>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Background Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Content Section */}
          <div className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="text-xl"
                onBlur={() => setIsEditingEmail(false)}
                autoFocus
              />

            {/* Icon Image */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    {...getIconProps()}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <input {...getIconInput()} />
                    {iconImage ? (
                      <img
                        src={iconImage}
                        alt="Icon"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}

export { ContactCard }
export type { ContactCardProps }
