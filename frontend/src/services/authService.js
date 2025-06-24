import api from "./api"

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      const { token } = response.data

      localStorage.setItem("authToken", token)
      localStorage.setItem("userEmail", email)

      return { success: true, token, email }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  },

  signup: async (email, password) => {
    try {
      const response = await api.post("/auth/signup", { email, password })
      const { token } = response.data

      localStorage.setItem("authToken", token)
      localStorage.setItem("userEmail", email)

      return { success: true, token, email }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Signup failed",
      }
    }
  },

  logout: () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userEmail")
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken")
  },

  getCurrentUserEmail: () => {
    return localStorage.getItem("userEmail")
  },
}
