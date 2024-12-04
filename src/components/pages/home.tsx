import { useState, useEffect, useRef } from "react"
import { HomeCard } from "@/components/cards/home"
import { ReorderModal } from "@/components/reorder-modal"
import { AddButton } from "../add-button"
import axios from 'axios'
import { DataURIToBlob } from '@/lib/utils'
import { useAuth } from "@/hooks/useAuth"

interface HomeData {
  id: string | number;
  sort_id: number;
  header: string;
  paragraph_1: string;
  paragraph_2: string;
  action: string;
  image_url: string | null;
}

const API_URL = import.meta.env.VITE_API_URL + '/home';

export function HomePage() {
  const { token } = useAuth()
  const [homeContent, setHomeContent] = useState<HomeData[]>([]);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const submitRef = useRef<(() => void) | null>(null);
  
  const fetchAllContent = async () => {
    try {
      const response = await axios.get<HomeData[]>(API_URL);
      setHomeContent(response.data);
    } catch (error) {
      console.error('Error fetching home content:', error);
    }
  };

  useEffect(() => {
    fetchAllContent();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchAllContent();
    } catch (error) {
      console.error('Error deleting content:', error);
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
      }));

      await axios.patch(`${API_URL}/reorder`, reorderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchAllContent();
      setIsReorderModalOpen(false);
    } catch (error) {
      console.error('Error saving new order:', error);
    }
  };

  const handleAddContent = () => {
    const lastId = homeContent.length > 0 
      ? parseInt(homeContent[homeContent.length - 1].id.toString())
      : 0;
    const newId = (lastId + 1);

    const newContent: HomeData = {
      id: '1000',
      sort_id: newId,
      header: '',
      paragraph_1: '',
      paragraph_2: '',
      action: '',
      image_url: null
    };
    setHomeContent([...homeContent, newContent]);
  };

  const handleSubmit = async (contentData: {
    id: string,
    header: string,
    paragraph1: string,
    paragraph2: string,
    action: string,
    image: string
  }) => {
    try {
      const formData = new FormData();
      formData.append('header', contentData.header);
      formData.append('paragraph_1', contentData.paragraph1);
      formData.append('paragraph_2', contentData.paragraph2);
      formData.append('action', contentData.action);

      const currentContent = homeContent.find(content => content.id.toString() === contentData.id);
      const isImageChanged = currentContent && contentData.image !== currentContent.image_url;
      const isNewContent = contentData.id === '1000';
      
      if ((isImageChanged || isNewContent) && contentData.image !== '/placeholder.svg') {
        const imageBlob = await fetch(contentData.image).then(r => r.blob());
        formData.append('image', imageBlob, 'image.png');
      }
      
      if (contentData.id === '1000') {
        await axios({
          method: 'post',
          url: API_URL,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios({
          method: 'put',
          url: `${API_URL}/${contentData.id}`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      await fetchAllContent();
    } catch (error) {
      console.error('Error submitting content:', error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {homeContent.map((content) => (
        <HomeCard
          key={content.id}
          submitRef={submitRef}
          id={content.id.toString()}
          sortId={content.sort_id}
          defaultHeader={content.header}
          defaultParagraph1={content.paragraph_1}
          defaultParagraph2={content.paragraph_2}
          defaultAction={content.action}
          defaultImage={content.image_url || '/placeholder.svg'}
          onDelete={handleDelete}
          onReorder={handleReorder}
          onSubmit={handleSubmit}
        />
      ))}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={homeContent.map(content => ({ 
          id: content.id.toString(), 
          sort_id: content.sort_id, 
          title: `Home ${content.id}` 
        }))}
        onSave={handleSaveReorder}
      />
      <AddButton onAdd={handleAddContent} label="Add New Content" />
    </div>
  )
}

export type { HomeData }
