import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Trash } from 'lucide-react'
import axios from 'axios'
import { DataURIToBlob } from '@/lib/utils'

// Define interfaces for type safety
interface GameContent {
  id: string | number,
  label: string,
  name: string,
  description_1: string,
  description_2: string,
  image_main: File | null,
  image_1: File | null,
  image_2: File | null,
  image_3: File | null
}

// Add Props interface
interface GameProps {
  label: string;
}

// Update function signature
function Game({ label }: GameProps) {
  // API base URL
  const API_URL = 'http://localhost:3000/api/games';
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

  const [mainImage, setMainImage] = useState<string>('');
  const [icon1, setIcon1] = useState<string>('');
  const [icon2, setIcon2] = useState<string>('');
  const [icon3, setIcon3] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description1, setDescription1] = useState<string>('');
  const [description2, setDescription2] = useState<string>('');


  useEffect(() => {
    fetchGame()
  }, []);

  const fetchGame = async (): Promise<void> => {
    try {
      const response = await axios.get<GameContent>(`${API_URL}/search?q=${label}`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      })
      setName(response.data.name);
      setDescription1(response.data.description_1);
      setDescription2(response.data.description_2);
      setMainImage(response.data.image_main ? `data:image/png;base64,${response.data.image_main}` : '');
      setIcon1(response.data.image_1 ? `data:image/png;base64,${response.data.image_1}` : '');
      setIcon2(response.data.image_2 ? `data:image/png;base64,${response.data.image_2}` : '');
      setIcon3(response.data.image_3 ? `data:image/png;base64,${response.data.image_3}` : '');
    } catch (error) {
      console.error('Error fetching game:', error);
    }
  }

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
          setMainImage(reader.result as string)
        } else if (key === 'icons' && typeof index === 'number') {
          if (index === 0) {
            setIcon1(reader.result as string)
          } else if (index === 1) {
            setIcon2(reader.result as string)
          } else {
            setIcon3(reader.result as string)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('label', label);
      formData.append('name', name);
      formData.append('description_1', description1);
      formData.append('description_2', description2);

      // Convert base64 strings to Blob/File objects before appending

      if (mainImage) {
        const mainImageFile = DataURIToBlob(mainImage);
        formData.append('image_main', mainImageFile, 'image_main.png');
      }
      if (icon1) {
        const icon1Blob = DataURIToBlob(icon1);
        formData.append('image_1', icon1Blob, 'image_1.png');
      }
      if (icon2) {
        const icon2Blob = DataURIToBlob(icon2);
        formData.append('image_2', icon2Blob, 'image_2.png');
      }
      if (icon3) {
        const icon3Blob = DataURIToBlob(icon3);
        formData.append('image_3', icon3Blob, 'image_3.png');
      }

      await axios.put(`${API_URL}?q=${label}`, formData, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Game updated successfully');
    } catch (error) {
      console.error('Error submitting game:', error);
    }
  }

  return (
    <div className="min-h-screen w-4/6 mx-auto bg-white p-8">
      <div className="bg-amber-50 p-6 rounded-xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Input
              value={label}
              readOnly
              className="w-[480px] text-lg font-semibold text-amber-800 bg-amber-50 border-amber-200"
            />
            <div className="flex space-x-2">
              <Button className="bg-amber-600 text-white hover:bg-amber-700" onClick={handleSubmit}>
                Submit
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700">
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <div
                className="relative w-[480px] h-[480px] rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-amber-200"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, 'mainImage')}
              >
                <img
                  src={mainImage}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-4xl font-bold mb-4 text-amber-800 bg-amber-50 border-amber-200"
                placeholder="Enter title"
              />

              <Textarea
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
                className="min-h-[100px] mb-4 text-amber-700 bg-amber-50 border-amber-200"
                placeholder="Enter main description"
              />

              <Textarea
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
                className="min-h-[100px] mb-8 text-amber-700 bg-amber-50 border-amber-200"
                placeholder="Enter secondary description"
              />

              <div className="flex justify-between">
                {[icon1, icon2, icon3].map((icon, index) => (
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
                      htmlFor={`icon-${index + 1}`}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </label>
                    <Input
                      type="file"
                      id={`icon-${index + 1}`}
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
    </div>
  )
}

export { Game }

