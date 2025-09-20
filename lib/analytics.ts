// Analytics tracking system for student engagement
export interface AnalyticsEvent {
  id: string
  type: "course_view" | "chapter_start" | "chapter_complete" | "course_complete" | "page_view" | "button_click"
  courseId?: string
  chapterId?: string
  userId: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface StudentEngagement {
  userId: string
  totalTimeSpent: number // in minutes
  coursesStarted: string[]
  coursesCompleted: string[]
  chaptersCompleted: string[]
  lastActive: string
  sessionsCount: number
  averageSessionTime: number
}

export class Analytics {
  private static readonly EVENTS_KEY = "vontara_analytics_events"
  private static readonly ENGAGEMENT_KEY = "vontara_student_engagement"
  private static readonly SESSION_KEY = "vontara_current_session"

  // Generate or get user ID
  static getUserId(): string {
    if (typeof window === "undefined") return "server"

    let userId = localStorage.getItem("vontara_user_id")
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("vontara_user_id", userId)
    }
    return userId
  }

  // Track events
  static trackEvent(type: AnalyticsEvent["type"], data?: Partial<AnalyticsEvent>): void {
    if (typeof window === "undefined") return

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId: this.getUserId(),
      timestamp: new Date().toISOString(),
      ...data,
    }

    const events = this.getEvents()
    events.push(event)

