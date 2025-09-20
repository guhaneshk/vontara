"use client"

import type React from "react"

import { useState } from "react"

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  loading?: boolean
  type?: "button" | "submit"
}

export function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  type = "button",
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const baseClasses =
    "relative overflow-hidden font-semibold rounded-full transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl",
    secondary:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Shimmer effect */}
      <div
        className={`absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform rotate-12 transition-all duration-700 ${isHovered ? "opacity-30 translate-x-full" : "-translate-x-full"}`}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </span>
    </button>
  )
}
