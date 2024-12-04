import { useState, useEffect, useRef } from "react"
import { AboutCard } from "@/components/cards/about"
import { ReorderModal } from "@/components/reorder-modal"
import { AddButton } from "../add-button"
import axios from 'axios'
import { DataURIToBlob } from '@/lib/utils'
import { useAuth } from "@/hooks/useAuth"

interface AboutData {
  id: string | number
  sort_id: number
  title: string
  paragraph_1: string
  paragraph_2: string
  paragraph_3: string
  image_url: string | null
}

const API_URL = import.meta.env.VITE_API_URL + '/about'

function AboutPage() {
  const { token } = useAuth()
  const [aboutSections, setAboutSections] = useState<AboutData[]>([])
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false)
  const submitRef = useRef<(() => void) | null>(null)

  const fetchAllSections = async () => {
    try {
      const response = await axios.get<AboutData[]>(API_URL)
      setAboutSections(response.data)
    } catch (error) {
      console.error('Error fetching about sections:', error)
    }
  }

  useEffect(() => {
    fetchAllSections()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      await fetchAllSections()
    } catch (error) {
      console.error('Error deleting about section:', error)
    }
  }

  const handleReorder = () => {
    setIsReorderModalOpen(true)
  }

  const handleSaveReorder = async (newOrder: string[]) => {
    try {
      const reorderData = newOrder.map((id, index) => ({
        id: id,
        sort_id: index + 1
      }))

      await axios.patch(`${API_URL}/reorder`, reorderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      await fetchAllSections()
      setIsReorderModalOpen(false)
    } catch (error) {
      console.error('Error saving new order:', error)
    }
  }

  const handleAddSection = () => {
    const lastId = aboutSections.length > 0 
      ? parseInt(aboutSections[aboutSections.length - 1].id.toString())
      : 0
    const newId = (lastId + 1)

    const newSection: AboutData = {
      id: '1000',
      sort_id: newId,
      title: 'New About Section',
      paragraph_1: 'Enter first paragraph here...',
      paragraph_2: 'Enter second paragraph here...',
      paragraph_3: 'Enter third paragraph here...',
      image: null
    }
    setAboutSections([...aboutSections, newSection])
  }

  const handleSubmit = async (sectionData: {
    id: string,
    title: string,
    paragraph1: string,
    paragraph2: string,
    paragraph3: string,
    image: string,
  }) => {
    try {
      const formData = new FormData()
      formData.append('title', sectionData.title)
      formData.append('paragraph_1', sectionData.paragraph1)
      formData.append('paragraph_2', sectionData.paragraph2)
      formData.append('paragraph_3', sectionData.paragraph3)

      if (sectionData.image && sectionData.image !== '/placeholder.svg') {
        if (sectionData.image.startsWith('data:image/png;base64,')) {
          const imageBlob = DataURIToBlob(sectionData.image)
          formData.append('image', imageBlob, 'image.png')
        } else {
          const imageBlob = await fetch(sectionData.image).then(r => r.blob())
          formData.append('image', imageBlob, 'image.png')
        }
      }

      if (sectionData.id === '1000') {
        await axios({
          method: 'post',
          url: API_URL,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        await axios({
          method: 'put',
          url: `${API_URL}/${sectionData.id}`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      await fetchAllSections()
    } catch (error) {
      console.error('Error submitting about section:', error)
      throw error
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {aboutSections.map((section) => (
        <AboutCard
          key={section.id}
          submitRef={submitRef}
          id={section.id.toString()}
          sortId={section.sort_id}
          defaultTitle={section.title}
          defaultParagraph1={section.paragraph_1}
          defaultParagraph2={section.paragraph_2}
          defaultParagraph3={section.paragraph_3}
          defaultImage={section.image_url || '/placeholder.svg'}
          onDelete={handleDelete}
          onReorder={handleReorder}
          onSubmit={handleSubmit}
        />
      ))}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={aboutSections.map(section => ({
          id: section.id.toString(),
          sort_id: section.sort_id,
          title: section.title,
        }))}
        onSave={handleSaveReorder}
      />
      <AddButton onAdd={handleAddSection} label="Add New Section" />
    </div>
  )
}

export { AboutPage, type AboutData }
