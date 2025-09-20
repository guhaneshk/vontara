"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Analytics } from "@/lib/analytics"
import { AnimatedButton } from "@/components/ui/animated-button"
import { FloatingCard } from "@/components/ui/floating-card"
import { Logo } from "@/components/ui/logo"
import { BookOpen, Users, ArrowRight, Play, Zap, Target, Code, Lightbulb, Rocket } from "lucide-react"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        {/* Floating particles with varied animations */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              transform: `translateY(${scrollY * 0.1 * (Math.random() - 0.5)}px)`,
            }}
          />
        ))}

        {/* Geometric shapes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            {i % 3 === 0 && <div className="w-16 h-16 border-2 border-white rounded-full" />}
            {i % 3 === 1 && <div className="w-12 h-12 border-2 border-white rotate-45" />}
            {i % 3 === 2 && <div className="w-20 h-1 bg-white rounded-full" />}
          </div>
        ))}
      </div>

      {/* Enhanced mouse follower */}
      <div
        className="fixed w-96 h-96 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-10 blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Logo size="md" className="" />
            <span className="text-xl md:text-3xl font-bold text-white text-glow">Vontara</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/courses"
              className="text-white hover:text-green-300 transition-all duration-300 font-medium hover:scale-105"
            >
              Courses
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
            <Link href="/courses" onClick={() => Analytics.trackButtonClick("nav_get_started")}>
              <AnimatedButton>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/courses">
              <AnimatedButton size="sm">
                Start
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-10 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 md:mb-8">
            <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 glass rounded-full text-white text-xs md:text-sm font-medium mb-6 md:mb-8 animate-float">
              <Zap className="h-3 w-3 md:h-4 md:w-4 mr-2 text-yellow-400" />
              Built by students, for students
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight">
            <span className="block text-white text-glow animate-gradient bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              AutoCAD Courses
            </span>
            <span className="block text-white/90 mt-2 md:mt-4">The Smart Way</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Learn AutoCAD through our courses. Our courses are designed by students who are certified.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-10 md:mb-16 px-4">
            <Link href="/courses" onClick={() => Analytics.trackButtonClick("hero_start_learning")}>
              <AnimatedButton size="lg" className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl">
                <Play className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                Start Learning for Free!
              </AnimatedButton>
            </Link>
            <Link href="/courses" onClick={() => Analytics.trackButtonClick("hero_browse_courses")}>
              <AnimatedButton variant="outline" size="lg" className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl">
                <BookOpen className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                Browse Courses
              </AnimatedButton>
            </Link>
          </div>

          {/* Updated Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 md:space-x-12 text-white/70 px-4">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-float"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="font-semibold text-sm md:text-base">Active community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 text-glow">Why Choose Vontara?</h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto px-4">
              We have easy to understand courses to learn fundamentals of AutoCAD and Onshape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              {
                icon: Code,
                title: "Easy Videos",
                description: "Easy to follow videos for AutoCAD and Onshape fundamentals.",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: Users,
                title: "Free - No Sign In Access",
                description: "Jump right into learning. No registration required, completely free.",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: Lightbulb,
                title: "Certified Tutors",
                description: "Learn from certified instructors.",
                gradient: "from-teal-500 to-green-500",
              },
            ].map((feature, index) => (
              <FloatingCard key={index} className="h-full">
                <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 text-center h-full flex flex-col group hover:scale-105 transition-all duration-500">
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 animate-pulse-glow group-hover:animate-bounce`}
                  >
                    <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-green-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed text-base md:text-lg flex-grow">{feature.description}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Updated Success Stories Section */}
      <section className="relative z-10 py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 text-glow">Interviews Coming Soon</h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto px-4">
              Coming soon + interviews with industry professionals
            </p>
          </div>

          <FloatingCard>
            <div className="glass rounded-2xl md:rounded-3xl p-8 md:p-16 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 animate-pulse-glow">
                <Play className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">More Stories Coming Soon</h3>
              <p className="text-white/80 text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
                We're working on bringing you inspiring stories from students and interviews with industry professionals
                who use AutoCAD in their daily work.
              </p>
              <Link href="/courses" onClick={() => Analytics.trackButtonClick("success_browse_courses")}>
                <AnimatedButton size="lg" className="w-full sm:w-auto">
                  <BookOpen className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                  Browse Courses
                </AnimatedButton>
              </Link>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <FloatingCard>
            <div className="glass rounded-3xl p-16 relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-32 h-32 border border-white rounded-full animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 1.5}s`,
                      animationDuration: `${8 + Math.random() * 4}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <Rocket className="h-16 w-16 text-green-400 mx-auto mb-8 animate-bounce" />
                <h3 className="text-5xl font-bold text-white mb-8 text-glow">Ready to Start Learning?</h3>
                <p className="text-white/90 text-2xl mb-12 leading-relaxed max-w-3xl mx-auto">
                  Join us and learn something new. Certificates coming soon.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/courses" onClick={() => Analytics.trackButtonClick("cta_start_learning")}>
                    <AnimatedButton size="lg" className="px-12 py-6 text-xl">
                      <Target className="mr-3 h-6 w-6" />
                      Start Learning Now
                    </AnimatedButton>
                  </Link>
                  <Link href="/courses">
                    <AnimatedButton variant="outline" size="lg" className="px-12 py-6 text-xl">
                      <BookOpen className="mr-3 h-6 w-6" />
                      Explore Courses
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Logo size="md" className="mr-3" />
            <span className="text-3xl font-bold text-white">Vontara</span>
          </div>
          <p className="text-white/60 mb-8 text-lg">Empowering young engineers</p>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-8 mb-8">
            <a
              href="https://www.instagram.com/vontaratech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors hover:scale-105"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/vontara"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors hover:scale-105"
            >
              LinkedIn
            </a>
            <a
              href="mailto:vontaratech@gmail.com"
              className="text-white/60 hover:text-white transition-colors hover:scale-105"
            >
              Contact Us
            </a>
          </div>

          <div className="flex justify-center space-x-8 text-white/60 mb-8">
            <Link href="/courses" className="hover:text-white transition-colors hover:scale-105">
              Courses
            </Link>
            <Link href="/about" className="hover:text-white transition-colors hover:scale-105">
              About
            </Link>
            <Link href="/team" className="hover:text-white transition-colors hover:scale-105">
              Team
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-white/40">
            <p>&copy; 2025 Vontara. Built with love by students, for students.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
