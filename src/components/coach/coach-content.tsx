"use client"

import { SlidersHorizontal, Eye, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalibrationFlow } from "./calibration-flow"
import { TransparencyFlow } from "./transparency-flow"
import { FeedbackFlow } from "./feedback-flow"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import { CALIBRATION_STEPS } from "./calibration-data"
import {
  TRANSPARENCY_REPORT,
  TRANSPARENCY_WHY_MARKDOWN,
} from "./transparency-data"
import { FEEDBACK_FOLLOW_UP_MESSAGES } from "./feedback-data"
import type { CompletedSession } from "@/app/page"

const SECTIONS: Record<
  string,
  { icon: typeof SlidersHorizontal; title: string; description: string }
> = {
  Calibration: {
    icon: SlidersHorizontal,
    title: "Calibration",
    description: "Weekly updates that help AI adapt to you.",
  },
  Transparency: {
    icon: Eye,
    title: "Transparency",
    description:
      "Understand how AI views your conversations and its blindspots.",
  },
  Feedback: {
    icon: AlertTriangle,
    title: "Feedback",
    description:
      "Report when the AI got something wrong and what impact it had. A short follow-up helps both of you understand what happened.",
  },
}

function MessageContent({ content }: { content: string }) {
  const hasMarkdown = content.includes("**") || content.includes("\n- ")
  return (
    <div className="prose-claude font-serif text-[15px] leading-relaxed">
      {hasMarkdown ? (
        <MarkdownRenderer content={content} />
      ) : (
        <p className="whitespace-pre-wrap">{content}</p>
      )}
    </div>
  )
}

function ZeroState({
  sectionKey,
  isCompleted,
  onAction,
  actionLabel,
}: {
  sectionKey: string
  isCompleted: boolean
  onAction: () => void
  actionLabel: string
}) {
  const section = SECTIONS[sectionKey]
  if (!section) return null
  const Icon = section.icon

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {section.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {section.description}
        </p>
        {!isCompleted && (
          <Button onClick={onAction} className="mt-2">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

function CalibrationCompletedView() {
  const history: { role: "assistant" | "user"; content: string }[] = []
  for (const step of CALIBRATION_STEPS) {
    if (step.type === "selection") {
      history.push({ role: "assistant", content: step.aiMessage })
      const chosen = step.options[step.clickableIndex]
      history.push({ role: "user", content: chosen?.label ?? "" })
    } else if (step.type === "autoFill") {
      history.push({ role: "assistant", content: step.aiMessage })
      history.push({ role: "user", content: step.autoFillText })
    }
  }

  const closeStep = CALIBRATION_STEPS.find((s) => s.type === "markdownClose")
  const closeMarkdown =
    closeStep?.type === "markdownClose" ? closeStep.markdown : ""

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
        {history.map((msg, i) => (
          <div key={i}>
            {msg.role === "assistant" ? (
              <div className="max-w-[85%]">
                <MessageContent content={msg.content} />
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="bg-user-bubble text-user-bubble-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[85%]">
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        {closeMarkdown && (
          <div className="max-w-[85%]">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <MarkdownRenderer content={closeMarkdown} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TransparencyCompletedView() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
        <div className="max-w-[85%]">
          <div className="prose-claude font-serif text-[15px] leading-relaxed">
            <MarkdownRenderer content={TRANSPARENCY_REPORT} />
          </div>
        </div>
        <div className="max-w-[85%]">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <MarkdownRenderer content={TRANSPARENCY_WHY_MARKDOWN} />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedbackCompletedView() {
  const ai1 = FEEDBACK_FOLLOW_UP_MESSAGES[0]!.content
  const userMsg = FEEDBACK_FOLLOW_UP_MESSAGES[1]!.content
  const ai2 = FEEDBACK_FOLLOW_UP_MESSAGES[2]!.content

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
        <p className="text-sm text-muted-foreground max-w-[85%]">
          Thanks. Here&apos;s a short follow-up so we can both understand what
          happened.
        </p>

        <div className="max-w-[85%]">
          <MessageContent content={ai1} />
        </div>

        <div className="flex justify-end">
          <div className="bg-user-bubble text-user-bubble-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[85%]">
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {userMsg}
            </p>
          </div>
        </div>

        <div className="max-w-[85%]">
          <MessageContent content={ai2} />
        </div>
      </div>
    </div>
  )
}

export function CoachContent({
  activeSection,
  calibrationSession,
  onCalibrationStart,
  onCalibrationComplete,
  transparencySession,
  onTransparencyStart,
  onTransparencyComplete,
  feedbackSession,
  onFeedbackStart,
  onFeedbackComplete,
  viewingCompletedSession,
  completedSessions,
}: {
  activeSection: string
  calibrationSession: { startedAt: Date } | null
  onCalibrationStart: () => void
  onCalibrationComplete: () => void
  transparencySession: { startedAt: Date } | null
  onTransparencyStart: () => void
  onTransparencyComplete: () => void
  feedbackSession: { startedAt: Date } | null
  onFeedbackStart: () => void
  onFeedbackComplete: () => void
  viewingCompletedSession: CompletedSession | null
  completedSessions: CompletedSession[]
}) {
  const section = SECTIONS[activeSection]
  if (!section) return null

  if (viewingCompletedSession) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        {viewingCompletedSession.type === "Calibration" && (
          <CalibrationCompletedView />
        )}
        {viewingCompletedSession.type === "Transparency" && (
          <TransparencyCompletedView />
        )}
        {viewingCompletedSession.type === "Feedback" && (
          <FeedbackCompletedView />
        )}
      </div>
    )
  }

  const calibrationCompleted = completedSessions.some(
    (s) => s.type === "Calibration"
  )
  const transparencyCompleted = completedSessions.some(
    (s) => s.type === "Transparency"
  )
  const feedbackCompleted = completedSessions.some(
    (s) => s.type === "Feedback"
  )

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {calibrationSession && (
        <div
          className={
            activeSection === "Calibration"
              ? "flex-1 flex flex-col min-h-0"
              : "hidden"
          }
        >
          <CalibrationFlow onComplete={onCalibrationComplete} />
        </div>
      )}
      {transparencySession && (
        <div
          className={
            activeSection === "Transparency"
              ? "flex-1 flex flex-col min-h-0"
              : "hidden"
          }
        >
          <TransparencyFlow onComplete={onTransparencyComplete} />
        </div>
      )}
      {feedbackSession && (
        <div
          className={
            activeSection === "Feedback"
              ? "flex-1 flex flex-col min-h-0"
              : "hidden"
          }
        >
          <FeedbackFlow onComplete={onFeedbackComplete} />
        </div>
      )}
      {activeSection === "Calibration" && !calibrationSession && (
        <ZeroState
          sectionKey="Calibration"
          isCompleted={calibrationCompleted}
          onAction={onCalibrationStart}
          actionLabel="Begin calibration"
        />
      )}
      {activeSection === "Transparency" && !transparencySession && (
        <ZeroState
          sectionKey="Transparency"
          isCompleted={transparencyCompleted}
          onAction={onTransparencyStart}
          actionLabel="View transparency report"
        />
      )}
      {activeSection === "Feedback" && !feedbackSession && (
        <ZeroState
          sectionKey="Feedback"
          isCompleted={feedbackCompleted}
          onAction={onFeedbackStart}
          actionLabel="Add feedback"
        />
      )}
    </div>
  )
}
