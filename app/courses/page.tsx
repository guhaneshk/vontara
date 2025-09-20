"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Analytics } from "@/lib/analytics"
import { AnimatedButton } from "@/components/ui/animated-button"
import { FloatingCard } from "@/components/ui/floating-card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/logo"
import { Clock, Users, Play, ArrowRight, BookOpen } from "lucide-react"
import { CourseManager, type Course } from "@/lib/course-manager"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedLevel, setSelectedLevel] = useState("All")
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  useEffect(() => {
    setCourses(CourseManager.getCourses())
    Analytics.trackPageView("/courses")
  }, [])

  const filteredCourses = selectedLevel === "All" ? courses : courses.filter((course) => course.level === selectedLevel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo size="md" className="group-hover:scale-110 transition-transform" />
            <span className="text-3xl font-bold text-white text-glow">Vontara</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-green-300 transition-all duration-300 font-medium hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-green-300 transition-all duration-300 font-medium hover:scale-105"
            >
              About
            </Link>
            <Link
              href="/team"
              className="text-white hover:text-green-300 transition-all duration-300 font-medium hover:scale-105"
            >
              Team
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 text-glow animate-gradient bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            AutoCAD Courses
          </h1>
          <p className="text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Easy courses designed by students, for students. Learn  fundamentals through structured
            lessons.
          </p>
        </div>

        {/* Enhanced Filter Buttons */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 glass rounded-2xl p-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  selectedLevel === level
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg animate-pulse-glow"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCourses.map((course, index) => (
            <FloatingCard key={course.id}>
              <div className="glass rounded-3xl overflow-hidden group hover:scale-105 transition-all duration-500">
                <div className="relative">
                  <img
                    src={
                      course.thumbnail ||
                      "/placeholder.svg?height=300&width=500&text=" + encodeURIComponent(course.title) ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className="bg-green-500 text-white animate-float"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm">{course.chapters.length} chapters</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">{course.description}</p>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-white/60" />
                        <span className="text-white/60 text-sm">{course.students}</span>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-400 animate-pulse">Free</span>
                  </div>

                  <Link href={`/course/${course.id}`} onClick={() => Analytics.trackCourseView(course.id)}>
                    <AnimatedButton className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Learning
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </FloatingCard>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <FloatingCard>
            <div className="glass rounded-3xl text-center py-16">
              <Logo size="xl" className="mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-3">No courses found</h3>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                {selectedLevel === "All"
                  ? "No courses are available yet. Check back soon!"
                  : `No ${selectedLevel} courses are available yet.`}
              </p>
              <AnimatedButton onClick={() => setSelectedLevel("All")}>
                <ArrowRight className="h-4 w-4 mr-2" />
                View All Courses
              </AnimatedButton>
            </div>
          </FloatingCard>
        )}

        {/* Enhanced CTA Section */}
        {filteredCourses.length > 0 && (
          <FloatingCard>
            <div className="glass rounded-3xl p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-24 h-24 border border-white rounded-full animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 2}s`,
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-bold text-white mb-6 text-glow">Ready to Start Your Journey?</h3>
                <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
                  Join students mastering AutoCAD with our comprehensive courses.
                </p>
                <AnimatedButton size="lg" className="px-12 py-6 text-xl">
                  <ArrowRight className="mr-3 h-6 w-6" />
                  Get Started Today
                </AnimatedButton>
              </div>
            </div>
          </FloatingCard>
        )}
      </div>
    </div>
  )
}
