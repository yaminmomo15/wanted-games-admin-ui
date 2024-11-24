import { useState, useEffect } from 'react'
import { Game } from './Game'
import axios from 'axios'

interface GameData {
  label: string;
  id: string | number,
  name: string,
  description_1: string,
  description_2: string,
  image_main: File | null,
  image_1: File | null,
  image_2: File | null,
  image_3: File | null
}

function AllGames() {
  const API_URL = 'http://localhost:3000/api/games';
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
  const [games, setGames] = useState<GameData[]>([]);

  useEffect(() => {
    fetchAllGames();
  }, []);

  const fetchAllGames = async () => {
    try {
      const response = await axios.get<GameData[]>(API_URL, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });
      
      // Sort games by label
      const sortedGames = response.data.sort((a, b) => 
        a.label.localeCompare(b.label)
      );
      
      setGames(sortedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  return (
    <div className="space-y-8">
      {games.map((game) => (
        <Game key={game.label} label={game.label} />
      ))}
    </div>
  );
}

export { AllGames }
