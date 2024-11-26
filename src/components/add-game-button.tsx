import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AddGameButtonProps {
  onAddGame: () => void;
}

function AddGameButton({ onAddGame }: AddGameButtonProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-10"
              onClick={onAddGame}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new game</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export { AddGameButton }