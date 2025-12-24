"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar } from "lucide-react"
import type { Pitch, User } from "@/lib/types"

interface ScheduleMeetModalProps {
  pitch: Pitch | null
  user: User | null
  onClose: () => void
}

export function ScheduleMeetModal({ pitch, user, onClose }: ScheduleMeetModalProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!pitch || !user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time) {
      alert("Please select both date and time")
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      alert(`Meeting scheduled with ${pitch.startup} for ${date} at ${time}`)
      onClose()
      setDate("")
      setTime("")
      setNotes("")
      setSubmitted(false)
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold">Schedule a Meet</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold text-sm">{pitch.startup}</p>
          <p className="text-xs text-gray-600">{pitch.founder}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            {submitted ? "Scheduling..." : "Schedule Meeting"}
          </button>
        </form>
      </div>
    </div>
  )
}
