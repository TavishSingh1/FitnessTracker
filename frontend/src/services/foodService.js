import api from "./api"

export const foodService = {
  getAllFoods: async () => {
    try {
      const response = await api.get("/food/getAll")
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch foods",
      }
    }
  },

  getFoodById: async (id) => {
    try {
      const response = await api.get(`/food/${id}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch food",
      }
    }
  },

  getFoodByUserId: async (userId) => {
    try {
      const response = await api.get(`/food/getByUser/${userId}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user foods",
      }
    }
  },

  getFoodByUserIdAndDate: async (userId, date) => {
    try {
      const response = await api.post("/food/getByUserAndDate", { userId, date })
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch foods for date",
      }
    }
  },

  addFood: async (foodData) => {
    try {
      const response = await api.post("/food/add", foodData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add food",
      }
    }
  },

  updateFood: async (id, foodData) => {
    try {
      const response = await api.patch(`/food/update/${id}`, foodData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update food",
      }
    }
  },

  deleteFood: async (id) => {
    try {
      const response = await api.delete(`/food/delete/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete food",
      }
    }
  },
}
