import { useState, useEffect } from "react"
import { GameCard } from "@/components/game-card"
import { ReorderModal } from "@/components/reorder-modal"
import { AddGameButton } from "./add-game-button"
import axios from 'axios'

interface GameData {
  id: string | number;
  title: string;
  description_1: string;
  description_2: string;
  image_main: string | null;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
}

function GamePage() {
  const [games, setGames] = useState<GameData[]>([]);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL + '/games';
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

  useEffect(() => {
    fetchAllGames();
  }, []);

  const fetchAllGames = async () => {
    try {
      const response = await axios.get<GameData[]>(API_URL);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

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

  const handleSaveReorder = (newOrder: string[]) => {
    const reorderedGames = newOrder.map(id => games.find(game => game.id.toString() === id)!)
    setGames(reorderedGames)
  }

  const handleAddGame = () => {
    const lastId = games.length > 0 
      ? parseInt(games[games.length - 1].id.toString())
      : 0;
    const newId = (lastId + 1).toString();

    const newGame: GameData = {
      id: newId,
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

  const handleGameCreated = (gameData: GameData) => {
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameData.id ? gameData : game
      )
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id.toString()}
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
          onGameCreated={handleGameCreated}
          isNewGame={!isNaN(Number(game.id)) && Number(game.id) >= games.length}
        />
      ))}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={games.map(game => ({ id: game.id.toString(), title: game.title }))}
        onSave={handleSaveReorder}
      />
      <AddGameButton onAddGame={handleAddGame} />
    </div>
  )
}

export { GamePage, type GameData }