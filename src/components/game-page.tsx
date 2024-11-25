import { useState } from "react"
import { GameCard } from "@/components/game-card"
import { ReorderModal } from "@/components/reorder-modal"
import { AddGameButton } from "./add-game-button"

interface GameCardData {
  id: string
  title: string
  description1: string
  description2: string
  image: string
  smallImages: string[]
}

function GamePage() {
  const [cards, setCards] = useState<GameCardData[]>([
    {
      id: "1",
      title: "Koi-Koi",
      description1: "Koi-Koi is a traditional Japanese card game played with hanafuda cards, often accompanied by fine artwork.",
      description2: "The game is typically played between two players. The game consists of rounds, where players alternate taking cards to match ones on the table, forming sets based on seasonal themes.",
      image: "/placeholder.svg?height=400&width=400",
      smallImages: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100"
      ]
    },
    {
      id: "2",
      title: "Goblins vs Gnomes",
      description1: "Goblins vs Gnomes is a fast-paced, tactical board game where players control wacky goblin and gnome factions vying for dominance.",
      description2: "Each turn involves deploying units, gathering resources, and using unique abilities to outwit opponents.",
      image: "/placeholder.svg?height=400&width=400",
      smallImages: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100"
      ]
    }
  ])

  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false)

  const handleDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id))
  }

  const handleReorder = () => {
    setIsReorderModalOpen(true)
  }

  const handleSaveReorder = (newOrder: string[]) => {
    const reorderedCards = newOrder.map(id => cards.find(card => card.id === id)!)
    setCards(reorderedCards)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {cards.map((card) => (
        <GameCard
          key={card.id}
          id={card.id}
          defaultTitle={card.title}
          defaultDescription1={card.description1}
          defaultDescription2={card.description2}
          defaultImage={card.image}
          defaultSmallImages={card.smallImages}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      ))}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cards={cards.map(card => ({ id: card.id, title: card.title }))}
        onSave={handleSaveReorder}
      />
	  <AddGameButton />
    </div>
  )
}

export { GamePage }