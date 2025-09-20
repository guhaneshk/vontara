// Course management system
export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  level: "Beginner" | "Intermediate" | "Advanced"
  students: number
  duration: string
  chapters: Chapter[]
  createdAt: string
}

export interface Chapter {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: string
  order: number
}

export class CourseManager {
  private static readonly STORAGE_KEY = "vontara_courses"

  static getCourses(): Course[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    }
    return this.getDefaultCourses()
  }

  static saveCourses(courses: Course[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses))
    }
  }

  static addCourse(courseData: Omit<Course, "id" | "createdAt" | "students">): Course {
    const courses = this.getCourses()
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      students: 0,
      createdAt: new Date().toISOString(),
    }
    courses.push(newCourse)
    this.saveCourses(courses)
    return newCourse
  }

  static updateCourse(id: string, updates: Partial<Course>): Course | null {
    const courses = this.getCourses()
    const index = courses.findIndex((c) => c.id === id)
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates }
      this.saveCourses(courses)
      return courses[index]
    }
    return null
  }

  static deleteCourse(id: string): boolean {
    const courses = this.getCourses()
    const filtered = courses.filter((c) => c.id !== id)
    if (filtered.length !== courses.length) {
      this.saveCourses(filtered)
      return true
    }
    return false
  }

  static getCourse(id: string): Course | null {
    const courses = this.getCourses()
    return courses.find((c) => c.id === id) || null
  }

  static addChapter(courseId: string, chapterData: Omit<Chapter, "id" | "order">): Chapter | null {
    const courses = this.getCourses()
    const courseIndex = courses.findIndex((c) => c.id === courseId)
    if (courseIndex !== -1) {
      const newChapter: Chapter = {
        ...chapterData,
        id: Date.now().toString(),
        order: courses[courseIndex].chapters.length + 1,
      }
      courses[courseIndex].chapters.push(newChapter)
      this.saveCourses(courses)
      return newChapter
    }
    return null
  }

  static updateChapter(courseId: string, chapterId: string, updates: Partial<Chapter>): Chapter | null {
    const courses = this.getCourses()
    const courseIndex = courses.findIndex((c) => c.id === courseId)
    if (courseIndex !== -1) {
      const chapterIndex = courses[courseIndex].chapters.findIndex((ch) => ch.id === chapterId)
      if (chapterIndex !== -1) {
        courses[courseIndex].chapters[chapterIndex] = { ...courses[courseIndex].chapters[chapterIndex], ...updates }
        this.saveCourses(courses)
        return courses[courseIndex].chapters[chapterIndex]
      }
    }
    return null
  }

  static deleteChapter(courseId: string, chapterId: string): boolean {
    const courses = this.getCourses()
    const courseIndex = courses.findIndex((c) => c.id === courseId)
    if (courseIndex !== -1) {
      const originalLength = courses[courseIndex].chapters.length
      courses[courseIndex].chapters = courses[courseIndex].chapters.filter((ch) => ch.id !== chapterId)
      if (courses[courseIndex].chapters.length !== originalLength) {
        // Reorder chapters
        courses[courseIndex].chapters.forEach((ch, index) => {
          ch.order = index + 1
        })
        this.saveCourses(courses)
        return true
      }
    }
    return false
  }

  private static getDefaultCourses(): Course[] {
    return [
      {
        id: "1",
        title: "AutoCAD Fundamentals",
        description: "Master the basics of 2D drafting and design with hands-on projects",
        thumbnail: "/placeholder.svg?height=300&width=500&text=AutoCAD+Fundamentals",
        level: "Beginner",
        students: 1234,
        duration: "6 hours",
        createdAt: new Date().toISOString(),
        chapters: [
          {
            id: "1",
            title: "Getting Started with AutoCAD",
            description: "Introduction to the AutoCAD interface and basic navigation",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration: "15 min",
            order: 1,
          },
          {
            id: "2",
            title: "Basic Drawing Tools",
            description: "Learn to use lines, circles, rectangles and other basic drawing tools",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration: "20 min",
            order: 2,
          },
          {
            id: "3",
            title: "Layers and Properties",
            description: "Understanding layers, colors, and line types",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration: "18 min",
            order: 3,
          },
        ],
      },
      {
        id: "2",
        title: "3D Modeling Mastery",
        description: "Advanced 3D modeling techniques and professional workflows",
        thumbnail: "/placeholder.svg?height=300&width=500&text=3D+Modeling",
        level: "Intermediate",
        students: 856,
        duration: "8 hours",
        createdAt: new Date().toISOString(),
        chapters: [
          {
            id: "1",
            title: "3D Workspace Setup",
            description: "Setting up your workspace for 3D modeling",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration: "12 min",
            order: 1,
          },
          {
            id: "2",
            title: "Basic 3D Shapes",
            description: "Creating and manipulating basic 3D primitives",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration: "22 min",
            order: 2,
          },
        ],
      },
    ]
  }
}
