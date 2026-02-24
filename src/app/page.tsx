"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { CoachSidebar } from "@/components/sidebar/coach-sidebar"
import { TopBar } from "@/components/header/top-bar"
import { CoachContent } from "@/components/coach/coach-content"
import { cn } from "@/lib/utils"

export type CompletedSessionType = "Calibration" | "Transparency" | "Feedback"

export type CompletedSession = {
  type: CompletedSessionType
  completedAt: Date
}

type NavEntry = { section: string; completedIndex: number | null }

const INITIAL_NAV: NavEntry = { section: "Calibration", completedIndex: null }

type NavState = { history: NavEntry[]; cursor: number }

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [navState, setNavState] = useState<NavState>({
    history: [INITIAL_NAV],
    cursor: 0,
  })
  const [isNarrow, setIsNarrow] = useState(false)

  const currentEntry = navState.history[navState.cursor] ?? INITIAL_NAV
  const activeSection = currentEntry.section
  const viewingCompletedIndex = currentEntry.completedIndex

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 780px)")
    const handler = () => setIsNarrow(mql.matches)
    handler()
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    setSidebarOpen(!isNarrow)
  }, [isNarrow])
  const [calibrationSession, setCalibrationSession] = useState<{
    startedAt: Date
  } | null>(null)
  const [transparencySession, setTransparencySession] = useState<{
    startedAt: Date
  } | null>(null)
  const [feedbackSession, setFeedbackSession] = useState<{
    startedAt: Date
  } | null>(null)
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>(
    []
  )
  const [alerts, setAlerts] = useState<Record<string, boolean>>({
    Calibration: true,
    Transparency: true,
    Feedback: true,
  })
  const prevSectionRef = useRef(activeSection)
  useEffect(() => {
    const prev = prevSectionRef.current
    if (prev !== activeSection) {
      const isCompleted = completedSessions.some((s) => s.type === prev)
      if (isCompleted) {
        if (prev === "Calibration") setCalibrationSession(null)
        if (prev === "Transparency") setTransparencySession(null)
        if (prev === "Feedback") setFeedbackSession(null)
      }
      prevSectionRef.current = activeSection
    }
  }, [activeSection, completedSessions])

  const navigateTo = useCallback((section: string, completedIndex: number | null) => {
    setNavState((prev) => {
      const current = prev.history[prev.cursor]
      if (current?.section === section && current?.completedIndex === completedIndex) return prev
      const truncated = prev.history.slice(0, prev.cursor + 1)
      const newEntry = { section, completedIndex }
      return { history: [...truncated, newEntry], cursor: truncated.length }
    })
  }, [])

  const goBack = useCallback(() => {
    setNavState((prev) =>
      prev.cursor > 0 ? { ...prev, cursor: prev.cursor - 1 } : prev
    )
  }, [])

  const goForward = useCallback(() => {
    setNavState((prev) =>
      prev.cursor < prev.history.length - 1 ? { ...prev, cursor: prev.cursor + 1 } : prev
    )
  }, [])

  const canGoBack = navState.cursor > 0
  const canGoForward = navState.cursor < navState.history.length - 1

  const handleSectionChange = useCallback((section: string) => {
    navigateTo(section, null)
  }, [navigateTo])

  const handleCompletedClick = useCallback(
    (index: number) => {
      const session = completedSessions[index]
      if (session) navigateTo(session.type, index)
    },
    [completedSessions, navigateTo]
  )

  const viewingCompletedSession =
    viewingCompletedIndex !== null
      ? completedSessions[viewingCompletedIndex] ?? null
      : null

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
          onGoBack={goBack}
          onGoForward={goForward}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />

        {/* Content: sidebar + main */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div
            className={cn(
              "shrink-0 transition-all duration-200 overflow-hidden",
              isNarrow ? "w-0" : sidebarOpen ? "w-[300px] border-r border-sidebar-border" : "w-0"
            )}
          >
            <CoachSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              completedSessions={completedSessions}
              onCompletedClick={handleCompletedClick}
              alerts={alerts}
            />
          </div>

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            <CoachContent
              activeSection={activeSection}
              calibrationSession={calibrationSession}
              onCalibrationStart={() =>
                setCalibrationSession({ startedAt: new Date() })
              }
              onCalibrationComplete={() => {
                setAlerts((prev) => ({ ...prev, Calibration: false }))
                setCompletedSessions((prev) => [
                  ...prev,
                  { type: "Calibration", completedAt: new Date() },
                ])
              }}
              transparencySession={transparencySession}
              onTransparencyStart={() =>
                setTransparencySession({ startedAt: new Date() })
              }
              onTransparencyComplete={() => {
                setAlerts((prev) => ({ ...prev, Transparency: false }))
                setCompletedSessions((prev) => [
                  ...prev,
                  { type: "Transparency", completedAt: new Date() },
                ])
              }}
              feedbackSession={feedbackSession}
              onFeedbackStart={() =>
                setFeedbackSession({ startedAt: new Date() })
              }
              onFeedbackComplete={() => {
                setAlerts((prev) => ({ ...prev, Feedback: false }))
                setCompletedSessions((prev) => [
                  ...prev,
                  { type: "Feedback", completedAt: new Date() },
                ])
              }}
              viewingCompletedSession={viewingCompletedSession}
              completedSessions={completedSessions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
