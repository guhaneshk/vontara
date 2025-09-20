"use client"

interface ProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, className = "", showLabel = false }: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Progress</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{ width: `${value}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
