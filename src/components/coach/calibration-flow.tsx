"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { CALIBRATION_STEPS, type CalibrationStep } from "./calibration-data"
import { SelectionPrompt } from "./selection-prompt"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"

const TYPING_MS_PER_CHAR = 25
const POST_TYPING_DELAY_MS = 800
const LOADING_DELAY_MS = 1600

interface CalibrationFlowProps {
  onComplete: () => void
}

function LoadingShimmer() {
  return (
    <div className="max-w-[85%] py-2">
      <span className="text-sm text-muted-foreground animate-text-shimmer">
        Thinking...
      </span>
    </div>
  )
}

export function CalibrationFlow({ onComplete }: CalibrationFlowProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [history, setHistory] = useState<{ role: "assistant" | "user"; content: string }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [autoFillVisible, setAutoFillVisible] = useState(false)
  const [autoFillDone, setAutoFillDone] = useState(false)

  const step = CALIBRATION_STEPS[stepIndex] as CalibrationStep | undefined
  const isAutoFillStep = step?.type === "autoFill"
  const isMarkdownCloseStep = step?.type === "markdownClose"

  // Scroll to bottom when step or history changes
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [stepIndex, history, autoFillVisible, isLoading])

  // Clear loading after delay
  useEffect(() => {
    if (!isLoading) return
    const t = setTimeout(() => setIsLoading(false), LOADING_DELAY_MS)
    return () => clearTimeout(t)
  }, [isLoading])

  // Step 5: trigger auto-fill typing after AI message is shown
  useEffect(() => {
    if (!step || step.type !== "autoFill") return
    const t = setTimeout(() => setAutoFillVisible(true), 400)
    return () => clearTimeout(t)
  }, [stepIndex, step?.type])

  const advanceStep = useCallback(
    (userResponse: string, currentStep: CalibrationStep, showLoading = true) => {
      const aiContent =
        currentStep.type === "selection" || currentStep.type === "autoFill"
          ? currentStep.aiMessage
          : ""
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: aiContent },
        { role: "user", content: userResponse },
      ])
      setStepIndex((i) => i + 1)
      setAutoFillVisible(false)
      setAutoFillDone(false)
      if (showLoading) setIsLoading(true)
    },
    []
  )

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (!step || step.type !== "selection") return
      const label = step.options[optionIndex]?.label ?? ""
      advanceStep(label, step, true)
    },
    [advanceStep, step]
  )

  useEffect(() => {
    if (step?.type === "markdownClose") {
      onComplete()
    }
  }, [step?.type, onComplete])

  // Auto-fill typing effect for step 5
  const autoFillStep = step?.type === "autoFill" ? step : null
  const [typedLength, setTypedLength] = useState(0)
  useEffect(() => {
    if (!autoFillStep || !autoFillVisible) return
    const text = autoFillStep.autoFillText
    if (typedLength >= text.length) {
      const t = setTimeout(() => {
        advanceStep(text, autoFillStep, true)
        setTypedLength(0)
        setAutoFillDone(true)
      }, POST_TYPING_DELAY_MS)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTypedLength((n) => n + 1), TYPING_MS_PER_CHAR)
    return () => clearTimeout(t)
  }, [autoFillStep, autoFillVisible, typedLength, advanceStep])

  if (!step) return null

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6"
      >
        {/* Past messages from history (we only push to history when we advance, so current step's AI message is not in history yet) */}
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

        {/* Loading state before next message */}
        {isLoading && (
          <LoadingShimmer />
        )}

        {/* Current step: assistant message (hidden while loading) */}
        {!isLoading && step.type !== "markdownClose" && (
          <div className="max-w-[85%]">
            <MessageContent content={step.aiMessage} />
          </div>
        )}

        {/* Current step: selection UI */}
        {!isLoading && step.type === "selection" && (
          <div className="max-w-lg">
            <SelectionPrompt
              question={step.promptHeading ?? step.aiMessage}
              options={step.options}
              onSelect={handleSelect}
              showOpenResponse={step.showOpenResponse ?? false}
            />
          </div>
        )}

        {/* Auto-fill user bubble (typing) */}
        {!isLoading && step.type === "autoFill" && autoFillVisible && (
          <div className="flex justify-end">
            <div className="bg-user-bubble text-user-bubble-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[85%]">
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {autoFillStep!.autoFillText.slice(0, typedLength)}
                {typedLength < autoFillStep!.autoFillText.length && (
                  <span className="animate-pulse">|</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Markdown close */}
        {!isLoading && step.type === "markdownClose" && (
          <div className="max-w-[85%]">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <MarkdownRenderer content={step.markdown} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
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
