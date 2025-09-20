// Simple admin authentication
export class AdminAuth {
  private static readonly ADMIN_PASSWORD = "Vontara2025$"
  private static readonly STORAGE_KEY = "vontara_admin_auth"

  static login(password: string): boolean {
    if (password === this.ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY, "authenticated")
      }
      return true
    }
    return false
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.STORAGE_KEY) === "authenticated"
    }
    return false
  }
}
