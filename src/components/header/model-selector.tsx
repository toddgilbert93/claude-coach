"use client"

import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/hooks/use-chat-store"
import { MODELS } from "@/lib/types"

export function ModelSelector() {
  const { selectedModel, setModel } = useChatStore()

  const current = MODELS.find((m) => m.id === selectedModel)!

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span>{current.shortName}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => setModel(model.id)}
            className={
              model.id === selectedModel ? "bg-accent" : ""
            }
          >
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
