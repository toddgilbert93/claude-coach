"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThinkingBlock({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            isOpen && "rotate-90"
          )}
        />
        <span>Thinking</span>
      </button>
      {isOpen && (
        <div className="mt-2 pl-5 text-sm text-muted-foreground italic leading-relaxed">
          {content}
        </div>
      )}
    </div>
  )
}
