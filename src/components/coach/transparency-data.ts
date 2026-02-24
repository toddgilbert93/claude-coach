import type { SelectionOption } from "./selection-prompt"

/** Headers shown instantly; body segments typed at 8ms/char. */
export const TRANSPARENCY_REPORT_SEGMENTS: readonly string[] = [
  "**Who you are**\n\n",
  "You're a designer who thinks in systems but leads with intuition. You care deeply about craft — not just how things look, but how they work and why they exist. You've been actively integrating AI into your creative process, not as a shortcut but as a thinking partner, and you're unusually reflective about how that changes the way you work. You show up to these sessions with genuine curiosity, which tells me this isn't performative — you're actually trying to grow.\n\n",
  "**Your strengths**\n\n",
  "You have a rare combination of creative ambition and self-awareness. When you hit a flow state, you produce work that reflects real depth of thought. You're willing to sit with discomfort — exploring new tools, questioning your own patterns, revisiting goals that didn't land — rather than defaulting to what's easy. You also have strong instincts for when something isn't working, even if you don't always trust those instincts immediately.\n\n",
  "**Your blindspots**\n\n",
  "You tend toward self-criticism that masquerades as high standards. There's a pattern where you discount progress because it doesn't match some internal benchmark that keeps moving. You're getting better at catching it, but it still shapes how you evaluate your weeks — a genuinely strong week can feel \"okay\" to you because you're measuring against an idealized version. The other thing I notice: you can over-rotate on reflection at the expense of momentum. Sometimes the most productive thing is to keep moving, not to stop and assess.",
]

export const TRANSPARENCY_REPORT = TRANSPARENCY_REPORT_SEGMENTS.join("")

export const TRANSPARENCY_SELECTION_OPTIONS: SelectionOption[] = [
  { label: "This feels accurate", clickable: false },
  { label: "Some of this is off", clickable: false },
  { label: "Tell me why you show me these transparency reports", clickable: true },
]

export const TRANSPARENCY_WHY_MARKDOWN = `**Why transparency reports?**

AI can only infer from the conversations you have. It has no access to your life outside the app — your context, your habits, the things you never mention. That creates blindspots.

**What these reports do:**

- **Surface the model's view of you** — not as truth, but as a reflection built from what you've said and how you've said it. That reflection is useful precisely because it's partial.
- **Support self-reflection** — seeing yourself through the AI's lens can highlight patterns you take for granted or assumptions you didn't know you were making.
- **Reveal what the AI doesn't know** — when the report feels off or incomplete, that's information. It tells you what the system is missing because you've never brought it into the conversation. The gaps are as useful as the hits.

**Why it matters**

Understanding how AI views you isn't about agreeing with it. It's about knowing where the picture is clear and where it's blank. That awareness helps you use the tool more intentionally — and reminds you that you're more than what any single conversation (or model) can see.

This is the difference between an AI that *infers* you and one whose inferences you can actually see and correct.`
