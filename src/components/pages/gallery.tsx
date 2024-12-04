import { useState, useEffect, useRef } from "react"
import { GalleryCard } from "@/components/cards/gallery"
import { ReorderModal } from "@/components/reorder-modal"
import { AddButton } from "../add-button"
import axios from 'axios'
import { useAuth } from "@/hooks/useAuth"

interface GalleryItem {
  id: string | number;
  sort_id: number;
  image_url: string | null;
}

const API_URL = import.meta.env.VITE_API_URL + '/gallery';

export function GalleryPage() {
  const { token } = useAuth()
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const submitRef = useRef<(() => void) | null>(null);

  const fetchAllItems = async () => {
    try {
      const response = await axios.get<GalleryItem[]>(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchAllItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
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

      await fetchAllItems();
      setIsReorderModalOpen(false);
    } catch (error) {
      console.error('Error saving new order:', error);
    }
  };

  const handleAddImage = () => {
    const lastId = items.length > 0
      ? parseInt(items[items.length - 1].id.toString())
      : 0;
    const newId = (lastId + 1);

    const newItem: GalleryItem = {
      id: '1000',
      sort_id: newId,
      image_url: null
    };
    setItems([...items, newItem]);
  };

  const handleSubmit = async (data: {
    id: string,
    image: string,
  }) => {
    try {
      const formData = new FormData();

      const currentItem = items.find(item => item.id.toString() === data.id);
      const isImageChanged = currentItem && data.image !== currentItem.image_url;
      const isNewItem = data.id === '1000';

      if ((isImageChanged || isNewItem) && data.image !== '/placeholder.svg') {
        const imageBlob = await fetch(data.image).then(r => r.blob());
        formData.append('image', imageBlob);


        if (data.id === '1000') {
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
            url: `${API_URL}/${data.id}`,
            data: formData,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      }

      await fetchAllItems();
    } catch (error) {
      console.error('Error submitting gallery item:', error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <GalleryCard
            key={item.id}
            id={item.id.toString()}
            sortId={item.sort_id}
            defaultImage={item.image_url || '/placeholder.svg'}
            onDelete={handleDelete}
            onReorder={handleReorder}
            onSubmit={handleSubmit}
            submitRef={submitRef}
          />
        ))}
      </div>
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={items.map(item => ({
          id: item.id.toString(),
          sort_id: item.sort_id,
          title: `Image ${item.id}`
        }))}
        onSave={handleSaveReorder}
      />
      <AddButton onAdd={handleAddImage} label="Add New Image" />
    </div>
  )
}
