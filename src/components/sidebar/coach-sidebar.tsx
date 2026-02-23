"use client"

import {
  SlidersHorizontal,
  Eye,
  MessageCircle,
  Download,
  ChevronsUpDown,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { icon: SlidersHorizontal, label: "Calibration", alert: true },
  { icon: Eye, label: "Transparency" },
  { icon: MessageCircle, label: "Feedback" },
]

export function CoachSidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string
  onSectionChange: (section: string) => void
}) {

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Top section */}
      <div className="p-3 space-y-1">
        {/* Nav links */}
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === activeSection
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
                {item.alert && (
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

      {/* Recents label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-xs text-muted-foreground font-medium">
          Recents
        </span>
      </div>

      {/* Empty recents area */}
      <div className="flex-1 overflow-y-auto min-h-0 px-1.5">
        <div className="px-3 py-6 text-center">
          <p className="text-xs text-muted-foreground">No recent sessions</p>
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
