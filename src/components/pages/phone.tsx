import { useState, useEffect, useRef } from "react"
import { PhoneCard } from "@/components/cards/phone"
import { ReorderModal } from "@/components/reorder-modal"
import { AddButton } from "../add-button"
import axios from 'axios'
import { DataURIToBlob } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

interface PhoneData {
  id: string | number;
  sort_id: number;
  image: string | null;
  number: string;
}

const API_URL = import.meta.env.VITE_API_URL + '/phone';

function PhonePage() {
  const { token } = useAuth()
  const [phones, setPhones] = useState<PhoneData[]>([]);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const submitRef = useRef<(() => void) | null>(null);

  const fetchAllPhones = async () => {
    try {
      const response = await axios.get<PhoneData[]>(API_URL);
      setPhones(response.data);
    } catch (error) {
      console.error('Error fetching phones:', error);
    }
  };

  useEffect(() => {
    fetchAllPhones();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchAllPhones();
    } catch (error) {
      console.error('Error deleting phone:', error);
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

      await fetchAllPhones();
      setIsReorderModalOpen(false);
    } catch (error) {
      console.error('Error saving new order:', error);
    }
  };

  const handleAddPhone = () => {
    const newPhone: PhoneData = {
      id: '1000',
      sort_id: phones.length + 1,
      image: null,
      number: ''
    };
    setPhones([...phones, newPhone]);
  };

  const handleSubmit = async (data: {
    id: string,
    image: string,
    number: string
  }) => {
    try {
      const formData = new FormData();
      formData.append('number', data.number);

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

      await fetchAllPhones();
    } catch (error) {
      console.error('Error submitting phone:', error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {phones.map((phone) => (
        <PhoneCard
          key={phone.id}
          submitRef={submitRef}
          id={phone.id.toString()}
          sortId={phone.sort_id}
          defaultImage={phone.image ? `data:image/png;base64,${phone.image}` : '/placeholder.svg'}
          defaultNumber={phone.number}
          onDelete={handleDelete}
          onReorder={handleReorder}
          onSubmit={handleSubmit}
        />
      ))}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={phones.map(phone => ({ id: phone.id.toString(), sort_id: phone.sort_id }))}
        onSave={handleSaveReorder}
      />
      <AddButton onAdd={handleAddPhone} label="Add New Phone Number" />
    </div>
  )
}

export { PhonePage }
