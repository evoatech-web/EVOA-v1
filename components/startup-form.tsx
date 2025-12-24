"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface StartupFormProps {
  onSubmit: (user: User) => void
  onBack: () => void
}

export function StartupForm({ onSubmit, onBack }: StartupFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    startupName: "",
    email: "",
    website: "",
    stage: "MVP",
    industry: "Fintech",
    linkedin: "",
    pitchDescription: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.startupName.trim()) newErrors.startupName = "Startup name is required"
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required"
    if (!formData.stage) newErrors.stage = "Stage is required"
    if (!formData.industry) newErrors.industry = "Industry is required"
    if (!formData.linkedin.trim()) newErrors.linkedin = "LinkedIn profile is required"
    if (!formData.pitchDescription.trim()) newErrors.pitchDescription = "Pitch description is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const user: User = {
      id: Date.now().toString(),
      role: "startup",
      name: formData.fullName,
      email: formData.email,
      meta: {
        startupName: formData.startupName,
        website: formData.website,
        stage: formData.stage,
        industry: formData.industry,
        linkedin: formData.linkedin,
        pitchDescription: formData.pitchDescription,
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
        <h2 className="text-2xl font-bold text-foreground mb-6">Startup Founder Registration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Startup Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.startupName}
            onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your startup name"
          />
          {errors.startupName && <p className="text-red-500 text-sm mt-1">{errors.startupName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Website / Social</label>
          <input
            type="text"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Stage <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Idea</option>
            <option>MVP</option>
            <option>Early Revenue</option>
            <option>Growth</option>
            <option>Scaling</option>
          </select>
          {errors.stage && <p className="text-red-500 text-sm mt-1">{errors.stage}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Fintech</option>
            <option>HRTech</option>
            <option>ClimateTech</option>
            <option>HealthTech</option>
            <option>EdTech</option>
            <option>Other</option>
          </select>
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            LinkedIn Profile <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://linkedin.com/in/..."
          />
          {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Pitch Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.pitchDescription}
            onChange={(e) => setFormData({ ...formData, pitchDescription: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Explain your startup in one sentence"
            rows={3}
          />
          {errors.pitchDescription && <p className="text-red-500 text-sm mt-1">{errors.pitchDescription}</p>}
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
