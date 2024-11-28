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
        axios.get<{ id: string, email: string }[]>(API_URL_email),
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
        // Find background_image and logo for this email
        const backgroundImage = mediaData.find(m => m.label === 'background_image')?.image || null;
        const logo = mediaData.find(m => m.label === 'logo')?.image || null;

        return {
          id: emailData.id,
          email: emailData.email,
          background_image: backgroundImage,
          logo: logo
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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });
      await fetchAllContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  }

  const handleAddContact = () => {
    const lastId = contacts.length > 0 
      ? parseInt(contacts[contacts.length - 1].id.toString())
      : 0;
    const newId = (lastId + 1);

    const newContact: ContactData = {
      id: '1000',
      email: 'example@email.com',
      background_image: null,
      logo: null
    };
    setContacts([...contacts, newContact]);
  };

  const handleSubmit = async (contactData: {
    id: string,
    email: string,
    backgroundImage: string,
    iconImage: string
  }) => {
    try {
      // Find current contact data to compare changes
      const currentContact = contacts.find(c => c.id.toString() === contactData.id);
      
      // Check if email has changed
      const hasEmailChanged = currentContact && currentContact.email !== contactData.email;
      // Check if images have changed (excluding placeholder)
      const hasBackgroundChanged = contactData.backgroundImage !== '/placeholder.svg' && 
        contactData.backgroundImage !== `data:image/png;base64,${currentContact?.background_image}`;
      const hasLogoChanged = contactData.iconImage !== '/placeholder.svg' && 
        contactData.iconImage !== `data:image/png;base64,${currentContact?.logo}`;

      // Only send email request if it's a new contact or email has changed
      if (contactData.id === '1000' || hasEmailChanged) {
        await axios({
          method: contactData.id === '1000' ? 'post' : 'put',
          url: contactData.id === '1000' ? API_URL_email : `${API_URL_email}/${contactData.id}`,
          data: {
            email: contactData.email
          },
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
      }

      // Only send images request if any image has changed
      if (hasBackgroundChanged || hasLogoChanged) {
        const formData = new FormData();

        if (hasBackgroundChanged) {
          if (contactData.backgroundImage.startsWith('data:image')) {
            const backgroundImageBlob = DataURIToBlob(contactData.backgroundImage);
            formData.append('background-image', backgroundImageBlob);
          } else {
            const backgroundImageBlob = await fetch(contactData.backgroundImage).then(r => r.blob());
            formData.append('background-image', backgroundImageBlob);
          }
        }

        if (hasLogoChanged) {
          if (contactData.iconImage.startsWith('data:image')) {
            const iconImageBlob = DataURIToBlob(contactData.iconImage);
            formData.append('logo', iconImageBlob);
          } else {
            const iconImageBlob = await fetch(contactData.iconImage).then(r => r.blob());
            formData.append('logo', iconImageBlob);
          }
        }

        await axios({
          method: 'put',
          url: `${API_URL_images}/${contactData.id}`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
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
          defaultBackgroundImage={contact.background_image ? 
            `data:image/png;base64,${contact.background_image}` : 
            '/placeholder.svg'
          }
          defaultIconImage={contact.logo ? 
            `data:image/png;base64,${contact.logo}` : 
            '/placeholder.svg'
          }
          onDelete={handleDelete}
          onSubmit={handleSubmit}
        />
      ))}
      <AddButton onAdd={handleAddContact} label="Add New Contact" />
    </div>
  )
}
