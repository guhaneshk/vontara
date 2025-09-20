"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Analytics } from "@/lib/analytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Start session on mount
    Analytics.startSession()

    // End session on unmount
    return () => {
      Analytics.endSession()
    }
  }, [])

  useEffect(() => {
    // Track page views
    Analytics.trackPageView(pathname)
  }, [pathname])

  useEffect(() => {
    // Track session time every minute
    const interval = setInterval(() => {
      const session = localStorage.getItem("vontara_current_session")
      if (session) {
        const sessionData = JSON.parse(session)
        const timeSpent = Math.round((Date.now() - sessionData.startTime) / 1000 / 60)

        // Update engagement every 5 minutes
        if (timeSpent > 0 && timeSpent % 5 === 0) {
          const engagement = Analytics.getStudentEngagement()
          engagement.totalTimeSpent += 5
          localStorage.setItem(`vontara_student_engagement_${engagement.userId}`, JSON.stringify(engagement))
        }
      }
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}
