"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SelectionPrompt } from "./selection-prompt"
import {
  PATTERNS_OPENING_MESSAGE,
  PATTERNS_WHY_MARKDOWN,
  PATTERNS_END_OPTIONS,
  VERTICAL_SELECTION_OPTIONS,
  PUSHBACK_CHART_DATA,
  PUSHBACK_CHART_CONFIG,
  PUSHBACK_CHART_TITLE,
  PUSHBACK_CHART_CAPTION,
  PUSHBACK_PHRASES,
  PUSHBACK_TOPICS,
  PUSHBACK_FOLLOW_UP,
} from "./patterns-data"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

type Phase =
  | "prompt"
  | "loading1"
  | "chart"
  | "endSelection"
  | "loadingClose"
  | "close"

const LOADING_DELAY_MS = 1600

export interface PatternsFlowProps {
  onComplete: () => void
}

function LoadingShimmer() {
  return (
    <div className="py-2">
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

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-user-bubble text-user-bubble-foreground rounded-2xl rounded-br-md px-4 py-3">
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  )
}

export function PatternsFlow({ onComplete }: PatternsFlowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>("prompt")
  const [userSelectionLabel, setUserSelectionLabel] = useState("")
  const [endSelectionLabel, setEndSelectionLabel] = useState("")

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [phase])

  useEffect(() => {
    if (phase !== "loading1" && phase !== "loadingClose") return
    const next: Phase = phase === "loading1" ? "chart" : "close"
    const t = setTimeout(() => setPhase(next), LOADING_DELAY_MS)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== "chart") return
    const t = setTimeout(() => setPhase("endSelection"), 600)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase === "close") onComplete()
  }, [phase, onComplete])

  const handleVerticalSelect = useCallback((index: number) => {
    const opt = VERTICAL_SELECTION_OPTIONS[index]
    if (!opt?.clickable) return
    setUserSelectionLabel(opt.label)
    setPhase("loading1")
  }, [])

  const handleEndSelect = useCallback((index: number) => {
    if (index !== 2) return
    setEndSelectionLabel(PATTERNS_END_OPTIONS[index]?.label ?? "")
    setPhase("loadingClose")
  }, [])

  const phaseOrder: Phase[] = [
    "prompt",
    "loading1",
    "chart",
    "endSelection",
    "loadingClose",
    "close",
  ]
  const currentIdx = phaseOrder.indexOf(phase)
  const isPast = (p: Phase) => phaseOrder.indexOf(p) < currentIdx

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6">
          <MessageContent content={PATTERNS_OPENING_MESSAGE} />

          {phase === "prompt" && (
            <SelectionPrompt
              options={VERTICAL_SELECTION_OPTIONS}
              onSelect={handleVerticalSelect}
              showOpenResponse={false}
            />
          )}

          {isPast("prompt") && userSelectionLabel && (
            <UserBubble content={userSelectionLabel} />
          )}

          {phase === "loading1" && <LoadingShimmer />}

          {isPast("loading1") && <PushbackCard />}

          {(phase === "endSelection" || isPast("endSelection")) && (
            <>
              <MessageContent content={PUSHBACK_FOLLOW_UP} />
              {phase === "endSelection" && (
                <SelectionPrompt
                  options={PATTERNS_END_OPTIONS}
                  onSelect={handleEndSelect}
                  showOpenResponse={false}
                />
              )}
            </>
          )}

          {isPast("endSelection") && endSelectionLabel && (
            <UserBubble content={endSelectionLabel} />
          )}

          {phase === "loadingClose" && <LoadingShimmer />}

          {phase === "close" && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="prose-claude font-serif text-[15px] leading-relaxed">
                <MarkdownRenderer content={PATTERNS_WHY_MARKDOWN} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Pushback chart card ───────────────────────────────────────────────

export function PushbackCard() {
  const mutableData = PUSHBACK_CHART_DATA as unknown as Record<string, unknown>[]
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/80">
      <CardHeader>
        <CardTitle>{PUSHBACK_CHART_TITLE}</CardTitle>
        <CardDescription className="font-serif text-[14px] leading-relaxed">
          {PUSHBACK_CHART_CAPTION}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ChartContainer config={PUSHBACK_CHART_CONFIG} className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mutableData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="redirections"
                stackId="pushback"
                fill="var(--color-redirections)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="corrections"
                stackId="pushback"
                fill="var(--color-corrections)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Common pushback phrases */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Common phrases you use to push back
          </h4>
          <div className="flex flex-wrap gap-2">
            {PUSHBACK_PHRASES.map((phrase) => (
              <span
                key={phrase}
                className="inline-block rounded-md bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>

        {/* What you push back on */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            What you push back on most
          </h4>
          <div className="space-y-1.5">
            {PUSHBACK_TOPICS.map((item) => (
              <div key={item.topic} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.topic}</span>
                <span className="font-mono text-xs tabular-nums text-foreground">
                  {item.count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
