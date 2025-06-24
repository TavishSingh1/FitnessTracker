import api from "./api"

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get("/user/getAll")
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch users",
      }
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await api.post("/user/register", userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to register user",
      }
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.patch(`/user/update/${id}`, userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update user",
      }
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/user/delete/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete user",
      }
    }
  },
}
