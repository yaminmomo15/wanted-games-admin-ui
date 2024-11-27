import { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GripVertical } from 'lucide-react'

interface ReorderModalProps {
  isOpen: boolean
  onClose: () => void
  cards: { id: string; sort_id: number; title: string }[]
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
        draggable: "li",
        onEnd: (evt) => {
          if (evt.oldIndex === undefined || evt.newIndex === undefined) return;
          
          const newCards = [...tempCards];
          const [movedItem] = newCards.splice(evt.oldIndex, 1);
          newCards.splice(evt.newIndex, 0, movedItem);
          
          newCards.forEach((card, index) => {
            card.sort_id = index;
          });
          
          setTempCards(newCards);
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
    if (!listRef.current) return;
    
    const newOrder = tempCards.map(card => card.id);
    onSave(newOrder);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reorder Cards</DialogTitle>
        </DialogHeader>
        <ul ref={listRef} className="my-6 space-y-2">
          {tempCards.map((card) => (
            <li
              key={card.id}
              id={card.id}
              className="flex items-center p-2 bg-secondary rounded-md cursor-move select-none"
            >
              <GripVertical className="handle mr-2 h-5 w-5 text-gray-500 cursor-grab" />
              <span className="flex-grow">{card.title}</span>
              <span className="text-sm text-gray-500">({card.sort_id})</span>
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

