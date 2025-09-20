import { supabase, type Course, type Chapter } from "./supabase"

export class CourseManagerSupabase {
  // Get all courses with their chapters
  static async getCourses(): Promise<(Course & { chapters: Chapter[] })[]> {
    try {
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select(`
          *,
          chapters (*)
        `)
        .order("created_at", { ascending: true })

      if (coursesError) throw coursesError

      return (
        courses?.map((course) => ({
          ...course,
          chapters: course.chapters?.sort((a: Chapter, b: Chapter) => a.order_number - b.order_number) || [],
        })) || []
      )
    } catch (error) {
      console.error("Error fetching courses:", error)
      return []
    }
  }

  // Get single course with chapters
  static async getCourse(id: string): Promise<(Course & { chapters: Chapter[] }) | null> {
    try {
      const { data: course, error } = await supabase
        .from("courses")
        .select(`
          *,
          chapters (*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      return {
        ...course,
        chapters: course.chapters?.sort((a: Chapter, b: Chapter) => a.order_number - b.order_number) || [],
      }
    } catch (error) {
      console.error("Error fetching course:", error)
      return null
    }
  }

  // Create new course
  static async addCourse(
    courseData: Omit<Course, "id" | "created_at" | "updated_at" | "students">,
  ): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            ...courseData,
            students: 0,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating course:", error)
      return null
    }
  }

  // Update course
  static async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating course:", error)
      return null
    }
  }

  // Delete course
  static async deleteCourse(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting course:", error)
      return false
    }
  }

  // Add chapter to course
  static async addChapter(
    courseId: string,
    chapterData: Omit<Chapter, "id" | "course_id" | "created_at" | "updated_at" | "order_number">,
  ): Promise<Chapter | null> {
    try {
      // Get the next order number
      const { data: chapters } = await supabase
        .from("chapters")
        .select("order_number")
        .eq("course_id", courseId)
        .order("order_number", { ascending: false })
        .limit(1)

      const nextOrder = chapters && chapters.length > 0 ? chapters[0].order_number + 1 : 1

      const { data, error } = await supabase
        .from("chapters")
        .insert([
          {
            ...chapterData,
            course_id: courseId,
            order_number: nextOrder,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating chapter:", error)
      return null
    }
  }

  // Update chapter
  static async updateChapter(courseId: string, chapterId: string, updates: Partial<Chapter>): Promise<Chapter | null> {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chapterId)
        .eq("course_id", courseId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating chapter:", error)
      return null
    }
  }

  // Delete chapter
  static async deleteChapter(courseId: string, chapterId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("chapters").delete().eq("id", chapterId).eq("course_id", courseId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting chapter:", error)
      return false
    }
  }
}
