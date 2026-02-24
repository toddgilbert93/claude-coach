"use client"

import { useState } from "react"
import { X, Pencil, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SelectionOption {
  label: string
  clickable: boolean
}

interface SelectionPromptProps {
  question: string
  options: SelectionOption[]
  onSelect: (optionIndex: number) => void
  onSkip?: () => void
  showOpenResponse?: boolean
  openResponsePlaceholder?: string
  className?: string
}

export function SelectionPrompt({
  question,
  options,
  onSelect,
  onSkip,
  showOpenResponse = true,
  openResponsePlaceholder = "Something else",
  className,
}: SelectionPromptProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [openValue, setOpenValue] = useState("")

  const handleSubmitOpen = () => {
    if (openValue.trim()) {
      onSelect(-1) // -1 could mean "open response" if we use it; for mock we don't advance on it
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm text-card-foreground",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-sm font-medium text-foreground flex-1 pt-0.5">
          {question}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-0.5">
        {options.map((opt, index) => {
          const isClickable = opt.clickable
          const isHovered = hoveredIndex === index
          const isSelected = isHovered && isClickable

          return (
            <button
              key={index}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                isClickable
                  ? "cursor-pointer hover:bg-accent/50"
                  : "cursor-default opacity-80",
                isSelected && "bg-accent/70"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium",
                  "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span className="flex-1">{opt.label}</span>
              {isSelected && isClickable && (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </button>
          )
        })}

        {showOpenResponse && (
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1 flex items-center">
              <Pencil className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={openValue}
                onChange={(e) => setOpenValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitOpen()}
                placeholder={openResponsePlaceholder}
                className="pl-9 bg-muted/30 border-muted-foreground/20"
                disabled
                aria-hidden
              />
            </div>
            {onSkip && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground shrink-0"
                onClick={onSkip}
              >
                Skip
              </Button>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        ↑↓ to navigate · Enter to select · Esc to skip
      </p>
    </div>
  )
}
