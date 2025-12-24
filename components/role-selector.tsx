"use client"

import type React from "react"
import type { UserRole } from "@/lib/types"
import { Briefcase, TrendingUp, Building2, Eye } from "lucide-react"

const roles: Array<{ id: UserRole; label: string; icon: React.ReactNode; description: string }> = [
  {
    id: "startup",
    label: "Startup Founder",
    icon: <Briefcase className="h-8 w-8" />,
    description: "Pitch your startup to investors",
  },
  {
    id: "investor",
    label: "Investor",
    icon: <TrendingUp className="h-8 w-8" />,
    description: "Discover promising startups",
  },
  {
    id: "incubator",
    label: "Incubator / Accelerator",
    icon: <Building2 className="h-8 w-8" />,
    description: "Support and mentor startups",
  },
  {
    id: "viewer",
    label: "Viewer / Enthusiast",
    icon: <Eye className="h-8 w-8" />,
    description: "Explore startup innovations",
  },
]

interface RoleSelectorProps {
  onSelect: (role: UserRole) => void
}

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Role</h2>
        <p className="text-muted-foreground">Select how you want to use EVOA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className="p-6 rounded-lg border-2 border-border hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50/50 dark:hover:from-blue-950/30 dark:hover:to-blue-900/20 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-blue-600 transition-all text-primary group-hover:text-white">
                {role.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{role.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
