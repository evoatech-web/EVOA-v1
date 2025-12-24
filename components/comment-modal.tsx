"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Pitch, Comment } from "@/lib/types"
import { localStorage_utils } from "@/lib/localStorage"
import { X } from "lucide-react"

interface CommentModalProps {
  pitch: Pitch | null
  userId: string
  userName: string
  onClose: () => void
}

export function CommentModal({ pitch, userId, userName, onClose }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    if (pitch) {
      setComments(localStorage_utils.getVideoComments(pitch.id))
    }
  }, [pitch])

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pitch || !newComment.trim()) return

    localStorage_utils.addComment(pitch.id, userId, userName, newComment)
    setComments(localStorage_utils.getVideoComments(pitch.id))
    setNewComment("")
  }

  if (!pitch) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-background rounded-t-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Comments</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">{comment.userName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleDateString()}</p>
                </div>
                <p className="text-sm text-foreground">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment input */}
        <form onSubmit={handleAddComment} className="border-t border-border p-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 bg-muted rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  )
}
