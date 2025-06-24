"use client"

import { useState } from "react"
import { authService } from "../../services/authService"
import "./login.css"

const LoginPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      alert("Please fill in all required fields.")
      setLoading(false)
      return
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      let result
      if (isLogin) {
        result = await authService.login(email, password)
      } else {
        result = await authService.signup(email, password)
      }

      if (result.success) {
        onLoginSuccess(result.email)
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {!isLogin && (
            <>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="switch-mode">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleMode}>{isLogin ? "Sign Up" : "Login"}</span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
