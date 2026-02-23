"use client"

import { ThemeProvider } from "next-themes"
import { ChatProvider } from "@/hooks/use-chat-store"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ChatProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ChatProvider>
    </ThemeProvider>
  )
}
