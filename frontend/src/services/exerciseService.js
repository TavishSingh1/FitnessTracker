import api from "./api"

export const exerciseService = {
  getAllExercises: async () => {
    try {
      const response = await api.get("/exercise/getAll")
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch exercises",
      }
    }
  },

  getExerciseById: async (id) => {
    try {
      const response = await api.get(`/exercise/${id}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch exercise",
      }
    }
  },

  addExercise: async (exerciseData) => {
    try {
      const response = await api.post("/exercise/add", exerciseData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add exercise",
      }
    }
  },

  updateExercise: async (id, exerciseData) => {
    try {
      const response = await api.patch(`/exercise/update/${id}`, exerciseData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update exercise",
      }
    }
  },

  deleteExercise: async (id) => {
    try {
      const response = await api.delete(`/exercise/delete/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete exercise",
      }
    }
  },
}
