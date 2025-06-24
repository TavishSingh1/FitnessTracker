import api from "./api"

export const authService = {
  login: async (email, password) => {
    try {
      console.log("Attempting login for:", email)
      const response = await api.post("/auth/login", { email, password })
      console.log("Login response:", response.data)

      const { token, user } = response.data

      if (!token || !user || !user.id) {
        console.error("No token or user ID received from server")
        return { success: false, error: "No token or user ID received" }
      }

      localStorage.setItem("authToken", token)
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userId", user.id)

      console.log("Token stored in localStorage:", localStorage.getItem("authToken"))
      console.log("User ID stored in localStorage:", localStorage.getItem("userId"))

      return { success: true, token, email, userId: user.id }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  },

  signup: async (email, password) => {
    try {
      console.log("Attempting signup for:", email)
      const response = await api.post("/auth/signup", { email, password })

      const { token, user } = response.data

      if (!token || !user || !user.id) {
        return { success: false, error: "No token or user ID received" }
      }

      localStorage.setItem("authToken", token)
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userId", user.id)

      return { success: true, token, email, userId: user.id }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.error || "Signup failed",
      }
    }
  },

  logout: () => {
    console.log("Logging out - clearing localStorage")
    localStorage.removeItem("authToken")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userId")
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("authToken")
    const isAuth = !!token
    console.log("Checking authentication:", isAuth)
    return isAuth
  },

  getCurrentUserEmail: () => {
    const email = localStorage.getItem("userEmail")
    return email
  },

  getCurrentUserId: () => {
    return localStorage.getItem("userId")
  },
}
