import { Conversation } from "./types"

export const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Improving Mercor's design experience",
    starred: false,
    timestamp: new Date("2025-02-23T10:30:00"),
    messages: [
      {
        id: "1a",
        role: "user",
        content:
          "answer this question given any knowledge about mercor ux\nif I worked there as a designer what would I improve about their current experience",
        timestamp: new Date("2025-02-23T10:30:00"),
      },
      {
        id: "1b",
        role: "assistant",
        searchedWeb: true,
        content: `Let me search for information about Mercor's current UX to give you a solid answer.

Good stuff — here's a pretty clear picture. Todd, if you were a designer at Mercor, there's a *lot* of low-hanging fruit and some deeper systemic issues to tackle. Here's how I'd frame it:

## The Trust Crisis (biggest problem)

Mercor's #1 UX issue isn't a UI problem — it's a **trust deficit** baked into the entire candidate experience. The widespread perception that interviews are data harvesting, the "paused indefinitely" pattern, and zero transparency about what happens after you interview all contribute to a fundamental breakdown in user trust.

## Navigation & Information Architecture

The platform suffers from **unclear wayfinding**. Users report difficulty understanding:
- Where they are in the application process
- What actions are available to them
- How to access previous interview recordings
- The relationship between different sections of the platform

## The Interview Experience

The AI interview flow needs significant work:
- **No clear expectations** set before the interview begins
- **Abrupt transitions** between questions without natural conversation flow
- **Limited feedback** during and after the interview
- The recording/review flow feels like surveillance rather than a professional assessment

## Quick Wins I'd Prioritize

1. **Status transparency** — A clear, always-visible pipeline status showing exactly where candidates stand
2. **Post-interview summary** — Immediate feedback on what was discussed and next steps
3. **Humanized AI interactions** — Better conversational design for the interview bot
4. **Consistent visual language** — The current UI feels like it was built by different teams with no shared design system`,
        thinking:
          "The user is asking about Mercor's UX issues from a designer's perspective. Let me think about what I know about Mercor — they're an AI-powered hiring platform. I should focus on concrete, actionable design improvements rather than generic UX advice.",
        timestamp: new Date("2025-02-23T10:31:00"),
      },
    ],
  },
  {
    id: "2",
    title: "Getting noticed by Anthropic",
    starred: false,
    timestamp: new Date("2025-02-22T16:00:00"),
    messages: [
      {
        id: "2a",
        role: "user",
        content: "What are some creative ways to get noticed by the Anthropic recruiting team?",
        timestamp: new Date("2025-02-22T16:00:00"),
      },
      {
        id: "2b",
        role: "assistant",
        content: `Great question. Here are some approaches that go beyond the standard application:

## Build Something With Claude

The most compelling signal is **demonstrating deep product understanding**. Build a project that:
- Uses the Claude API in a novel way
- Solves a real problem you care about
- Shows thoughtful UX around AI interactions

## Contribute to the Ecosystem

- Write detailed, technical blog posts about your experience with Claude
- Create open-source tools that extend Claude's capabilities
- Participate in the Anthropic Discord and provide genuinely helpful feedback

## Direct Outreach That Works

- **Be specific** about which role and why you're uniquely suited
- Reference specific Anthropic research papers or product decisions
- Share your portfolio with annotations explaining your design thinking

The key thread: show you understand *why* Anthropic exists, not just *what* they build.`,
        timestamp: new Date("2025-02-22T16:01:00"),
      },
    ],
  },
  {
    id: "3",
    title: "Rural land investment in Texas",
    starred: false,
    timestamp: new Date("2025-02-22T09:00:00"),
    messages: [
      {
        id: "3a",
        role: "user",
        content: "What should I know about buying rural land in Texas as an investment?",
        timestamp: new Date("2025-02-22T09:00:00"),
      },
      {
        id: "3b",
        role: "assistant",
        content: `Texas rural land is one of the more interesting investment plays right now. Here's what you need to know:

## The Basics

- Texas has **no state income tax**, which makes land appreciation more attractive
- Property taxes vary wildly by county — always check the effective rate
- Agricultural exemptions can reduce your tax burden by 90%+ if you qualify

## What to Watch For

1. **Water rights** — In Texas, surface water and groundwater have completely different legal frameworks. Verify both.
2. **Mineral rights** — These are often severed from surface rights. Always confirm what you're actually buying.
3. **Access** — Landlocked parcels exist. Ensure legal road access is documented.
4. **Flood zones** — Check FEMA maps carefully, especially near rivers and creeks.

## Pricing Trends

Central Texas (Austin corridor) has seen the most appreciation, but West Texas and the Hill Country offer interesting value plays for longer-term holds.`,
        timestamp: new Date("2025-02-22T09:01:00"),
      },
    ],
  },
  {
    id: "4",
    title: "Recurring back tightness",
    starred: false,
    timestamp: new Date("2025-02-21T14:00:00"),
    messages: [],
  },
  {
    id: "5",
    title: "AI whiteboard collaboration app",
    starred: false,
    timestamp: new Date("2025-02-21T11:00:00"),
    messages: [],
  },
  {
    id: "6",
    title: "Practice session update",
    starred: false,
    timestamp: new Date("2025-02-20T18:00:00"),
    messages: [],
  },
  {
    id: "7",
    title: "Calculating tennis racket swingwe...",
    starred: false,
    timestamp: new Date("2025-02-20T10:00:00"),
    messages: [],
  },
  {
    id: "8",
    title: "Browser extension troubleshooting",
    starred: false,
    timestamp: new Date("2025-02-19T15:00:00"),
    messages: [],
  },
  {
    id: "9",
    title: "Waiting on Cortex interview follo...",
    starred: false,
    timestamp: new Date("2025-02-19T09:00:00"),
    messages: [],
  },
  {
    id: "10",
    title: "About Delphi.ai",
    starred: false,
    timestamp: new Date("2025-02-18T12:00:00"),
    messages: [],
  },
  {
    id: "11",
    title: "When to start a design portfolio",
    starred: false,
    timestamp: new Date("2025-02-17T14:00:00"),
    messages: [],
  },
]
