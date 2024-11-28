import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AddButtonProps {
  onAdd: () => void;
  label?: string;
}

function AddButton({ onAdd, label = "Add New" }: AddButtonProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-10"
              onClick={onAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
export { AddButton }
