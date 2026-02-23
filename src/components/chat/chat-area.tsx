"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { useChatStore } from "@/hooks/use-chat-store"

export function ChatArea() {
  const { conversations, activeConversationId } = useChatStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeConvo = conversations.find(
    (c) => c.id === activeConversationId
  )

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeConvo?.messages.length])

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Scrollable messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {activeConvo?.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {activeConvo?.messages.length === 0 && (
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-muted-foreground text-lg">
                How can I help you today?
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Input pinned at bottom */}
      <div className="max-w-3xl mx-auto w-full shrink-0">
        <ChatInput />
      </div>
    </div>
  )
}
