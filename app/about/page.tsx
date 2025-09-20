"use client"

import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"
import { FloatingCard } from "@/components/ui/floating-card"
import { Logo } from "@/components/ui/logo"
import { Users, BookOpen } from "lucide-react"

export default function AboutPage() {
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
              href="/courses"
              className="text-white hover:text-green-300 transition-all duration-300 font-medium hover:scale-105"
            >
              Courses
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
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-6 text-glow animate-gradient bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            About Vontara
          </h1>
          <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            We're high school students who noticed there weren't any free AutoCAD courses out there, so we decided to
            make one.
          </p>
        </div>

        {/* Simple Story Section */}
        <FloatingCard className="mb-16">
          <div className="glass rounded-3xl p-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-8 text-glow">That's It</h2>
            <p className="text-white/80 text-xl leading-relaxed max-w-3xl mx-auto">
              We couldn't find good free AutoCAD tutorials online, so we made our own. Everything is free because we
              think everyone should be able to learn these skills.
            </p>
          </div>
        </FloatingCard>

        {/* CTA Section */}
        <FloatingCard>
          <div className="glass rounded-3xl p-16 text-center">
            <h3 className="text-4xl font-bold text-white mb-6 text-glow">Ready to Start Learning?</h3>
            <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">Check out our free AutoCAD courses.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <AnimatedButton size="lg" className="px-12 py-6 text-xl">
                  <BookOpen className="mr-3 h-6 w-6" />
                  Start Learning
                </AnimatedButton>
              </Link>
              <Link href="/team">
                <AnimatedButton variant="outline" size="lg" className="px-12 py-6 text-xl">
                  <Users className="mr-3 h-6 w-6" />
                  Meet Our Team
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </FloatingCard>
      </div>
    </div>
  )
}
