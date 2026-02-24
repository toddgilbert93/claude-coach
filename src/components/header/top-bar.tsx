"use client"

import {
  PanelLeft,
  ArrowLeft,
  ArrowRight,
  Users,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useChatStore } from "@/hooks/use-chat-store"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const TABS = ["Chat", "Cowork", "Code", "Coach"] as const

function useIsNarrow() {
  const [isNarrow, setIsNarrow] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 780px)")
    const handler = () => setIsNarrow(mql.matches)
    handler()
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])
  return isNarrow
}

export function TopBar({
  onToggleSidebar,
  sidebarOpen,
  onGoBack,
  onGoForward,
  canGoBack,
  canGoForward,
}: {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  onGoBack?: () => void
  onGoForward?: () => void
  canGoBack?: boolean
  canGoForward?: boolean
}) {
  const [activeTab, setActiveTab] = useState<string>("Coach")
  const isNarrow = useIsNarrow()

  return (
    <div className="relative flex items-center h-12 px-3 bg-sidebar border-b border-sidebar-border shrink-0">
      {/* Left: macOS traffic lights + sidebar toggle + nav arrows */}
      <div className="relative z-10 flex items-center gap-0.5 pr-4 bg-sidebar">
        <TrafficLights />
        <div className="w-3 shrink-0" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onToggleSidebar}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-muted-foreground hover:text-foreground",
            !canGoBack && "opacity-40 pointer-events-none"
          )}
          onClick={onGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-muted-foreground hover:text-foreground",
            !canGoForward && "opacity-40 pointer-events-none"
          )}
          onClick={onGoForward}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Center: tab group — absolutely positioned for true centering */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isNarrow && (
          <div className="flex items-center bg-secondary/60 rounded-lg p-0.5 pointer-events-auto">
            {TABS.map((tab) => {
              const isCoach = tab === "Coach"
              const tabButton = (
                <button
                  key={tab}
                  onClick={isCoach ? () => setActiveTab(tab) : undefined}
                  className={cn(
                    "px-4 py-1 text-sm font-medium rounded-md transition-colors",
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground",
                    !isCoach && "cursor-default"
                  )}
                >
                  {tab}
                </button>
              )

              if (isCoach) return tabButton

              return (
                <Tooltip key={tab} delayDuration={200}>
                  <TooltipTrigger asChild>{tabButton}</TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs"
                  >
                    Only coach is available for this prototype.
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )}
      </div>

      {/* Right: nav dropdown when narrow + Users icon — elevated so center can't overlap */}
      <div className="flex-1" />
      <div className="relative z-10 flex items-center gap-6 pl-4 bg-sidebar">
        {isNarrow && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 gap-1.5 px-3 text-sm font-medium bg-secondary/60 hover:bg-secondary/80 rounded-lg"
              >
                <span>{activeTab}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {TABS.map((tab) => (
                <DropdownMenuItem
                  key={tab}
                  onClick={() => tab === "Coach" && setActiveTab(tab)}
                  className={cn(
                    activeTab === tab && "bg-accent",
                    tab !== "Coach" && "opacity-60 cursor-default"
                  )}
                >
                  {tab}
                  {tab !== "Coach" && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Soon
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Users className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function TrafficLights() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex items-center gap-2 px-2 shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Close */}
      <div className="relative h-3 w-3 rounded-full bg-[#ff5f57] flex items-center justify-center cursor-default group">
        {hovered && (
          <svg width="6" height="6" viewBox="0 0 6 6" className="text-[#4a0002]">
            <path d="M0.5 0.5L5.5 5.5M5.5 0.5L0.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {/* Minimize */}
      <div className="relative h-3 w-3 rounded-full bg-[#febc2e] flex items-center justify-center cursor-default group">
        {hovered && (
          <svg width="6" height="2" viewBox="0 0 6 2" className="text-[#5f4a00]">
            <path d="M0.5 1H5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {/* Maximize */}
      <div className="relative h-3 w-3 rounded-full bg-[#28c840] flex items-center justify-center cursor-default group">
        {hovered && (
          <svg width="6" height="6" viewBox="0 0 6 6" className="text-[#006500]">
            <path d="M0.75 3.5L2.5 5.25L5.25 0.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </div>
    </div>
  )
}

export function ConversationHeader() {
  const { conversations, activeConversationId } = useChatStore()

  const activeConvo = conversations.find(
    (c) => c.id === activeConversationId
  )

  if (!activeConvo) return null

  return (
    <div className="flex items-center justify-center py-2 shrink-0">
      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <span>{activeConvo.title}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
