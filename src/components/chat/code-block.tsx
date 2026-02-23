"use client"

import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CodeBlock({
  children,
  language,
}: {
  children: string
  language: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] text-xs text-stone-400">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-stone-200"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: "1rem",
          fontSize: "0.875rem",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}
