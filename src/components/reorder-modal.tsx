import { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GripVertical } from 'lucide-react'

interface ReorderModalProps {
  isOpen: boolean
  onClose: () => void
  cards: { id: string; title: string }[]
  onSave: (newOrder: string[]) => void
}

function ReorderModal({ isOpen, onClose, cards, onSave }: ReorderModalProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const sortableRef = useRef<Sortable | null>(null)
  const [tempCards, setTempCards] = useState(cards)

  useEffect(() => {
    setTempCards(cards)
  }, [cards])

  useEffect(() => {
    if (listRef.current && isOpen) {
      sortableRef.current = new Sortable(listRef.current, {
        animation: 150,
        handle: ".handle",
        onEnd: (evt) => {
          const cardsArray = [...tempCards]
          const movedItem = cardsArray[evt.oldIndex!]
          cardsArray.splice(evt.oldIndex!, 1)
          cardsArray.splice(evt.newIndex!, 0, movedItem)
          setTempCards(cardsArray)
        }
      })
    }

    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy()
        sortableRef.current = null
      }
    }
  }, [isOpen, tempCards])

  const handleSave = () => {
    if (listRef.current) {
      const newOrder = Array.from(listRef.current.children).map(item => item.id)
      onSave(newOrder)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reorder Cards</DialogTitle>
        </DialogHeader>
        <ul ref={listRef} className="my-6 space-y-2">
          {cards.map((card) => (
            <li
              key={card.id}
              id={card.id}
              className="flex items-center p-2 bg-secondary rounded-md cursor-move"
            >
              <GripVertical className="handle mr-2 h-5 w-5 text-gray-500" />
              <span className="flex-grow">{card.title}</span>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ReorderModal }

