"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { TopBar, ConversationHeader } from "@/components/header/top-bar"
import { ChatArea } from "@/components/chat/chat-area"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div
      className="h-screen w-screen flex items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/desktop.jpg')" }}
    >
      {/* App window */}
      <div className="flex flex-col w-full max-w-[1000px] h-[calc(100vh-64px)] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50">
        {/* Top bar — full width, like a native title bar */}
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Content: sidebar + main */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div
            className={cn(
              "shrink-0 border-r border-sidebar-border transition-all duration-200 overflow-hidden",
              sidebarOpen ? "w-[300px]" : "w-0"
            )}
          >
            <AppSidebar />
          </div>

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            <ConversationHeader />
            <div className="flex-1 overflow-hidden">
              <ChatArea />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
