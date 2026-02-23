"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "./code-block"
import type { Components } from "react-markdown"

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    const isInline = !match && !className

    if (isInline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }

    return (
      <CodeBlock language={match?.[1] || "text"}>
        {String(children).replace(/\n$/, "")}
      </CodeBlock>
    )
  },
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-claude font-serif">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
