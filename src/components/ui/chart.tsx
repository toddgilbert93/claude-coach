"use client"

import * as React from "react"
import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

import type {
  NameType,
  ValueType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent"
import { Legend as RechartsLegend, Tooltip as RechartsTooltip } from "recharts"

export type ChartConfig = Record<
  string,
  {
    label: string
    color?: string
    icon?: React.ComponentType<{ className?: string }>
  }
>

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig
  children: ReactNode
}

const ChartConfigContext = React.createContext<ChartConfig | null>(null)

export function useChartConfig() {
  return React.useContext(ChartConfigContext)
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  const cssVars: Record<string, string> = {}

  for (const [key, value] of Object.entries(config)) {
    if (!value?.color) continue
    cssVars[`--color-${key}`] = value.color
  }

  return (
    <ChartConfigContext.Provider value={config}>
      <div
        className={cn(
          "flex min-h-[200px] w-full flex-col items-stretch justify-center",
          className
        )}
        style={cssVars}
        {...props}
      >
        {children}
      </div>
    </ChartConfigContext.Provider>
  )
}

export function ChartTooltip(
  props: React.ComponentProps<typeof RechartsTooltip<ValueType, NameType>>
) {
  // Just re-export Recharts' Tooltip with our default content component.
  return <RechartsTooltip<ValueType, NameType> {...props} />
}

export interface ChartTooltipContentProps {
  active?: boolean
  payload?: Payload<ValueType, NameType>[]
  label?: string | number
  labelKey?: string
  nameKey?: string
}

export function ChartTooltipContent({
  active,
  payload,
  label,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-md border border-border bg-popover/95 px-3 py-2 text-xs shadow-md">
      {label != null && (
        <div className="mb-1 text-[11px] font-medium text-muted-foreground">
          {String(label)}
        </div>
      )}
      <div className="space-y-0.5">
        {payload.map((item) => {
          if (!item) return null
          const key = String(item.dataKey ?? item.name ?? "")
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-2 text-[11px]"
            >
              <span className="inline-flex items-center gap-1.5">
                {item.color && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                <span className="text-muted-foreground">
                  {String(item.name ?? item.dataKey ?? "")}
                </span>
              </span>
              <span className="font-mono tabular-nums text-foreground">
                {item.value as ReactNode}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ChartLegend(
  props: React.ComponentProps<typeof RechartsLegend>
) {
  return <RechartsLegend {...props} />
}

export interface ChartLegendContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  payload?: { value: string; color: string }[]
}

export function ChartLegendContent({
  className,
  payload,
  ...props
}: ChartLegendContentProps) {
  if (!payload?.length) return null

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground",
        className
      )}
      {...props}
    >
      {payload.map((item) => (
        <div key={item.value} className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

