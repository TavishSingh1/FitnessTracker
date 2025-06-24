import api from "./api"

export const authService = {
  login: async (email, password) => {
    try {
      console.log("Attempting login for:", email)
      const response = await api.post("/auth/login", { email, password })
      console.log("Login response:", response.data)

      const { token } = response.data

      if (!token) {
        console.error("No token received from server")
        return { success: false, error: "No token received" }
      }

      localStorage.setItem("authToken", token)
      localStorage.setItem("userEmail", email)

      console.log("Token stored in localStorage:", localStorage.getItem("authToken"))

      return { success: true, token, email }
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

      const { token } = response.data

      if (!token) {
        return { success: false, error: "No token received" }
      }

      localStorage.setItem("authToken", token)
      localStorage.setItem("userEmail", email)

      return { success: true, token, email }
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
}
