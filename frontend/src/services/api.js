import axios from "axios"

const API_BASE_URL = "https://vercel.com/vishwajith-ss-projects-a6bb0dea/fitness-tracker-backend/3UJ2eKmR2DZuYUFfFQgwwV8j8yvw/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken")
        console.log("Token from localStorage:", token ? "Token exists" : "No token found")

        if (token) {
            config.headers["x-auth-token"] = token
            console.log("Added token to headers:", config.headers["x-auth-token"])
        }

        console.log("Request config:", {
            url: config.url,
            method: config.method,
            headers: config.headers,
        })

        return config
    },
    (error) => {
        console.error("Request interceptor error:", error)
        return Promise.reject(error)
    },
)

api.interceptors.response.use(
    (response) => {
        console.log("API Response:", response.status, response.data)
        return response
    },
    (error) => {
        console.error("API Error:", error.response?.status, error.response?.data)

        if (error.response?.status === 401) {
            console.log("401 error - clearing auth data and redirecting")
            localStorage.removeItem("authToken")
            localStorage.removeItem("userEmail")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    },
)

export default api
