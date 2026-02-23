"use client"

import { Message } from "@/lib/types"
import { MarkdownRenderer } from "./markdown-renderer"
import { ThinkingBlock } from "./thinking-block"
import { Copy, RotateCcw, ThumbsUp, ThumbsDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ChatMessage({ message }: { message: Message }) {
  const [hovering, setHovering] = useState(false)
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-user-bubble text-user-bubble-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[85%]">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="mb-6 max-w-[85%]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {message.thinking && <ThinkingBlock content={message.thinking} />}
      {message.searchedWeb && (
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <span>Searched the web</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
      <MarkdownRenderer content={message.content} />

      {/* Message actions */}
      <div
        className={`flex items-center gap-0.5 mt-2 transition-opacity ${
          hovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
