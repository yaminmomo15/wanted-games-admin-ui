import { useState} from "react"
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
import { Send, ArrowUpDown, Trash2, ImageIcon, Pencil } from 'lucide-react'
import axios from 'axios'

interface GameCardProps {
  id: string
  label: string
  defaultTitle?: string
  defaultDescription1?: string
  defaultDescription2?: string
  defaultImage?: string
  defaultSmallImages?: string[]
  onDelete: (id: string) => void
  onReorder: () => void
}

function GameCard({
  id,
  label,
  defaultTitle = "",
  defaultDescription1 = "",
  defaultDescription2 = "",
  defaultImage = "",
  defaultSmallImages = [],
  onDelete,
  onReorder
}: GameCardProps) {
  const [title, setTitle] = useState(defaultTitle)
  const [description1, setDescription1] = useState(defaultDescription1)
  const [description2, setDescription2] = useState(defaultDescription2)
  const [mainImage, setMainImage] = useState<string>(defaultImage)
  const [smallImages, setSmallImages] = useState<string[]>(defaultSmallImages)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDesc1, setIsEditingDesc1] = useState(false)
  const [isEditingDesc2, setIsEditingDesc2] = useState(false)

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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('label', label);
      formData.append('name', title);
      formData.append('description_1', description1);
      formData.append('description_2', description2);

      if (mainImage && !mainImage.startsWith('data:image/png;base64,')) {
        const mainImageBlob = await fetch(mainImage).then(r => r.blob());
        formData.append('image_main', mainImageBlob);
      }

      for (let i = 0; i < smallImages.length; i++) {
        if (smallImages[i] && !smallImages[i].startsWith('data:image/png;base64,')) {
          const smallImageBlob = await fetch(smallImages[i]).then(r => r.blob());
          formData.append(`image_${i + 1}`, smallImageBlob);
        }
      }

      const API_URL = 'http://localhost:3000/api/games';
      const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

      await axios.put(`${API_URL}?q=${label}`, formData, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Game updated successfully');
      setIsEditingTitle(false);
      setIsEditingDesc1(false);
      setIsEditingDesc2(false);
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
                {title || "Game Title"}
              </h2>
            )}

            {isEditingDesc1 ? (
              <Textarea
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
                placeholder="Enter first description"
                className="min-h-[100px]"
                onBlur={() => setIsEditingDesc1(false)}
                autoFocus
              />
            ) : (
              <p 
                className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setIsEditingDesc1(true)}
              >
                {description1 || "First description goes here"}
              </p>
            )}

            {isEditingDesc2 ? (
              <Textarea
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
                placeholder="Enter second description"
                className="min-h-[100px]"
                onBlur={() => setIsEditingDesc2(false)}
                autoFocus
              />
            ) : (
              <p 
                className="text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setIsEditingDesc2(true)}
              >
                {description2 || "Second description goes here"}
              </p>
            )}

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

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setIsEditingTitle(true)
                    setIsEditingDesc1(true)
                    setIsEditingDesc2(true)
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
                  onClick={handleSubmit}
                >
                  <Send className="h-4 w-4" />
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

export { GameCard }