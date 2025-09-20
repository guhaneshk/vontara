"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"
import { FloatingCard } from "@/components/ui/floating-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/ui/logo"
import { AdminAuth } from "@/lib/admin-auth"
import { CourseManager, type Course, type Chapter } from "@/lib/course-manager"
import { Plus, Trash2, Edit, LogOut, Settings, BookOpen, Users, Play, Save, X, Youtube } from "lucide-react"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showChapterForm, setShowChapterForm] = useState<string | null>(null)
  const [editingChapter, setEditingChapter] = useState<{ courseId: string; chapter: Chapter } | null>(null)
  const router = useRouter()

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    level: "Beginner" as const,
    duration: "",
  })

  const [chapterForm, setChapterForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: "",
  })

  useEffect(() => {
    setIsAuthenticated(AdminAuth.isAuthenticated())
    if (AdminAuth.isAuthenticated()) {
      setCourses(CourseManager.getCourses())
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (AdminAuth.login(password)) {
      setIsAuthenticated(true)
      setCourses(CourseManager.getCourses())
      setError("")
    } else {
      setError("Invalid password")
    }
  }

  const handleLogout = () => {
    AdminAuth.logout()
    setIsAuthenticated(false)
    router.push("/")
  }

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    const newCourse = CourseManager.addCourse({
      ...courseForm,
      chapters: [],
    })
    setCourses(CourseManager.getCourses())
    setCourseForm({ title: "", description: "", thumbnail: "", level: "Beginner", duration: "" })
    setShowCourseForm(false)
  }

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCourse) {
      CourseManager.updateCourse(editingCourse.id, courseForm)
      setCourses(CourseManager.getCourses())
      setEditingCourse(null)
      setCourseForm({ title: "", description: "", thumbnail: "", level: "Beginner", duration: "" })
    }
  }

  const handleDeleteCourse = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      CourseManager.deleteCourse(id)
      setCourses(CourseManager.getCourses())
    }
  }

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault()
    if (showChapterForm) {
      CourseManager.addChapter(showChapterForm, chapterForm)
      setCourses(CourseManager.getCourses())
      setChapterForm({ title: "", description: "", videoUrl: "", duration: "" })
      setShowChapterForm(null)
    }
  }

  const handleUpdateChapter = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingChapter) {
      CourseManager.updateChapter(editingChapter.courseId, editingChapter.chapter.id, chapterForm)
      setCourses(CourseManager.getCourses())
      setEditingChapter(null)
      setChapterForm({ title: "", description: "", videoUrl: "", duration: "" })
    }
  }

  const handleDeleteChapter = (courseId: string, chapterId: string) => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      CourseManager.deleteChapter(courseId, chapterId)
      setCourses(CourseManager.getCourses())
    }
  }

  const startEditCourse = (course: Course) => {
    setEditingCourse(course)
    setCourseForm({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      level: course.level,
      duration: course.duration,
    })
    setShowCourseForm(true)
  }

  const startEditChapter = (courseId: string, chapter: Chapter) => {
    setEditingChapter({ courseId, chapter })
    setChapterForm({
      title: chapter.title,
      description: chapter.description,
      videoUrl: chapter.videoUrl,
      duration: chapter.duration,
    })
  }

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : ""
  }

  const formatYouTubeUrl = (url: string): string => {
    const videoId = extractYouTubeId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden flex items-center justify-center p-6">
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
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-md">
          <FloatingCard>
            <div className="glass rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <Settings className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 text-glow">Vontara Admin</h1>
                <p className="text-white/80 text-lg">Enter admin password to continue</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-200 text-center animate-bounce">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="password" className="text-white/80 font-medium">
                    Admin Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                    placeholder="Enter admin password"
                    required
                  />
                </div>

                <AnimatedButton type="submit" size="lg" className="w-full">
                  Access Admin Panel
                </AnimatedButton>
              </form>

              <div className="mt-6 text-center">
                <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors hover:scale-105">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative">
      <div className="absolute inset-0 dot-pattern opacity-20" />

      {/* Navigation */}
      <nav className="relative z-10 p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center text-white hover:text-green-300 transition-all duration-300 hover:scale-105"
            >
              <Logo size="sm" className="mr-2" />
              Back to Site
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Vontara Admin</h1>
                <p className="text-white/60 text-sm">Course Management System</p>
              </div>
            </div>
          </div>
          <AnimatedButton variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </AnimatedButton>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Courses",
              value: courses.length,
              icon: BookOpen,
              gradient: "from-green-500 to-emerald-500",
            },
            {
              title: "Total Students",
              value: courses.reduce((acc, course) => acc + course.students, 0),
              icon: Users,
              gradient: "from-emerald-500 to-teal-500",
            },
            {
              title: "Total Chapters",
              value: courses.reduce((acc, course) => acc + course.chapters.length, 0),
              icon: Play,
              gradient: "from-teal-500 to-green-500",
            },
          ].map((stat, index) => (
            <FloatingCard key={index}>
              <div className="glass rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-white animate-pulse">{stat.value}</p>
                  </div>
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center group-hover:animate-bounce`}
                  >
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </FloatingCard>
          ))}
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-glow mb-6">Analytics Dashboard</h2>
          <AnalyticsDashboard />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white text-glow">Course Management</h2>
            <p className="text-white/70 mt-1">Create, edit, and manage your AutoCAD courses</p>
          </div>
          <AnimatedButton onClick={() => setShowCourseForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </AnimatedButton>
        </div>

        {/* Course Form */}
        {showCourseForm && (
          <FloatingCard className="mb-8">
            <div className="glass rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{editingCourse ? "Edit Course" : "Create New Course"}</h3>
                <button
                  onClick={() => {
                    setShowCourseForm(false)
                    setEditingCourse(null)
                    setCourseForm({ title: "", description: "", thumbnail: "", level: "Beginner", duration: "" })
                  }}
                  className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white/80 font-medium">Course Title</Label>
                    <Input
                      value={courseForm.title}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                      placeholder="e.g., AutoCAD Fundamentals"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 font-medium">Duration</Label>
                    <Input
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, duration: e.target.value }))}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                      placeholder="e.g., 6 hours"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white/80 font-medium">Thumbnail URL</Label>
                    <Input
                      value={courseForm.thumbnail}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, thumbnail: e.target.value }))}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 font-medium">Level</Label>
                    <Select
                      value={courseForm.level}
                      onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") =>
                        setCourseForm((prev) => ({ ...prev, level: value }))
                      }
                    >
                      <SelectTrigger className="mt-2 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 font-medium">Description</Label>
                  <Textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                    rows={4}
                    placeholder="Describe what students will learn..."
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <AnimatedButton type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingCourse ? "Update Course" : "Create Course"}
                  </AnimatedButton>
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCourseForm(false)
                      setEditingCourse(null)
                      setCourseForm({ title: "", description: "", thumbnail: "", level: "Beginner", duration: "" })
                    }}
                  >
                    Cancel
                  </AnimatedButton>
                </div>
              </form>
            </div>
          </FloatingCard>
        )}

        {/* Chapter Form */}
        {(showChapterForm || editingChapter) && (
          <FloatingCard className="mb-8">
            <div className="glass rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{editingChapter ? "Edit Chapter" : "Add New Chapter"}</h3>
                <button
                  onClick={() => {
                    setShowChapterForm(null)
                    setEditingChapter(null)
                    setChapterForm({ title: "", description: "", videoUrl: "", duration: "" })
                  }}
                  className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={editingChapter ? handleUpdateChapter : handleCreateChapter} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white/80 font-medium">Chapter Title</Label>
                    <Input
                      value={chapterForm.title}
                      onChange={(e) => setChapterForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                      placeholder="e.g., Getting Started with AutoCAD"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 font-medium">Duration</Label>
                    <Input
                      value={chapterForm.duration}
                      onChange={(e) => setChapterForm((prev) => ({ ...prev, duration: e.target.value }))}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                      placeholder="e.g., 15 min"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/80 font-medium flex items-center">
                    <Youtube className="h-4 w-4 mr-2 animate-pulse" />
                    YouTube Video URL
                  </Label>
                  <Input
                    value={chapterForm.videoUrl}
                    onChange={(e) =>
                      setChapterForm((prev) => ({ ...prev, videoUrl: formatYouTubeUrl(e.target.value) }))
                    }
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-white/50 text-sm mt-1">
                    Paste any YouTube URL - it will be automatically formatted for embedding
                  </p>
                </div>
                <div>
                  <Label className="text-white/80 font-medium">Description</Label>
                  <Textarea
                    value={chapterForm.description}
                    onChange={(e) => setChapterForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-2 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-green-400 transition-all duration-300"
                    rows={3}
                    placeholder="Brief description of what this chapter covers..."
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <AnimatedButton type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingChapter ? "Update Chapter" : "Add Chapter"}
                  </AnimatedButton>
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowChapterForm(null)
                      setEditingChapter(null)
                      setChapterForm({ title: "", description: "", videoUrl: "", duration: "" })
                    }}
                  >
                    Cancel
                  </AnimatedButton>
                </div>
              </form>
            </div>
          </FloatingCard>
        )}

        {/* Courses List */}
        <div className="space-y-6">
          {courses.map((course, index) => (
            <FloatingCard key={course.id}>
              <div className="glass rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">
                        {course.title}
                      </h4>
                      <span
                        className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm animate-float"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        {course.level}
                      </span>
                    </div>
                    <p className="text-white/70 mb-4">{course.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-sm">
                        {course.chapters.length} chapters
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-300 text-sm">
                        {course.students} students
                      </div>
                      <div className="px-3 py-1 bg-teal-500/20 border border-teal-500/50 rounded-full text-teal-300 text-sm">
                        {course.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <AnimatedButton size="sm" onClick={() => setShowChapterForm(course.id)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Chapter
                    </AnimatedButton>
                    <AnimatedButton size="sm" variant="outline" onClick={() => startEditCourse(course)}>
                      <Edit className="h-4 w-4" />
                    </AnimatedButton>
                    <AnimatedButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="border-red-500/50 text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </AnimatedButton>
                  </div>
                </div>

                {/* Chapters */}
                {course.chapters.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h5 className="text-lg font-semibold text-white mb-4">Chapters</h5>
                    <div className="space-y-3">
                      {course.chapters
                        .sort((a, b) => a.order - b.order)
                        .map((chapter, chapterIndex) => (
                          <div
                            key={chapter.id}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="text-white/60 text-sm animate-pulse">#{chapter.order}</span>
                                <h6 className="text-white font-medium">{chapter.title}</h6>
                                <span className="text-white/50 text-sm">({chapter.duration})</span>
                              </div>
                              <p className="text-white/60 text-sm mt-1">{chapter.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <AnimatedButton
                                size="sm"
                                variant="outline"
                                onClick={() => startEditChapter(course.id, chapter)}
                              >
                                <Edit className="h-3 w-3" />
                              </AnimatedButton>
                              <AnimatedButton
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteChapter(course.id, chapter.id)}
                                className="border-red-500/50 text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </AnimatedButton>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </FloatingCard>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <FloatingCard>
            <div className="glass rounded-2xl text-center py-16">
              <Logo size="xl" className="mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-3">No courses yet</h3>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Create your first course to start building your AutoCAD curriculum
              </p>
              <AnimatedButton onClick={() => setShowCourseForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </AnimatedButton>
            </div>
          </FloatingCard>
        )}
      </div>
    </div>
  )
}
