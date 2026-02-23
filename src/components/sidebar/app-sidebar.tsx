"use client"

import {
  Plus,
  Search,
  MessageSquare,
  FolderOpen,
  LayoutGrid,
  Download,
  ChevronsUpDown,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ConversationItem } from "./conversation-item"
import { useChatStore } from "@/hooks/use-chat-store"

const NAV_ITEMS = [
  { icon: MessageSquare, label: "Chats" },
  { icon: FolderOpen, label: "Projects" },
  { icon: LayoutGrid, label: "Artifacts" },
]

export function AppSidebar() {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    createNewChat,
  } = useChatStore()

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Top section */}
      <div className="p-3 space-y-1">
        {/* New chat */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm font-normal h-9"
          onClick={createNewChat}
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>

        {/* Search */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm font-normal h-9 text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>

        {/* Nav links */}
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-2 text-sm font-normal h-9 text-muted-foreground hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Recents label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-xs text-muted-foreground font-medium">
          Recents
        </span>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto min-h-0 px-1.5">
        <div className="space-y-0.5 pb-3">
          {conversations.map((convo) => (
            <ConversationItem
              key={convo.id}
              conversation={convo}
              isActive={convo.id === activeConversationId}
              onClick={() => selectConversation(convo.id)}
            />
          ))}
        </div>
      </div>

      {/* User footer */}
      <Separator className="bg-sidebar-border" />
      <div className="p-3 flex items-center gap-2">
        <Avatar className="h-8 w-8 bg-sidebar-accent text-sidebar-accent-foreground">
          <AvatarFallback className="text-xs font-medium bg-sidebar-accent">
            TG
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Todd Gilbert</div>
          <div className="text-xs text-muted-foreground">Pro plan</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground"
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground"
        >
          <ChevronsUpDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
