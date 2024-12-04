import { useState, useEffect, useRef } from "react"
import { SocialCard } from "@/components/cards/social"
import { ReorderModal } from "@/components/reorder-modal"
import { AddButton } from "../add-button"
import axios from 'axios'
import { DataURIToBlob } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

interface SocialData {
  id: string | number;
  sort_id: number;
  image_url: string | null;
  url: string;
}

const API_URL = import.meta.env.VITE_API_URL + '/social';

function SocialPage() {
  const { token } = useAuth()
  const [socials, setSocials] = useState<SocialData[]>([]);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const submitRef = useRef<(() => void) | null>(null);

  const fetchAllSocials = async () => {
    try {
      const response = await axios.get<SocialData[]>(API_URL);
      setSocials(response.data);
    } catch (error) {
      console.error('Error fetching socials:', error);
    }
  };

  useEffect(() => {
    fetchAllSocials();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchAllSocials();
    } catch (error) {
      console.error('Error deleting social:', error);
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

      await fetchAllSocials();
      setIsReorderModalOpen(false);
    } catch (error) {
      console.error('Error saving new order:', error);
    }
  };

  const handleAddSocial = () => {
    const newSocial: SocialData = {
      id: '1000',
      sort_id: socials.length + 1,
      image: null,
      url: 'https://'
    };
    setSocials([...socials, newSocial]);
  };

  const handleSubmit = async (data: {
    id: string,
    image: string,
    url: string
  }) => {
    try {
      const formData = new FormData();
      formData.append('url', data.url);

      if (data.image && data.image !== '/placeholder.svg') {
        if (data.image.startsWith('data:image/png;base64,')) {
          const imageBlob = DataURIToBlob(data.image);
          formData.append('image', imageBlob, 'image.png');
        } else {
          const imageBlob = await fetch(data.image).then(r => r.blob());
          formData.append('image', imageBlob, 'image.png');
        }
      }

      if (data.id === '1000') {
        await axios.post(API_URL, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.put(`${API_URL}/${data.id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      await fetchAllSocials();
    } catch (error) {
      console.error('Error submitting social:', error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {socials.map((social) => (
        <SocialCard
          key={social.id}
          submitRef={submitRef}
          id={social.id.toString()}
          sortId={social.sort_id}
          defaultImage={social.image_url || '/placeholder.svg'}
          defaultUrl={social.url}
          onDelete={handleDelete}
          onReorder={handleReorder}
          onSubmit={handleSubmit}
        />
      ))}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={socials.map(social => ({ id: social.id.toString(), sort_id: social.sort_id }))}
        onSave={handleSaveReorder}
      />
      <AddButton onAdd={handleAddSocial} label="Add New Social Link" />
    </div>
  )
}

export { SocialPage }
