import './App.css'
import { Gallery } from '@/components/Gallery'
import { AllGames } from './components/AllGames'

function App() {

  return (
    <div className="flex flex-col gap-4">
      <AllGames />
      <Gallery />
    </div>
  )
}

export default App
