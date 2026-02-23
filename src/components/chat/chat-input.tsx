"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { ArrowUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModelSelector } from "@/components/header/model-selector"
import { useChatStore } from "@/hooks/use-chat-store"

export function ChatInput() {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage } = useChatStore()

  const adjustHeight = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px"
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setValue("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="px-4 pb-3 pt-2">
      <div className="border border-border rounded-2xl bg-card">
        {/* Textarea */}
        <div className="px-4 pt-3 pb-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reply..."
            rows={1}
            className="w-full bg-transparent text-foreground text-[15px] placeholder:text-muted-foreground resize-none focus:outline-none leading-relaxed"
          />
        </div>

        {/* Bottom bar: +, model selector, send */}
        <div className="flex items-center justify-between px-3 pb-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <ModelSelector />
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="h-8 w-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-[var(--claude-accent)] text-white hover:brightness-110"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted-foreground mt-2">
        Claude is AI and can make mistakes. Please double-check responses.
      </p>
    </div>
  )
}
