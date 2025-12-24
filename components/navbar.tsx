"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Sparkles, Plus, User } from "lucide-react"
import { UploadModal } from "./upload-modal"
import type { User as UserType } from "@/lib/types"

interface NavbarProps {
  user?: UserType | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto md:max-w-full">
          <Link
            href="/explore"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all ${
              isActive("/explore")
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Home"
          >
            <Home className="h-6 w-6" />
          </Link>

          <Link
            href="/feed"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all ${
              isActive("/feed")
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Reels"
          >
            <Compass className="h-6 w-6" />
          </Link>

          {/* 021 AI */}
          <button
            onClick={() => window.open("https://021.evoa.co.in", "_blank")}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-lg text-muted-foreground hover:text-foreground transition-colors leading-none"
            title="021 AI"
            aria-label="021 AI"
          >
            <Sparkles className="h-6 w-6 mb-0.5" />
            <span className="text-[10px] leading-none">021</span>
          </button>

          {/* Upload */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Upload"
          >
            <Plus className="h-6 w-6" />
          </button>

          {/* Profile */}
          <Link
            href="/profile/me"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all ${
              isActive("/profile/me")
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Profile"
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </nav>

      <UploadModal
        user={user}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          // Optionally refresh feed or navigate
        }}
      />
    </>
  )
}
