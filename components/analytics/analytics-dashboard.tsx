"use client"

import { useState, useEffect } from "react"
import { FloatingCard } from "@/components/ui/floating-card"
import { Analytics } from "@/lib/analytics"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Eye, Clock, TrendingUp, BookOpen, Play, Award, Activity } from "lucide-react"

export function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      const data = Analytics.getDashboardData()
      setDashboardData(data)
      setLoading(false)
    }

    loadData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const COLORS = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"]

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Users",
            value: dashboardData.totalUsers,
            icon: Users,
            gradient: "from-green-500 to-emerald-500",
          },
          {
            title: "Total Events",
            value: dashboardData.totalEvents,
            icon: Activity,
            gradient: "from-emerald-500 to-teal-500",
          },
          {
            title: "Avg Time Spent",
            value: `${dashboardData.engagementMetrics.averageTimeSpent}m`,
            icon: Clock,
            gradient: "from-teal-500 to-green-500",
          },
          {
            title: "Completion Rate",
            value: `${dashboardData.engagementMetrics.completionRate}%`,
            icon: Award,
            gradient: "from-green-600 to-emerald-600",
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

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Courses Chart */}
        <FloatingCard>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Top Courses by Views
            </h3>
            {dashboardData.topCourses.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.topCourses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="courseId" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="views" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-white/60">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No course data available yet</p>
              </div>
            )}
          </div>
        </FloatingCard>

        {/* Engagement Metrics Pie Chart */}
        <FloatingCard>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-green-400" />
              Engagement Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Active Users", value: dashboardData.totalUsers },
                    {
                      name: "Course Views",
                      value: dashboardData.topCourses.reduce((acc, course) => acc + course.views, 0),
                    },
                    {
                      name: "Completions",
                      value: dashboardData.topCourses.reduce((acc, course) => acc + course.completions, 0),
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {[0, 1, 2].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </FloatingCard>
      </div>

      {/* Recent Activity */}
      <FloatingCard>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-400" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      {event.type === "course_view" && <Eye className="h-4 w-4 text-green-400" />}
                      {event.type === "chapter_start" && <Play className="h-4 w-4 text-blue-400" />}
                      {event.type === "chapter_complete" && <Award className="h-4 w-4 text-yellow-400" />}
                      {event.type === "page_view" && <BookOpen className="h-4 w-4 text-purple-400" />}
                      {event.type === "button_click" && <TrendingUp className="h-4 w-4 text-orange-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{event.type.replace("_", " ")}</p>
                      <p className="text-white/60 text-sm">
                        User: {event.userId.slice(-8)}
                        {event.courseId && ` • Course: ${event.courseId}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-white/40 text-sm">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-white/60">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </FloatingCard>
    </div>
  )
}
