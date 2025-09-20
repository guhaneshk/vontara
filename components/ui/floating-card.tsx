"use client"

import type React from "react"

import { useState } from "react"

interface FloatingCardProps {
  children: React.ReactNode
  className?: string
  hoverScale?: number
}

export function FloatingCard({ children, className = "", hoverScale = 1.05 }: FloatingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`transition-all duration-500 ease-out ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? `translateY(-10px) scale(${hoverScale}) rotateX(5deg)`
          : "translateY(0) scale(1) rotateX(0deg)",
        boxShadow: isHovered ? "0 25px 50px rgba(0, 0, 0, 0.15)" : "0 10px 25px rgba(0, 0, 0, 0.1)",
      }}
    >
      {children}
    </div>
  )
}
