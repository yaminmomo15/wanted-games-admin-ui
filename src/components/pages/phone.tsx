import { useState, useEffect, useRef } from "react"
import { PhoneCard } from "@/components/cards/phone"
import { ReorderModal } from "@/components/reorder-modal"
import { AddButton } from "../add-button"
import axios from 'axios'
import { DataURIToBlob } from "@/lib/utils"

interface PhoneData {
  id: string | number;
  sort_id: number;
  image: string | null;
  number: string;
}

const API_URL = import.meta.env.VITE_API_URL + '/phone';
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

function PhonePage() {
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
          'Authorization': `Bearer ${AUTH_TOKEN}`
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
          'Authorization': `Bearer ${AUTH_TOKEN}`,
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
    const lastId = phones.length > 0 
      ? parseInt(phones[phones.length - 1].id.toString())
      : 0;
    const newId = (lastId + 1);

    const newPhone: PhoneData = {
      id: '1000',
      sort_id: newId,
      image: null,
      number: ''
    };
    setPhones([...phones, newPhone]);
  };

  const handleSubmit = async (phoneData: {
    id: string,
    image: string,
    number: string
  }) => {
    try {
      const formData = new FormData();
      formData.append('number', phoneData.number);

      // Handle image upload
      if (phoneData.image && phoneData.image !== '/placeholder.svg') {
        if (phoneData.image.startsWith('data:image/')) {
          const iconImageBlob = DataURIToBlob(phoneData.image);
          formData.append('image', iconImageBlob);
        } else {
          const iconImageBlob = await fetch(phoneData.image).then(r => r.blob());
          formData.append('image', iconImageBlob);
        }
      }
      
      if (phoneData.id === '1000') {
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
          url: `${API_URL}/${phoneData.id}`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      await fetchAllPhones();
      console.log(`Phone number updated successfully`);
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
        cards={phones.map(phone => ({ 
          id: phone.id.toString(), 
          sort_id: phone.sort_id, 
          title: `Phone ${phone.id}`
        }))}
        onSave={handleSaveReorder}
      />
      <AddButton onAdd={handleAddPhone} label="Add New Phone Number" />
    </div>
  )
}

export { PhonePage, type PhoneData }
