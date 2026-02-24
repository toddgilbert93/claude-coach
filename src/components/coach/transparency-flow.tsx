"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { SelectionPrompt } from "./selection-prompt"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import {
  TRANSPARENCY_REPORT,
  TRANSPARENCY_REPORT_SEGMENTS,
  TRANSPARENCY_SELECTION_OPTIONS,
  TRANSPARENCY_WHY_MARKDOWN,
} from "./transparency-data"

const BODY_TYPING_MS_PER_CHAR = 3
const POST_TYPING_DELAY_MS = 600
const LOADING_DELAY_MS = 1600

type Phase = "loading" | "report" | "selection" | "loading2" | "close"

interface TransparencyFlowProps {
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

export function TransparencyFlow({ onComplete }: TransparencyFlowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>("loading")
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [bodyTypedLength, setBodyTypedLength] = useState(0)

  const segments = TRANSPARENCY_REPORT_SEGMENTS
  const isHeaderSegment = segmentIndex % 2 === 0
  const currentSegment = segments[segmentIndex] ?? ""
  const reportDone = segmentIndex >= segments.length

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [phase, segmentIndex, bodyTypedLength])

  // Initial loading -> report
  useEffect(() => {
    if (phase !== "loading") return
    const t = setTimeout(() => setPhase("report"), LOADING_DELAY_MS)
    return () => clearTimeout(t)
  }, [phase])

  // Headers: show instantly and advance to next segment
  useEffect(() => {
    if (phase !== "report" || !isHeaderSegment || reportDone) return
    const t = setTimeout(() => {
      setSegmentIndex((i) => i + 1)
      setBodyTypedLength(0)
    }, 0)
    return () => clearTimeout(t)
  }, [phase, segmentIndex, isHeaderSegment, reportDone])

  // Body: type at 8ms/char, then advance segment or go to selection
  useEffect(() => {
    if (phase !== "report" || isHeaderSegment || reportDone) return
    if (bodyTypedLength >= currentSegment.length) {
      const t = setTimeout(() => {
        if (segmentIndex + 1 >= segments.length) {
          setPhase("selection")
          setSegmentIndex(0)
          setBodyTypedLength(0)
        } else {
          setSegmentIndex((i) => i + 1)
          setBodyTypedLength(0)
        }
      }, POST_TYPING_DELAY_MS)
      return () => clearTimeout(t)
    }
    const t = setTimeout(
      () => setBodyTypedLength((n) => n + 1),
      BODY_TYPING_MS_PER_CHAR
    )
    return () => clearTimeout(t)
  }, [phase, segmentIndex, isHeaderSegment, bodyTypedLength, currentSegment.length, segments.length])

  const handleSelect = useCallback((optionIndex: number) => {
    if (optionIndex !== 2) return
    setPhase("loading2")
  }, [])

  // Second loading -> close
  useEffect(() => {
    if (phase !== "loading2") return
    const t = setTimeout(() => setPhase("close"), LOADING_DELAY_MS)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase === "close") onComplete()
  }, [phase, onComplete])

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6"
      >
        {phase === "loading" && <LoadingShimmer />}

        {phase === "report" && (() => {
          const completed = segments.slice(0, segmentIndex).join("")
          const current = segments[segmentIndex] ?? ""
          const isCurrentBody = segmentIndex % 2 === 1
          const currentDisplay = isCurrentBody
            ? current.slice(0, bodyTypedLength)
            : current
          const showCursor = isCurrentBody && bodyTypedLength < current.length
          const markdownContent = completed + (isCurrentBody ? "" : currentDisplay)
          const plainTail = isCurrentBody ? currentDisplay : ""
          return (
            <div className="max-w-[85%]">
              <div className="prose-claude font-serif text-[15px] leading-relaxed">
                {markdownContent.length > 0 && (
                  <MarkdownRenderer content={markdownContent} />
                )}
                {(plainTail.length > 0 || showCursor) && (
                  <span className="whitespace-pre-wrap">
                    {plainTail}
                    {showCursor && <span className="animate-pulse">|</span>}
                  </span>
                )}
              </div>
            </div>
          )
        })()}

        {phase === "selection" && (
          <>
            <div className="max-w-[85%]">
              <div className="prose-claude font-serif text-[15px] leading-relaxed">
                <MarkdownRenderer content={TRANSPARENCY_REPORT} />
              </div>
            </div>
            <div className="max-w-lg">
              <SelectionPrompt
                question="What would you like to do next?"
                options={TRANSPARENCY_SELECTION_OPTIONS}
                onSelect={handleSelect}
                showOpenResponse={false}
              />
            </div>
          </>
        )}

        {(phase === "loading2" || phase === "close") && (
          <>
            <div className="max-w-[85%]">
              <div className="prose-claude font-serif text-[15px] leading-relaxed">
                <MarkdownRenderer content={TRANSPARENCY_REPORT} />
              </div>
            </div>

            {phase === "loading2" && <LoadingShimmer />}

            {phase === "close" && (
              <div className="max-w-[85%]">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <MarkdownRenderer content={TRANSPARENCY_WHY_MARKDOWN} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
