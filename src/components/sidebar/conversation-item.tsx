"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Conversation } from "@/lib/types"

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center w-full px-3 py-2 text-left text-sm rounded-lg transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
      )}
    >
      <span className="truncate flex-1">{conversation.title}</span>
      {isActive && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
    </button>
  )
}
