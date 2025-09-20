"use client"

import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"
import { FloatingCard } from "@/components/ui/floating-card"
import { Logo } from "@/components/ui/logo"
import { ArrowRight, BookOpen } from "lucide-react"

export default function TeamPage() {
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
              href="/about"
              className="text-white hover:text-green-300 transition-all duration-300 font-medium hover:scale-105"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-6 text-glow animate-gradient bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Meet the Vontara Team
          </h1>
          <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            We're high school students passionate about making AutoCAD education accessible to everyone.
          </p>
        </div>

        {/* Team Members Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Guhanesh K",
                role: "Founder/CTO",
                gradient: "from-green-500 to-emerald-500",
                initial: "G",
              },
              {
                name: "Tony K",
                role: "Creative Director",
                gradient: "from-emerald-500 to-teal-500",
                initial: "T",
              },
              {
                name: "Varun K",
                role: "Chief Tech",
                gradient: "from-teal-500 to-green-500",
                initial: "V",
              },
              {
                name: "Avyaan M",
                role: "Chief Content Strategist",
                gradient: "from-green-600 to-emerald-600",
                initial: "A",
              },
            ].map((member, index) => (
              <FloatingCard key={index}>
                <div className="glass rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-500">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce`}
                  >
                    <span className="text-2xl font-bold text-white">{member.initial}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-green-300 text-sm font-medium">{member.role}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>

        {/* Simple Join Us Section */}
        <FloatingCard className="mb-16">
          <div className="glass rounded-3xl p-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-6 text-glow">Want to Get Involved?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
              Reach out if you want to help make AutoCAD education more accessible.
            </p>
            <a href="mailto:vontaratech@gmail.com">
              <AnimatedButton size="lg" className="px-12 py-6 text-xl">
                Get Involved
              </AnimatedButton>
            </a>
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
                  Explore Courses
                </AnimatedButton>
              </Link>
              <Link href="/about">
                <AnimatedButton variant="outline" size="lg" className="px-12 py-6 text-xl">
                  <ArrowRight className="mr-3 h-6 w-6" />
                  Learn More
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </FloatingCard>
      </div>
    </div>
  )
}
