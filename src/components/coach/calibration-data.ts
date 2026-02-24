import type { SelectionOption } from "./selection-prompt"

export type CalibrationStepType = "selection" | "autoFill" | "markdownClose"

export interface SelectionStep {
  type: "selection"
  aiMessage: string
  /** Short heading for the selection card; if omitted, aiMessage is used */
  promptHeading?: string
  options: SelectionOption[]
  clickableIndex: number
  showOpenResponse?: boolean
}

export interface AutoFillStep {
  type: "autoFill"
  aiMessage: string
  autoFillText: string
}

export interface MarkdownCloseStep {
  type: "markdownClose"
  markdown: string
}

export type CalibrationStep =
  | SelectionStep
  | AutoFillStep
  | MarkdownCloseStep

export const CALIBRATION_STEPS: CalibrationStep[] = [
  {
    type: "selection",
    aiMessage: "Hi Todd! Ready for your weekly calibration?",
    options: [
      { label: "Yes, I'm ready", clickable: true },
      { label: "No, let's skip it this week", clickable: false },
    ],
    clickableIndex: 0,
    showOpenResponse: true,
  },
  {
    type: "selection",
    aiMessage:
      "Great! Let's start with the basics. How's your overall energy and mental state this week compared to last?",
    options: [
      { label: "Better than last week", clickable: true },
      { label: "About the same", clickable: false },
      { label: "Worse than last week", clickable: false },
      { label: "It's been a rollercoaster", clickable: false },
    ],
    clickableIndex: 0,
    showOpenResponse: false,
  },
  {
    type: "selection",
    aiMessage:
      "Good to hear you're trending up. Last week you mentioned wanting to spend more focused time on design work. How did that go?",
    options: [
      {
        label:
          "I made real progress -- got into a flow state at least once",
        clickable: true,
      },
      {
        label: "Worked on it some, but kept getting pulled away",
        clickable: false,
      },
      { label: "Didn't get to it at all", clickable: false },
      { label: "I actually shifted focus to something else", clickable: false },
    ],
    clickableIndex: 0,
    showOpenResponse: false,
  },
  {
    type: "selection",
    aiMessage:
      "Nice -- those flow states are gold. You've also been exploring AI tools and how they fit into your design process. Anything shift there this week?",
    options: [
      { label: "Yes, I found a new workflow that's clicking", clickable: true },
      { label: "Still experimenting, nothing landed yet", clickable: false },
      { label: "Took a break from it this week", clickable: false },
      {
        label: "I'm starting to feel overwhelmed by the options",
        clickable: false,
      },
    ],
    clickableIndex: 0,
    showOpenResponse: false,
  },
  {
    type: "selection",
    aiMessage:
      "Nice — glad something's landing. Shifting gears. You mentioned last week that you were working on being less self-critical. How's that been going?",
    options: [
      {
        label: "Noticeably better -- caught myself a few times",
        clickable: true,
      },
      { label: "Some progress, but old patterns crept in", clickable: false },
      { label: "Honestly, not great this week", clickable: false },
      { label: "I hadn't thought about it until you asked", clickable: false },
    ],
    clickableIndex: 0,
    showOpenResponse: false,
  },
  {
    type: "selection",
    aiMessage: `That's a strong week, Todd. Here's what I'm picking up:

- **Energy is up** -- that's a good foundation
- **Design flow** is happening -- worth protecting that time
- **AI + design** — a new workflow is clicking
- **Self-awareness** around self-criticism is improving -- noticing the pattern is the hardest part

I'll carry these signals forward into our conversations this week. Anything else before we wrap?`,
    promptHeading: "Anything else before we wrap?",
    options: [
      { label: "No, that covers it", clickable: false },
      { label: "Actually, there's something I want to add", clickable: false },
      {
        label: "Tell me why we are having these calibration sessions",
        clickable: true,
      },
    ],
    clickableIndex: 2,
    showOpenResponse: false,
  },
  {
    type: "markdownClose",
    markdown: `**Why Calibration?**

AI can personalize a conversation using summaries of previous chats — but it doesn't have a real working memory of you.

Calibration sessions are designed to close that gap.

**What they do:**

- **Track change over time** -- not just what you say, but how it shifts week to week
- **Test permanence** -- some things you mention once and never again; others keep coming back. Calibration helps distinguish signal from noise
- **Create accountability without pressure** -- by revisiting what you said mattered, the AI can gently check in without being pushy
- **Ground the AI in reality** -- instead of inferring your state from tone or word choice, it asks directly

**Why it matters for coaching:**

A coach who doesn't know where you've been can't help you figure out where you're going. These sessions give the AI the longitudinal awareness that makes its guidance actually personal -- not just personalized.

This is the difference between an AI that *responds* to you and one that *knows* you.`,
  },
]

// User response labels for steps that use selection (so we can show what they "picked" in history)
export function getSelectionResponseLabel(stepIndex: number): string {
  const step = CALIBRATION_STEPS[stepIndex]
  if (!step || step.type !== "selection") return ""
  const opt = step.options[step.clickableIndex]
  return opt?.label ?? ""
}
