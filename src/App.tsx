import './App.css'
import { Gallery } from '@/components/Gallery'
import { Game } from '@/components/Game'

function App() {

  return (
    <div className="flex flex-col gap-4">
      <Game />
      <Gallery />
    </div>
  )
}

export default App
