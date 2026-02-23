"use client"

import { SlidersHorizontal, Eye, MessageCircle } from "lucide-react"

const SECTIONS: Record<
  string,
  { icon: typeof SlidersHorizontal; title: string; description: string }
> = {
  Calibration: {
    icon: SlidersHorizontal,
    title: "Calibration",
    description:
      "Fine-tune how Coach responds to you. Adjust tone, depth, and coaching style to match your preferences.",
  },
  Transparency: {
    icon: Eye,
    title: "Transparency",
    description:
      "See how Coach makes decisions. Review the reasoning, sources, and context behind every recommendation.",
  },
  Feedback: {
    icon: MessageCircle,
    title: "Feedback",
    description:
      "Share what's working and what isn't. Your feedback directly shapes how Coach evolves over time.",
  },
}

export function CoachContent({ activeSection }: { activeSection: string }) {
  const section = SECTIONS[activeSection]

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
      </div>
    </div>
  )
}
