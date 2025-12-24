"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface ViewerFormProps {
  onSubmit: (user: User) => void
  onBack: () => void
}

export function ViewerForm({ onSubmit, onBack }: ViewerFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    interestType: "Aspiring Founder",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const user: User = {
      id: Date.now().toString(),
      role: "viewer",
      name: formData.fullName,
      email: "",
      meta: {
        interestType: formData.interestType,
      },
    }

    onSubmit(user)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to roles
      </button>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Viewer / Enthusiast Registration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Interest Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.interestType}
            onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Aspiring Founder</option>
            <option>Student</option>
            <option>Enthusiast</option>
            <option>Researcher</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        Continue to Explore
      </button>
    </form>
  )
}
