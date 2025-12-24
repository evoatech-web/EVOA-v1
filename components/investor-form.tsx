"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface InvestorFormProps {
  onSubmit: (user: User) => void
  onBack: () => void
}

export function InvestorForm({ onSubmit, onBack }: InvestorFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    email: "",
    linkedin: "",
    investorType: "Angel",
    ticketSize: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.designation.trim()) newErrors.designation = "Designation is required"
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required"
    if (!formData.linkedin.trim()) newErrors.linkedin = "LinkedIn profile is required"
    if (!formData.ticketSize.trim()) newErrors.ticketSize = "Ticket size is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const user: User = {
      id: Date.now().toString(),
      role: "investor",
      name: formData.fullName,
      email: formData.email,
      meta: {
        designation: formData.designation,
        linkedin: formData.linkedin,
        investorType: formData.investorType,
        ticketSize: formData.ticketSize,
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
        <h2 className="text-2xl font-bold text-foreground mb-6">Investor Registration</h2>
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
            Designation / Firm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your title / firm name"
          />
          {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
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
          <label className="block text-sm font-medium text-foreground mb-2">
            LinkedIn <span className="text-red-500">*</span>
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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Investor Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.investorType}
            onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Angel</option>
            <option>Venture Capital</option>
            <option>Private Equity</option>
            <option>Corporate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Ticket Size <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.ticketSize}
            onChange={(e) => setFormData({ ...formData, ticketSize: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., $100K - $1M"
          />
          {errors.ticketSize && <p className="text-red-500 text-sm mt-1">{errors.ticketSize}</p>}
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
