export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  thinking?: string
  searchedWeb?: boolean
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
  starred: boolean
}

export type ModelId = "haiku-4.5" | "sonnet-4.5" | "opus-4.6"

export interface Model {
  id: ModelId
  name: string
  shortName: string
}

export const MODELS: Model[] = [
  { id: "haiku-4.5", name: "Claude 4.5 Haiku", shortName: "Haiku 4.5" },
  { id: "sonnet-4.5", name: "Claude 4.5 Sonnet", shortName: "Sonnet 4.5" },
  { id: "opus-4.6", name: "Claude Opus 4.6", shortName: "Opus 4.6" },
]
