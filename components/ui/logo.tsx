"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  return (
    <div className={`${sizes[size]} ${className} transition-transform duration-300 hover:scale-110`}>
      <img src="/vontara-logo.png" alt="Vontara Logo" className="w-full h-full object-contain" />
    </div>
  )
}
