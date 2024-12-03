import { useState, useEffect, useRef } from "react"
import { GameCard } from "@/components/cards/game"
import { ReorderModal } from "@/components/reorder-modal"
import { AddButton } from "../add-button"
import axios from 'axios'
import { useAuth } from "@/hooks/useAuth"

interface GameData {
  id: string | number;
  sort_id: number;
  title: string;
  description_1: string;
  description_2: string;
  image_main_url: string | null;
  image_1_url: string | null;
  image_2_url: string | null;
  image_3_url: string | null;
  background_color: string;
  text_color: string;
  url: string;
}

interface NewGameData {
  title: string;
  description_1: string;
  description_2: string;
  image_main: string | null;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
  background_color: string;
  text_color: string;
  url: string;
}

const API_URL = import.meta.env.VITE_API_URL + '/games';

function GamePage() {
  const { token } = useAuth()
  const [games, setGames] = useState<GameData[]>([]);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const submitRef = useRef<(() => void) | null>(null);
  
  const fetchAllGames = async () => {
    try {
      const response = await axios.get<GameData[]>(API_URL);
      console.log(response.data)
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchAllGames();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchAllGames(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  }

  const handleReorder = () => {
    setIsReorderModalOpen(true)
  }

  const handleSaveReorder = async (newOrder: string[]) => {
    try {
      // Create the reorder payload
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

      // Refresh the games list to get the updated order
      await fetchAllGames();
      setIsReorderModalOpen(false);
    } catch (error) {
      console.error('Error saving new order:', error);
    }
  };

  const handleAddGame = () => {
    const lastId = games.length > 0 
      ? parseInt(games[games.length - 1].id.toString())
      : 0;
    const newId = (lastId + 1);

    const newGame: GameData = {
      id: '1000',
      sort_id: newId,
      title: 'New Game Title',
      description_1: 'Enter first description here...',
      description_2: 'Enter second description here...',
      url: 'https://example.com',
      image_main_url: null,
      image_1_url: null,
      image_2_url: null,
      image_3_url: null,
      background_color: '#ffffff',
      text_color: '#000000'
    };
    setGames([...games, newGame]);
  };

  const handleSubmit = async (gameData: {
    id: string,
    title: string,
    description1: string,
    description2: string,
    url: string,
    mainImage: string,
    smallImages: string[],
    backgroundColor: string,
    textColor: string
  }) => {
    try {
      const formData = new FormData();
      formData.append('title', gameData.title);
      formData.append('description_1', gameData.description1);
      formData.append('description_2', gameData.description2);
      formData.append('url', gameData.url);
      formData.append('background_color', gameData.backgroundColor);
      formData.append('text_color', gameData.textColor);

      if (gameData.mainImage && gameData.mainImage !== '/placeholder.svg') {
        const mainImageBlob = await fetch(gameData.mainImage).then(r => r.blob());
        formData.append('image_main', mainImageBlob, 'image_main.png');
      }

      for (let i = 0; i < gameData.smallImages.length; i++) {
        if (gameData.smallImages[i] && gameData.smallImages[i] !== '/placeholder.svg') {
          const smallImageBlob = await fetch(gameData.smallImages[i]).then(r => r.blob());
          formData.append(`image_${i + 1}`, smallImageBlob, `image_${i + 1}.png`);
        }
      }
      
      if (gameData.id === '1000') {
        await axios({
          method: 'post',
          url: API_URL,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        await fetchAllGames();
      } else {
        await axios({
          method: 'put',
          url: `${API_URL}/${gameData.id}`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        await fetchAllGames();
      }
  
      console.log(`Game updated successfully`);
    } catch (error) {
      console.error('Error submitting game:', error);
      throw error;
    }
  }

  // const triggerSubmit = () => {
  //   submitRef.current?.();
  // }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {games.map((game) => (
        <GameCard
          key={game.id}
          submitRef={submitRef}
          id={game.id.toString()}
          sortId={game.sort_id}
          defaultTitle={game.title}
          defaultDescription1={game.description_1}
          defaultDescription2={game.description_2}
          defaultImage={game.image_main_url || '/placeholder.svg'}
          defaultSmallImages={[
            game.image_1_url || '/placeholder.svg',
            game.image_2_url || '/placeholder.svg',
            game.image_3_url || '/placeholder.svg'
          ]}
          defaultBackgroundColor={game.background_color}
          defaultTextColor={game.text_color}
          defaultUrl={game.url}
          onDelete={handleDelete}
          onReorder={handleReorder}
          onSubmit={handleSubmit}
        />
      ))}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={games.map(game => ({ id: game.id.toString(), sort_id: game.sort_id, title: game.title,  }))}
        onSave={handleSaveReorder}
      />
      <AddButton onAdd={handleAddGame} label="Add New Game" />
    </div>
  )
}

export { GamePage, type GameData }