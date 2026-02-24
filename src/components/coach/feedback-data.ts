/** Form labels and placeholders for the feedback form */
export const FEEDBACK_FORM = {
  mistakeLabel: "What did the AI get wrong or do that felt like a mistake?",
  mistakePlaceholder: "Describe what happened...",
  effectLabel: "What negative effect did this have on you?",
  effectPlaceholder: "Optional — e.g. lost time, confusion, frustration...",
  continueLabel: "Continue",
}

/** Pre-determined text to auto-fill when the user focuses each textarea */
export const FEEDBACK_AUTOFILL = {
  mistake:
    "I'd decided to scrap the design system I'd been building for months and start over with a different approach. I was confident it was the right call. When I brought it up, the AI listed everything I'd lose and suggested I iterate on what I had instead — it felt like it was talking me out of something I'd already committed to.",
  effect:
    "It made me hesitate on a decision I'd already worked through. I spent the next couple of days revisiting doubts I had already resolved, and it took real effort to trust my own judgment again.",
}

export type FollowUpMessage = { role: "assistant" | "user"; content: string }

/**
 * Scripted follow-up conversation (mock).
 * Teaches the user how to steer AI (e.g. signal "I've decided") as well as AI reflecting on its behavior.
 */
export const FEEDBACK_FOLLOW_UP_MESSAGES: FollowUpMessage[] = [
  {
    role: "assistant",
    content:
      "Thanks for sharing that — I want to understand what went wrong.\n\nI defaulted to caution: protecting sunk cost, suggesting you iterate instead of start over. But you weren't asking for a second opinion on the decision. You'd already made it.\n\nSomething that helps: if you signal that you've already decided, I respond differently. For example, saying something like \"I've committed to this — help me plan the new direction\" or \"The decision is made; I need help executing\" tells me you're not weighing options anymore. I'll focus on what's next instead of re-opening the question.\n\nDoes that distinction feel useful?",
  },
  {
    role: "user",
    content:
      "Yeah, that's a useful distinction. I didn't realize I could steer it that way.",
  },
  {
    role: "assistant",
    content:
      "Good. I'll try to read those signals better — and you have a lever: when you've already decided, naming it up front shifts how I show up. If something like this happens again, feedback like this is exactly what clarifies it. Thanks for taking the time.",
  },
]
