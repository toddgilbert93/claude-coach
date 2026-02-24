import type { ChartConfig } from "@/components/ui/chart"
import type { SelectionOption } from "./selection-prompt"

export const PATTERNS_ZERO_STATE_DESCRIPTION =
  "See how your collaboration with AI is evolving."

export const PATTERNS_OPENING_MESSAGE =
  "I've been tracking how you interact with me across our conversations. There are a few patterns worth looking at — but I'd rather start with what you're most curious about."

export const VERTICAL_SELECTION_OPTIONS: SelectionOption[] = [
  { label: "Am I getting more efficient?", clickable: false },
  { label: "How often do I push back on you?", clickable: true },
  { label: "What am I actually using AI for?", clickable: false },
  { label: "How often do my sessions end with a clear outcome?", clickable: false },
]

// ── Pushback frequency chart data ─────────────────────────────────────
// Increasing trend with realistic variance, not linear

export const PUSHBACK_CHART_DATA = [
  { period: "Jan 6", redirections: 1, corrections: 1 },
  { period: "Jan 13", redirections: 2, corrections: 1 },
  { period: "Jan 20", redirections: 3, corrections: 1 },
  { period: "Jan 27", redirections: 2, corrections: 2 },
  { period: "Feb 3", redirections: 4, corrections: 1 },
  { period: "Feb 10", redirections: 3, corrections: 2 },
  { period: "Feb 17", redirections: 5, corrections: 2 },
  { period: "Feb 24", redirections: 4, corrections: 3 },
  { period: "Mar 3", redirections: 6, corrections: 2 },
  { period: "Mar 10", redirections: 5, corrections: 4 },
  { period: "Mar 17", redirections: 7, corrections: 3 },
  { period: "Mar 24", redirections: 6, corrections: 5 },
] as const

export const PUSHBACK_CHART_CONFIG = {
  redirections: {
    label: "Steered the conversation",
    color: "var(--chart-2)",
  },
  corrections: {
    label: "Corrected the AI",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export const PUSHBACK_CHART_TITLE = "Pushback frequency"

export const PUSHBACK_CHART_CAPTION =
  "You're pushing back more over time — both steering conversations in a new direction and directly correcting things I got wrong."

export const PUSHBACK_PHRASES = [
  "\"That's not what I meant — let me clarify.\"",
  "\"I've already decided this — help me execute, not reconsider.\"",
  "\"You're overcomplicating it. Simpler.\"",
  "\"That doesn't match what I said earlier.\"",
  "\"Skip the preamble and just answer.\"",
  "\"No — go back to the previous direction.\"",
]

export const PUSHBACK_TOPICS = [
  { topic: "Design direction", count: 14 },
  { topic: "Tone & writing style", count: 11 },
  { topic: "Scope creep", count: 9 },
  { topic: "Assumptions about intent", count: 8 },
  { topic: "Over-explaining", count: 6 },
]

export const PUSHBACK_FOLLOW_UP =
  "Would you like to know more about this or any other topic?"

export const PATTERNS_END_OPTIONS: SelectionOption[] = [
  { label: "This is useful — I see myself in these patterns", clickable: false },
  { label: "Some of this feels off", clickable: false },
  { label: "Tell me why you track these patterns at all", clickable: true },
]

export const PATTERNS_WHY_MARKDOWN = `**Why Patterns?**

Conversations can feel meaningful in the moment and still blur together afterwards. The patterns underneath them don't.

**What these charts do:**

- **Turn vibes into evidence** — instead of guessing whether you're "getting better" at using AI, you can see where your prompting, follow-through, and collaboration habits are shifting.
- **Surface how you actually use the model** — not how you *intend* to, but where your time goes: reflection vs execution, exploration vs shipping.
- **Catch unhelpful loops** — spirals, endless threads, and conversations that never quite land stop being anecdotes and start showing up as a shape you can change.

**Why it matters**

The goal isn't to optimize every chat. It's to notice the habits that either compound or cancel out your effort — how often you end with a clear outcome, how quickly you course-correct when the model is off, when long conversations are a sign of depth vs avoidance.

This is the difference between an AI that *participates* in your work and one that helps you *see* how you work.`
