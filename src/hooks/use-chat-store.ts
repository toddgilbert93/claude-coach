"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { Conversation, ModelId, Message } from "@/lib/types"
import { mockConversations } from "@/lib/mock-data"
import React from "react"

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  selectedModel: ModelId
}

interface ChatActions {
  selectConversation: (id: string) => void
  createNewChat: () => void
  sendMessage: (content: string) => void
  setModel: (model: ModelId) => void
}

type ChatStore = ChatState & ChatActions

const ChatContext = createContext<ChatStore | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations)
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >("1")
  const [selectedModel, setSelectedModel] = useState<ModelId>("opus-4.6")

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id)
  }, [])

  const createNewChat = useCallback(() => {
    const newConvo: Conversation = {
      id: crypto.randomUUID(),
      title: "New conversation",
      messages: [],
      timestamp: new Date(),
      starred: false,
    }
    setConversations((prev) => [newConvo, ...prev])
    setActiveConversationId(newConvo.id)
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      if (!activeConversationId) return

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c

          const isNewConvo = c.messages.length === 0
          return {
            ...c,
            title: isNewConvo
              ? content.slice(0, 40) + (content.length > 40 ? "..." : "")
              : c.title,
            messages: [...c.messages, userMessage],
            timestamp: new Date(),
          }
        })
      )
    },
    [activeConversationId]
  )

  const setModel = useCallback((model: ModelId) => {
    setSelectedModel(model)
  }, [])

  const value: ChatStore = {
    conversations,
    activeConversationId,
    selectedModel,
    selectConversation,
    createNewChat,
    sendMessage,
    setModel,
  }

  return React.createElement(ChatContext.Provider, { value }, children)
}

export function useChatStore(): ChatStore {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChatStore must be used within ChatProvider")
  return ctx
}