    // Keep only last 1000 events to prevent storage bloat
    if (events.length > 1000) {
      events.splice(0, events.length - 1000)
    }

    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events))

    // Update engagement metrics
    this.updateEngagement(event)
  }

  // Get all events
  static getEvents(): AnalyticsEvent[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.EVENTS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Update student engagement metrics
  private static updateEngagement(event: AnalyticsEvent): void {
    const engagement = this.getStudentEngagement(event.userId)

    switch (event.type) {
      case "course_view":
        if (event.courseId && !engagement.coursesStarted.includes(event.courseId)) {
          engagement.coursesStarted.push(event.courseId)
        }
        break

      case "chapter_complete":
        if (event.chapterId && !engagement.chaptersCompleted.includes(event.chapterId)) {
          engagement.chaptersCompleted.push(event.chapterId)
        }
        break

      case "course_complete":
        if (event.courseId && !engagement.coursesCompleted.includes(event.courseId)) {
          engagement.coursesCompleted.push(event.courseId)
        }
        break
    }

    engagement.lastActive = event.timestamp
    this.saveStudentEngagement(engagement)
  }

  // Get student engagement data
  static getStudentEngagement(userId?: string): StudentEngagement {
    if (typeof window === "undefined") return this.getDefaultEngagement()

    const targetUserId = userId || this.getUserId()
    const stored = localStorage.getItem(`${this.ENGAGEMENT_KEY}_${targetUserId}`)

    if (stored) {
      return JSON.parse(stored)
    }

    return {
      userId: targetUserId,
      totalTimeSpent: 0,
      coursesStarted: [],
      coursesCompleted: [],
      chaptersCompleted: [],
      lastActive: new Date().toISOString(),
      sessionsCount: 0,
      averageSessionTime: 0,
    }
  }

  // Save student engagement data
  private static saveStudentEngagement(engagement: StudentEngagement): void {
    if (typeof window === "undefined") return

    localStorage.setItem(`${this.ENGAGEMENT_KEY}_${engagement.userId}`, JSON.stringify(engagement))
  }

  // Start session tracking
  static startSession(): void {
    if (typeof window === "undefined") return

    const session = {
      startTime: Date.now(),
      userId: this.getUserId(),
      pageViews: 0,
    }

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))

    // Update session count
    const engagement = this.getStudentEngagement()
    engagement.sessionsCount += 1
    this.saveStudentEngagement(engagement)

    this.trackEvent("page_view", { metadata: { page: "session_start" } })
  }

  // End session and calculate time spent
  static endSession(): void {
    if (typeof window === "undefined") return

    const stored = localStorage.getItem(this.SESSION_KEY)
    if (!stored) return

    const session = JSON.parse(stored)
    const sessionTime = Math.round((Date.now() - session.startTime) / 1000 / 60) // in minutes

    const engagement = this.getStudentEngagement()
    engagement.totalTimeSpent += sessionTime

    // Update average session time
    if (engagement.sessionsCount > 0) {
      engagement.averageSessionTime = Math.round(engagement.totalTimeSpent / engagement.sessionsCount)
    }

    this.saveStudentEngagement(engagement)
    localStorage.removeItem(this.SESSION_KEY)
  }

  // Get analytics dashboard data
  static getDashboardData(): {
    totalUsers: number
    totalEvents: number
    topCourses: Array<{ courseId: string; views: number; completions: number }>
    engagementMetrics: {
      averageTimeSpent: number
      averageSessionTime: number
      completionRate: number
    }
    recentActivity: AnalyticsEvent[]
  } {
    const events = this.getEvents()
    const users = new Set(events.map((e) => e.userId))

    // Calculate top courses
    const courseStats: Record<string, { views: number; completions: number }> = {}

    events.forEach((event) => {
      if (event.courseId) {
        if (!courseStats[event.courseId]) {
          courseStats[event.courseId] = { views: 0, completions: 0 }
        }

        if (event.type === "course_view") {
          courseStats[event.courseId].views += 1
        } else if (event.type === "course_complete") {
          courseStats[event.courseId].completions += 1
        }
      }
    })

    const topCourses = Object.entries(courseStats)
      .map(([courseId, stats]) => ({ courseId, ...stats }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    // Calculate engagement metrics
    let totalTimeSpent = 0
    let totalSessionTime = 0
    let totalCoursesStarted = 0
    let totalCoursesCompleted = 0

    users.forEach((userId) => {
      const engagement = this.getStudentEngagement(userId)
      totalTimeSpent += engagement.totalTimeSpent
      totalSessionTime += engagement.averageSessionTime
      totalCoursesStarted += engagement.coursesStarted.length
      totalCoursesCompleted += engagement.coursesCompleted.length
    })

    const userCount = users.size || 1

    return {
      totalUsers: users.size,
      totalEvents: events.length,
      topCourses,
      engagementMetrics: {
        averageTimeSpent: Math.round(totalTimeSpent / userCount),
        averageSessionTime: Math.round(totalSessionTime / userCount),
        completionRate: totalCoursesStarted > 0 ? Math.round((totalCoursesCompleted / totalCoursesStarted) * 100) : 0,
      },
      recentActivity: events.slice(-10).reverse(),
    }
  }

  // Track page views
  static trackPageView(page: string, metadata?: Record<string, any>): void {
    this.trackEvent("page_view", {
      metadata: { page, ...metadata },
    })
  }

  // Track button clicks
  static trackButtonClick(buttonName: string, metadata?: Record<string, any>): void {
    this.trackEvent("button_click", {
      metadata: { buttonName, ...metadata },
    })
  }

  // Track course interactions
  static trackCourseView(courseId: string): void {
    this.trackEvent("course_view", { courseId })
  }

  static trackChapterStart(courseId: string, chapterId: string): void {
    this.trackEvent("chapter_start", { courseId, chapterId })
  }

  static trackChapterComplete(courseId: string, chapterId: string): void {
    this.trackEvent("chapter_complete", { courseId, chapterId })
  }

  static trackCourseComplete(courseId: string): void {
    this.trackEvent("course_complete", { courseId })
  }

  private static getDefaultEngagement(): StudentEngagement {
    return {
      userId: "default",
      totalTimeSpent: 0,
      coursesStarted: [],
      coursesCompleted: [],
      chaptersCompleted: [],
      lastActive: new Date().toISOString(),
      sessionsCount: 0,
      averageSessionTime: 0,
    }
  }
}
