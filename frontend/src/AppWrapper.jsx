"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "./services/authService"
import LoginPage from "./components/Login/login"
import App from "./App"

const AppWrapper = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = () => {
            if (authService.isAuthenticated()) {
                const email = authService.getCurrentUserEmail()
                if (email) {
                    const name = extractNameFromEmail(email)
                    setUserName(name)
                    setIsLoggedIn(true)
                }
            }
            setLoading(false)
        }

        checkAuth()
    }, [])

    const extractNameFromEmail = (email) => {
        if (!email || typeof email !== "string") return "User"
        const prefix = email.split("@")[0]
        return prefix
            .replace(/\./g, " ")
            .replace(/\d+/g, "")
            .replace(/\b\w/g, (char) => char.toUpperCase())
    }

    const handleLoginSuccess = (email) => {
        const name = extractNameFromEmail(email)
        setUserName(name)
        setIsLoggedIn(true)
        navigate("/")
    }

    const handleLogout = () => {
        authService.logout()
        setIsLoggedIn(false)
        setUserName("")
        navigate("/")
    }

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    background: "linear-gradient(to bottom right, #1f2937, #111827, #000000)",
                    color: "#f3f4f6",
                }}
            >
                Loading...
            </div>
        )
    }

    return isLoggedIn ? (
        <App userName={userName} onLogout={handleLogout} />
    ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
    )
}

export default AppWrapper
