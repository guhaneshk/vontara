"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Analytics } from "@/lib/analytics"
import { AnimatedButton } from "@/components/ui/animated-button"
import { FloatingCard } from "@/components/ui/floating-card"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Logo } from "@/components/ui/logo"
import { ChevronLeft, Play, CheckCircle, Circle, Clock, BookOpen, Users } from "lucide-react"
import { CourseManagerSupabase } from "@/lib/course-manager-supabase"
import type { Course, Chapter } from "@/lib/supabase"

type CourseWithChapters = Course & { chapters: Chapter[] }

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<CourseWithChapters | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    setLoading(true)
    const foundCourse = await CourseManagerSupabase.getCourse(courseId)
    setCourse(foundCourse)
    setLoading(false)

    // Load completed chapters from localStorage
    const saved = localStorage.getItem(`course_${courseId}_progress`)
    if (saved) {
      setCompletedChapters(new Set(JSON.parse(saved)))
    }
  }

  useEffect(() => {
    if (course) {
      Analytics.trackCourseView(course.id)
    }
  }, [course])

  const setCurrentChapterWithTracking = (index: number) => {
    setCurrentChapter(index)
    if (course && course.chapters[index]) {
      Analytics.trackChapterStart(course.id, course.chapters[index].id)
    }
  }

  const toggleChapterComplete = (chapterId: string) => {
    const newCompleted = new Set(completedChapters)
    if (newCompleted.has(chapterId)) {
      newCompleted.delete(chapterId)
    } else {
      newCompleted.add(chapterId)
      // Track chapter completion
      if (course) {
        Analytics.trackChapterComplete(course.id, chapterId)

        // Check if course is complete
        if (newCompleted.size === course.chapters.length) {
          Analytics.trackCourseComplete(course.id)
        }
      }
    }
    setCompletedChapters(newCompleted)
    localStorage.setItem(`course_${courseId}_progress`, JSON.stringify(Array.from(newCompleted)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <nav className="relative z-50 p-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/courses" className="flex items-center text-white hover:text-green-300 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
          <FloatingCard>
            <div className="glass rounded-3xl p-12 text-center max-w-md">
              <Logo size="xl" className="mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-4">Course Not Found</h3>
              <p className="text-white/80 mb-6">This course doesn't exist or has been removed.</p>
              <Link href="/courses">
                <AnimatedButton>Back to Courses</AnimatedButton>
              </Link>
            </div>
          </FloatingCard>
        </div>
      </div>
    )
  }

  const progress = course.chapters.length > 0 ? Math.round((completedChapters.size / course.chapters.length) * 100) : 0
  const currentChapterData = course.chapters[currentChapter]

  if (!currentChapterData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <nav className="relative z-50 p-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/courses" className="flex items-center text-white hover:text-green-300 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
          <FloatingCard>
            <div className="glass rounded-3xl p-12 text-center max-w-md">
              <Logo size="xl" className="mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-4">No Chapters Available</h3>
              <p className="text-white/80 mb-6">This course doesn't have any chapters yet.</p>
              <Link href="/courses">
                <AnimatedButton>Back to Courses</AnimatedButton>
              </Link>
            </div>
          </FloatingCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/courses"
            className="flex items-center text-white hover:text-green-300 transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-white" />
            <span className="text-white font-semibold">{course.title}</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Course Header */}
        <FloatingCard className="mb-8">
          <div className="glass rounded-3xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h1 className="text-4xl font-bold text-white mb-4 text-glow">{course.title}</h1>
                <p className="text-white/80 text-lg mb-6">{course.description}</p>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-white/60" />
                    <span className="text-white/80">{course.students} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-white/60" />
                    <span className="text-white/80">{course.duration}</span>
                  </div>
                </div>
                <ProgressBar value={progress} showLabel className="mb-4" />
                <p className="text-white/60">
                  {completedChapters.size} of {course.chapters.length} chapters completed
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src={
                    course.thumbnail || "/placeholder.svg?height=300&width=400&text=" + encodeURIComponent(course.title)
                  }
                  alt={course.title}
                  className="w-full max-w-sm rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </FloatingCard>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FloatingCard>
              <div className="glass rounded-2xl p-6 sticky top-8">
                <h3 className="text-lg font-bold text-white mb-6">Course Content</h3>

                <div className="space-y-2">
                  {course.chapters
                    .sort((a, b) => a.order_number - b.order_number)
                    .map((chapter, index) => (
                      <div
                        key={chapter.id}
                        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                          index === currentChapter
                            ? "bg-green-500/20 border border-green-500/50 animate-pulse-glow"
                            : "hover:bg-white/5"
                        }`}
                        onClick={() => setCurrentChapterWithTracking(index)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleChapterComplete(chapter.id)
                          }}
                          className="flex-shrink-0 hover:scale-110 transition-transform"
                        >
                          {completedChapters.has(chapter.id) ? (
                            <CheckCircle className="h-5 w-5 text-green-400 animate-bounce" />
                          ) : (
                            <Circle className="h-5 w-5 text-white/40" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              index === currentChapter ? "text-white" : "text-white/70"
                            }`}
                          >
                            {chapter.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3 text-white/40" />
                            <span className="text-xs text-white/40">{chapter.duration}</span>
                          </div>
                        </div>
                        {index === currentChapter && <Play className="h-4 w-4 text-green-400 animate-pulse" />}
                      </div>
                    ))}
                </div>
              </div>
            </FloatingCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <FloatingCard>
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{currentChapterData.title}</h2>
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm inline-block animate-float">
                      Chapter {currentChapter + 1} of {course.chapters.length}
                    </div>
                  </div>
                  <AnimatedButton
                    onClick={() => toggleChapterComplete(currentChapterData.id)}
                    variant={completedChapters.has(currentChapterData.id) ? "primary" : "outline"}
                  >
                    {completedChapters.has(currentChapterData.id) ? "Completed ✓" : "Mark Complete"}
                  </AnimatedButton>
                </div>

                {/* Chapter Description */}
                <p className="text-white/80 mb-6">{currentChapterData.description}</p>

                {/* Video Player */}
                <div className="aspect-video bg-black rounded-2xl mb-8 overflow-hidden hover:scale-105 transition-transform duration-300">
                  <iframe
                    src={currentChapterData.video_url}
                    title={currentChapterData.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>

                {/* Chapter Navigation */}
                <div className="flex justify-between">
                  <AnimatedButton
                    variant="outline"
                    onClick={() => setCurrentChapterWithTracking(Math.max(0, currentChapter - 1))}
                    disabled={currentChapter === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Chapter
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() =>
                      setCurrentChapterWithTracking(Math.min(course.chapters.length - 1, currentChapter + 1))
                    }
                    disabled={currentChapter === course.chapters.length - 1}
                  >
                    Next Chapter
                    <Play className="h-4 w-4 ml-2" />
                  </AnimatedButton>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>
    </div>
  )
}
