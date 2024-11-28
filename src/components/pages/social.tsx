import { useState, useEffect, useRef } from "react"
import { SocialCard } from "@/components/cards/social"
import { ReorderModal } from "@/components/reorder-modal"
import { AddButton } from "../add-button"
import axios from 'axios'
import { DataURIToBlob } from "@/lib/utils"

interface SocialData {
  id: string | number;
  sort_id: number;
  image: string | null;
  url: string;
}

const API_URL = import.meta.env.VITE_API_URL + '/social';
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

function SocialPage() {
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
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });
      await fetchAllSocials(); // Refresh the list after deletion
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
          'Authorization': `Bearer ${AUTH_TOKEN}`,
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
    const lastId = socials.length > 0 
      ? parseInt(socials[socials.length - 1].id.toString())
      : 0;
    const newId = (lastId + 1);

    const newSocial: SocialData = {
      id: '1000',
      sort_id: newId,
      image: null,
      url: ''
    };
    setSocials([...socials, newSocial]);
  };

  const handleSubmit = async (socialData: {
    id: string,
    image: string,
    url: string
  }) => {
    try {
      const formData = new FormData();
      formData.append('url', socialData.url);

      // Handle image upload
      if (socialData.image && socialData.image !== '/placeholder.svg') {
        if (socialData.image.startsWith('data:image/')) {
          const iconImageBlob = DataURIToBlob(socialData.image);
          formData.append('image', iconImageBlob);
        } else {
          const iconImageBlob = await fetch(socialData.image).then(r => r.blob());
          formData.append('image', iconImageBlob);
        }
      }
      
      if (socialData.id === '1000') {
        await axios({
          method: 'post',
          url: API_URL,
          data: formData,
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios({
          method: 'put',
          url: `${API_URL}/${socialData.id}`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      await fetchAllSocials();
      console.log(`Social link updated successfully`);
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
          defaultImage={social.image ? `data:image/png;base64,${social.image}` : '/placeholder.svg'}
          defaultUrl={social.url}
          onDelete={handleDelete}
          onReorder={handleReorder}
          onSubmit={handleSubmit}
        />
      ))}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={socials.map(social => ({ 
          id: social.id.toString(), 
          sort_id: social.sort_id, 
          title: `Social ${social.id}` // Using icon as title in reorder modal
        }))}
        onSave={handleSaveReorder}
      />
      <AddButton onAdd={handleAddSocial} label="Add New Social Link" />
    </div>
  )
}

export { SocialPage, type SocialData }
