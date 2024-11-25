import './App.css'
import { GamePage } from './components/game-page'
import { AddGameButton } from './components/add-game-button'
function App() {

  return (
    <div className="flex flex-col gap-4">
      <GamePage />
    </div>
  )
}

export default App
