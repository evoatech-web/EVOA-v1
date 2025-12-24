"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface IncubatorFormProps {
  onSubmit: (user: User) => void
  onBack: () => void
}

export function IncubatorForm({ onSubmit, onBack }: IncubatorFormProps) {
  const [formData, setFormData] = useState({
    institutionName: "",
    email: "",
    contactPerson: "",
    phone: "",
    linkedin: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.institutionName.trim()) newErrors.institutionName = "Institution name is required"
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required"
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const user: User = {
      id: Date.now().toString(),
      role: "incubator",
      name: formData.contactPerson,
      email: formData.email,
      meta: {
        institutionName: formData.institutionName,
        phone: formData.phone,
        linkedin: formData.linkedin,
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
        <h2 className="text-2xl font-bold text-foreground mb-6">Incubator / Accelerator Registration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Institution Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.institutionName}
            onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your institution name"
          />
          {errors.institutionName && <p className="text-red-500 text-sm mt-1">{errors.institutionName}</p>}
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
            placeholder="contact@institution.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Full name"
          />
          {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+91 XXXXX XXXXX"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">LinkedIn Page</label>
          <input
            type="text"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://linkedin.com/company/..."
          />
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
