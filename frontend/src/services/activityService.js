import api from "./api"

export const activityService = {
  getAllActivities: async () => {
    try {
      const response = await api.get("/activity/getAll")
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch activities",
      }
    }
  },

  getActivitiesByUser: async (userId) => {
    try {
      const response = await api.get(`/activity/user/${userId}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user activities",
      }
    }
  },

  getUserActivityOnDate: async (userId, date) => {
    try {
      const response = await api.post("/activity/userOnDate", { user: userId, date })
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch activities for date",
      }
    }
  },

  addActivity: async (activityData) => {
    try {
      const response = await api.post("/activity/add", activityData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add activity",
      }
    }
  },

  updateActivity: async (id, activityData) => {
    try {
      const response = await api.patch(`/activity/update/${id}`, activityData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update activity",
      }
    }
  },

  deleteActivity: async (id) => {
    try {
      const response = await api.delete(`/activity/delete/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete activity",
      }
    }
  },
}
