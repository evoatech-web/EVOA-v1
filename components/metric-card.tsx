"use client"

import type React from "react"

interface MetricCardProps {
  label: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

export function MetricCard({ label, value, description, icon }: MetricCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
