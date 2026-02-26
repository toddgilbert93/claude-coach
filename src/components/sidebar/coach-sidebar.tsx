"use client"

import {
  SlidersHorizontal,
  Eye,
  AlertTriangle,
  BarChart3,
  Globe,
  Linkedin,
  ChevronsUpDown,
  ExternalLink,
} from "lucide-react"
import type { CompletedSession } from "@/app/page"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { icon: SlidersHorizontal, label: "Calibration" },
  { icon: Eye, label: "Transparency" },
  { icon: AlertTriangle, label: "Feedback" },
  { icon: BarChart3, label: "Patterns" },
]

function formatCompletedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function CoachSidebar({
  activeSection,
  onSectionChange,
  completedSessions = [],
  onCompletedClick,
  alerts = {},
  activeCompletedIndex = null,
}: {
  activeSection: string
  onSectionChange: (section: string) => void
  completedSessions?: CompletedSession[]
  onCompletedClick?: (index: number) => void
  alerts?: Record<string, boolean>
  activeCompletedIndex?: number | null
}) {
  const viewingCompleted = activeCompletedIndex !== null

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Top section */}
      <div className="p-3 space-y-1">
        {/* Nav links */}
        {NAV_ITEMS.map((item) => {
          const isActive = !viewingCompleted && item.label === activeSection
          return (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => onSectionChange(item.label)}
              className={cn(
                "w-full justify-start gap-2 text-sm font-normal h-9",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="relative shrink-0">
                <item.icon className="h-4 w-4" />
                {alerts[item.label] && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-sky-400 ring-2 ring-sidebar"
                    aria-hidden
                  />
                )}
              </span>
              {item.label}
            </Button>
          )
        })}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Completed label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-xs text-muted-foreground font-medium">
          Completed
        </span>
      </div>

      {/* Completed list — only shows items after each flow is complete; clickable */}
      <div className="flex-1 overflow-y-auto min-h-0 px-1.5">
        {completedSessions.length > 0 ? (
          <div className="space-y-0.5 py-1">
            {completedSessions.map((session, index) => {
              const isActive = activeCompletedIndex === index
              return (
                <Button
                  key={`${session.type}-${session.completedAt.getTime()}-${index}`}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-normal h-9 px-3",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onCompletedClick?.(index)}
                >
                  {session.type} {formatCompletedDate(session.completedAt)}
                </Button>
              )
            })}
          </div>
        ) : (
          <div className="px-3 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              No completed sessions
            </p>
          </div>
        )}
      </div>

      {/* User footer */}
      <Separator className="bg-sidebar-border" />
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full p-3 flex items-center gap-2 hover:bg-sidebar-accent/50 transition-colors cursor-pointer text-left">
            <Avatar className="h-8 w-8 bg-sidebar-accent text-sidebar-accent-foreground">
              <AvatarFallback className="text-xs font-medium bg-sidebar-accent">
                TG
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Todd Gilbert</div>
              <div className="text-xs text-muted-foreground">Pro plan</div>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          className="p-0 rounded-xl"
          sideOffset={8}
          style={{
            width: "calc(var(--radix-popover-trigger-width) - 16px)",
          }}
        >
          <div className="px-4 py-3">
            <span className="text-sm text-muted-foreground">
              toddgilbert93@gmail.com
            </span>
          </div>
          <Separator />
          <div className="p-1.5">
            <a
              href="https://tgdesign.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <Globe className="h-4 w-4 shrink-0" />
              My website
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </a>
            <a
              href="https://www.linkedin.com/in/toddgilbertux/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <Linkedin className="h-4 w-4 shrink-0" />
              LinkedIn
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
