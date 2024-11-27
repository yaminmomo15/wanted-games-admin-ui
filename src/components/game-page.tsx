import { useState, useEffect, useRef } from "react"
import { GameCard } from "@/components/game-card"
import { ReorderModal } from "@/components/reorder-modal"
import { AddGameButton } from "./add-game-button"
import axios from 'axios'
import { DataURIToBlob } from '@/lib/utils'
interface GameData {
  id: string | number;
  sort_id: number;
  title: string;
  description_1: string;
  description_2: string;
  image_main: string | null;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
}

interface NewGameData {
  title: string;
  description_1: string;
  description_2: string;
  image_main: string | null;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
}

const API_URL = import.meta.env.VITE_API_URL + '/games';
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

function GamePage() {
  const [games, setGames] = useState<GameData[]>([]);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const submitRef = useRef<(() => void) | null>(null);
  
  // games.map(game => console.log(`game id${game.id}, ${game.sort_id}`))
  const fetchAllGames = async () => {
    try {
      const response = await axios.get<GameData[]>(API_URL);
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
          'Authorization': `Bearer ${AUTH_TOKEN}`
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
          'Authorization': `Bearer ${AUTH_TOKEN}`,
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
      image_main: null,
      image_1: null,
      image_2: null,
      image_3: null
    };
    setGames([...games, newGame]);
  };

  const handleSubmit = async (gameData: {
    id: string,
    title: string,
    description1: string,
    description2: string,
    mainImage: string,
    smallImages: string[]
  }) => {
    try {
      const formData = new FormData();
      formData.append('title', gameData.title);
      formData.append('description_1', gameData.description1);
      formData.append('description_2', gameData.description2);

      if (gameData.mainImage && gameData.mainImage !== '/placeholder.svg') {
        if (gameData.mainImage.startsWith('data:image/png;base64,')) {
          const mainImageBlob = DataURIToBlob(gameData.mainImage);
          formData.append('image_main', mainImageBlob);
        } else {
          const mainImageBlob = await fetch(gameData.mainImage).then(r => r.blob());
          formData.append('image_main', mainImageBlob);
        }
      }

      for (let i = 0; i < gameData.smallImages.length; i++) {
        if (gameData.smallImages[i] && gameData.smallImages[i] !== '/placeholder.svg') {
          if (gameData.smallImages[i].startsWith('data:image/png;base64,')) {
            const smallImageBlob = DataURIToBlob(gameData.smallImages[i]);
            formData.append(`image_${i + 1}`, smallImageBlob);
          } else {
            const smallImageBlob = await fetch(gameData.smallImages[i]).then(r => r.blob());
            formData.append(`image_${i + 1}`, smallImageBlob);
          }
        }
      }
      
      if (gameData.id === '1000') {
        await axios({
          method: 'post',
          url: API_URL,
          data: formData,
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
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
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        await fetchAllGames();
      }

      console.log(`Game updated successfully`);
    } catch (error) {
      console.error('Error submitting game:', error);
      throw error; // Re-throw to let GameCard handle the error state
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
          defaultImage={game.image_main ? `data:image/png;base64,${game.image_main}` : '/placeholder.svg'}
          defaultSmallImages={[
            game.image_1 ? `data:image/png;base64,${game.image_1}` : '/placeholder.svg',
            game.image_2 ? `data:image/png;base64,${game.image_2}` : '/placeholder.svg',
            game.image_3 ? `data:image/png;base64,${game.image_3}` : '/placeholder.svg'
          ]}
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
      <AddGameButton onAddGame={handleAddGame} />
    </div>
  )
}

export { GamePage, type GameData }