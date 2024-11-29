import { useState, useEffect, useRef } from "react"
import { ContactCard } from "@/components/cards/contact"
import { AddButton } from "../add-button"
import axios from 'axios'
import { DataURIToBlob } from '@/lib/utils'


interface ContactData {
  id: string | number;
  email: string;
  background_image: string | null;
  logo: string | null;
}

const API_URL_email = import.meta.env.VITE_API_URL + '/email';
const API_URL_images = import.meta.env.VITE_API_URL + '/media';
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

export function ContactPage() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const submitRef = useRef<(() => void) | null>(null);
  
  const fetchAllContacts = async () => {
    try {
      // Fetch both email and media data in parallel
      const [emailResponse, mediaResponse] = await Promise.all([
        axios.get<{ id: string, address: string }[]>(API_URL_email),
        axios.get<{ id: string, label: string, image: string }[]>(API_URL_images)
      ]);

      // Parse and validate media data
      const mediaData = mediaResponse.data;
      if (!Array.isArray(mediaData)) {
        console.error('Media data is not an array:', mediaData);
        return;
      }

      // Combine the data from both endpoints
      const combinedContacts = emailResponse.data.map(emailData => {
        return {
          id: emailData.id,
          email: emailData.address,
          background_image: mediaData[0].image,  // First image (background_image)
          logo: mediaData[1].image              // Second image (logo)
        };
      });

      setContacts(combinedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);


  const handleSubmit = async (contactData: {
    id: string,
    email: string,
    background_image: string,
    logo: string
  }) => {
    try {
      // Add debug logging
      console.log('contactData received:', contactData);
      
      // Send email request
      await axios({
        method: 'put',
        url: `${API_URL_email}/${contactData.id}`,
        data: {
          address: contactData.email
        },
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      // Handle images separately
      const imagesToUpload = [
        { id: 1, label: 'background_image', image: contactData.background_image },
        { id: 2, label: 'logo', image: contactData.logo }
      ];
      
      console.log('imagesToUpload array:', imagesToUpload);
      
      for (const imageData of imagesToUpload) {
        if (!imageData) {
          console.error('imageData is undefined in loop');
          continue;
        }
        
        if (imageData.image && imageData.image !== '/placeholder.svg') {
          const formData = new FormData();
          
          let imageBlob;
          if (imageData.image.startsWith('data:image/png;base64,')) {
            imageBlob = DataURIToBlob(imageData.image);
          } else {
            imageBlob = await fetch(imageData.image).then(r => r.blob());
          }
          
          formData.append('image', imageBlob);
          formData.append('label', imageData.label);

          console.log(`Uploading ${imageData.label} image`);
          console.log(`${API_URL_images}`);
          await axios({
            method: 'put',
            url: `${API_URL_images}?q=${encodeURIComponent(imageData.label)}`,
            data: formData,
            headers: {
              'Authorization': `Bearer ${AUTH_TOKEN}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      }

      await fetchAllContacts();
      console.log(`Contact updated successfully`);
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          submitRef={submitRef}
          id={contact.id.toString()}
          defaultEmail={contact.email}
          defaultBackgroundImage={contact.background_image ? 
            `data:image/png;base64,${contact.background_image}` : 
            '/placeholder.svg'
          }
          defaultIconImage={contact.logo ? 
            `data:image/png;base64,${contact.logo}` : 
            '/placeholder.svg'
          }  
          onSubmit={handleSubmit}
        />
      ))}
    </div>
  )
}
