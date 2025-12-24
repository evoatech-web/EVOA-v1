"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { UserRole, User } from "@/lib/types"
import { localStorage_utils } from "@/lib/localStorage"
import { RoleSelector } from "@/components/role-selector"
import { StartupForm } from "@/components/startup-form"
import { InvestorForm } from "@/components/investor-form"
import { IncubatorForm } from "@/components/incubator-form"
import { ViewerForm } from "@/components/viewer-form"

export default function WelcomePage() {
  const router = useRouter()
  const [step, setStep] = useState<"role" | "form">("role")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep("form")
  }

  const handleFormSubmit = (user: User) => {
    localStorage_utils.setUser(user)
    router.push("/explore")
  }

  const handleBack = () => {
    setStep("role")
    setSelectedRole(null)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {step === "role" ? (
          <RoleSelector onSelect={handleRoleSelect} />
        ) : selectedRole === "startup" ? (
          <StartupForm onSubmit={handleFormSubmit} onBack={handleBack} />
        ) : selectedRole === "investor" ? (
          <InvestorForm onSubmit={handleFormSubmit} onBack={handleBack} />
        ) : selectedRole === "incubator" ? (
          <IncubatorForm onSubmit={handleFormSubmit} onBack={handleBack} />
        ) : (
          <ViewerForm onSubmit={handleFormSubmit} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}
