import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  level: "Beginner" | "Intermediate" | "Advanced"
  students: number
  duration: string
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  course_id: string
  title: string
  description: string
  video_url: string
  duration: string
  order_number: number
  created_at: string
  updated_at: string
}
