import './App.css'
import { Gallery } from '@/components/Gallery'
import { GameEditor } from '@/components/GameEditor'

function App() {

  return (
    <div className="flex flex-col gap-4">
      <GameEditor />
      <Gallery />
    </div>
  )
}

export default App
