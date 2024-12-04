import { useState, useEffect, useRef } from "react"
import { ContactCard } from "@/components/cards/contact"
import axios from 'axios'
import { useAuth } from "@/hooks/useAuth"

interface ContactData {
  id: string | number;
  email: string;
  background_image: string | null;
  logo: string | null;
}

const API_URL_email = import.meta.env.VITE_API_URL + '/email';
const API_URL_images = import.meta.env.VITE_API_URL + '/media';

function ContactPage() {
  const { token } = useAuth()
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const submitRef = useRef<(() => void) | null>(null);

  const fetchAllContacts = async () => {
    try {
      // Fetch both email and media data in parallel
      const [emailResponse, mediaResponse] = await Promise.all([
        axios.get<{ id: string, address: string }[]>(API_URL_email),
        axios.get<{ id: string, label: string, image_url: string }[]>(API_URL_images)
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
          background_image: mediaData[0].image_url,  // First image (background_image)
          logo: mediaData[1].image_url              // Second image (logo)
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
      // Send email request
      await axios({
        method: 'put',
        url: `${API_URL_email}/${contactData.id}`,
        data: {
          address: contactData.email
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Get current contact data for comparison
      const currentContact = contacts.find(contact => contact.id.toString() === contactData.id);

      // Handle images separately
      const imagesToUpload = [
        { 
          label: 'background_image', 
          newImage: contactData.background_image,
          currentImage: currentContact?.background_image
        },
        { 
          label: 'logo', 
          newImage: contactData.logo,
          currentImage: currentContact?.logo
        }
      ];
      
      for (const imageData of imagesToUpload) {
        // Skip if no image or it's the placeholder
        if (!imageData.newImage || imageData.newImage === '/placeholder.svg') {
          continue;
        }

        // Skip if image hasn't changed
        if (imageData.newImage === imageData.currentImage) {
          continue;
        }

        const formData = new FormData();
        formData.append('label', imageData.label);
        
        const imageBlob = await fetch(imageData.newImage).then(r => r.blob());
        formData.append('image', imageBlob, 'image.png');

        await axios({
          method: 'put',
          url: `${API_URL_images}?q=${encodeURIComponent(imageData.label)}`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
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
          defaultBackgroundImage={contact.background_image || '/placeholder.svg'}
          defaultIconImage={contact.logo || '/placeholder.svg'}
          onSubmit={handleSubmit}
        />
      ))}
    </div>
  )
}

export { ContactPage }
