"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import { SelectionPrompt } from "./selection-prompt"
import {
  FEEDBACK_FORM,
  FEEDBACK_FOLLOW_UP_MESSAGES,
  FEEDBACK_AUTOFILL,
} from "./feedback-data"

const BODY_TYPING_MS_PER_CHAR = 3
const POST_TYPING_DELAY_MS = 600
const LOADING_DELAY_MS = 1600

type Phase = "form" | "conversation"
type ConversationStep =
  | "loading1"
  | "typing1"
  | "selection"
  | "userBubble"
  | "loading2"
  | "typing2"
  | "done"

interface FeedbackFlowProps {
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

const AI1 = FEEDBACK_FOLLOW_UP_MESSAGES[0]!.content
const USER_MSG = FEEDBACK_FOLLOW_UP_MESSAGES[1]!.content
const AI2 = FEEDBACK_FOLLOW_UP_MESSAGES[2]!.content

export function FeedbackFlow({ onComplete }: FeedbackFlowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>("form")
  const [mistake, setMistake] = useState("")
  const [effect, setEffect] = useState("")
  const [formError, setFormError] = useState("")
  const [conversationStep, setConversationStep] =
    useState<ConversationStep>("loading1")
  const [typedLength, setTypedLength] = useState(0)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [phase, conversationStep, typedLength])

  // loading1 -> typing1
  useEffect(() => {
    if (phase !== "conversation" || conversationStep !== "loading1") return
    const t = setTimeout(() => {
      setConversationStep("typing1")
      setTypedLength(0)
    }, LOADING_DELAY_MS)
    return () => clearTimeout(t)
  }, [phase, conversationStep])

  // typing1: type out AI1, then -> selection
  useEffect(() => {
    if (phase !== "conversation" || conversationStep !== "typing1") return
    if (typedLength >= AI1.length) {
      const t = setTimeout(() => {
        setConversationStep("selection")
        setTypedLength(0)
      }, POST_TYPING_DELAY_MS)
      return () => clearTimeout(t)
    }
    const t = setTimeout(
      () => setTypedLength((n) => n + 1),
      BODY_TYPING_MS_PER_CHAR
    )
    return () => clearTimeout(t)
  }, [phase, conversationStep, typedLength])

  const handleSelection = useCallback(() => {
    setConversationStep("userBubble")
  }, [])

  // userBubble -> loading2 (brief pause so user sees their bubble)
  useEffect(() => {
    if (phase !== "conversation" || conversationStep !== "userBubble") return
    const t = setTimeout(() => {
      setConversationStep("loading2")
    }, 400)
    return () => clearTimeout(t)
  }, [phase, conversationStep])

  // loading2 -> typing2
  useEffect(() => {
    if (phase !== "conversation" || conversationStep !== "loading2") return
    const t = setTimeout(() => {
      setConversationStep("typing2")
      setTypedLength(0)
    }, LOADING_DELAY_MS)
    return () => clearTimeout(t)
  }, [phase, conversationStep])

  // typing2: type out AI2, then -> done (auto-complete)
  useEffect(() => {
    if (phase !== "conversation" || conversationStep !== "typing2") return
    if (typedLength >= AI2.length) {
      const t = setTimeout(() => {
        setConversationStep("done")
      }, POST_TYPING_DELAY_MS)
      return () => clearTimeout(t)
    }
    const t = setTimeout(
      () => setTypedLength((n) => n + 1),
      BODY_TYPING_MS_PER_CHAR
    )
    return () => clearTimeout(t)
  }, [phase, conversationStep, typedLength])

  useEffect(() => {
    if (conversationStep === "done") onComplete()
  }, [conversationStep, onComplete])

  const handleContinue = () => {
    const trimmed = mistake.trim()
    if (!trimmed) {
      setFormError("Please describe what the AI got wrong.")
      return
    }
    setFormError("")
    setPhase("conversation")
    setConversationStep("loading1")
    setTypedLength(0)
  }

  if (phase === "form") {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto min-h-0 p-6">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="feedback-mistake"
                className="block text-sm font-medium text-foreground"
              >
                {FEEDBACK_FORM.mistakeLabel}
              </label>
              <Textarea
                id="feedback-mistake"
                value={mistake}
                onChange={(e) => setMistake(e.target.value)}
                onFocus={() => {
                  if (!mistake.trim()) setMistake(FEEDBACK_AUTOFILL.mistake)
                }}
                placeholder={FEEDBACK_FORM.mistakePlaceholder}
                className="min-h-24 resize-y"
                aria-invalid={!!formError}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="feedback-effect"
                className="block text-sm font-medium text-foreground"
              >
                {FEEDBACK_FORM.effectLabel}
              </label>
              <Textarea
                id="feedback-effect"
                value={effect}
                onChange={(e) => setEffect(e.target.value)}
                onFocus={() => {
                  if (!effect.trim()) setEffect(FEEDBACK_AUTOFILL.effect)
                }}
                placeholder={FEEDBACK_FORM.effectPlaceholder}
                className="min-h-20 resize-y"
              />
            </div>
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
            <Button onClick={handleContinue}>{FEEDBACK_FORM.continueLabel}</Button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === "conversation") {
    const stepOrder: ConversationStep[] = [
      "loading1", "typing1", "selection", "userBubble", "loading2", "typing2", "done",
    ]
    const currentIdx = stepOrder.indexOf(conversationStep)
    const pastSelection = currentIdx > stepOrder.indexOf("selection")
    const ai1Typing = conversationStep === "typing1"
    const showAi1Full = currentIdx > stepOrder.indexOf("typing1")
    const ai2Typing = conversationStep === "typing2"
    const showAi2Full = conversationStep === "done"

    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6"
        >
          <p className="text-sm text-muted-foreground max-w-[85%]">
            Thanks. Here's a short follow-up so we can both understand what
            happened.
          </p>

          {conversationStep === "loading1" && <LoadingShimmer />}

          {(showAi1Full || ai1Typing) && (
            <div className="max-w-[85%]">
              <div className="prose-claude font-serif text-[15px] leading-relaxed">
                {showAi1Full ? (
                  <MessageContent content={AI1} />
                ) : (
                  <span className="whitespace-pre-wrap">
                    {AI1.slice(0, typedLength)}
                    {typedLength < AI1.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          )}

          {conversationStep === "selection" && (
            <div className="max-w-lg">
              <SelectionPrompt
                question="Does that distinction feel useful?"
                options={[
                  { label: USER_MSG, clickable: true },
                  { label: "Write a custom response", clickable: false },
                ]}
                onSelect={handleSelection}
                showOpenResponse={false}
              />
            </div>
          )}

          {pastSelection && (
            <div className="flex justify-end">
              <div className="bg-user-bubble text-user-bubble-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[85%]">
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {USER_MSG}
                </p>
              </div>
            </div>
          )}

          {conversationStep === "loading2" && <LoadingShimmer />}

          {(showAi2Full || ai2Typing) && (
            <div className="max-w-[85%]">
              <div className="prose-claude font-serif text-[15px] leading-relaxed">
                {showAi2Full ? (
                  <MessageContent content={AI2} />
                ) : (
                  <span className="whitespace-pre-wrap">
                    {AI2.slice(0, typedLength)}
                    {typedLength < AI2.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
