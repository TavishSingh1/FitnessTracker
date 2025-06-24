import { useState } from "react"
import { authService } from "../../services/authService"
import "./login.css"

const LoginPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [fullname, setFullname] = useState("")
    const [age, setAge] = useState("")
    const [height, setHeight] = useState("")
    const [weight, setWeight] = useState("")

    const toggleMode = () => {
        setIsLogin(!isLogin)
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setUsername("")
        setFullname("")
        setAge("")
        setHeight("")
        setWeight("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!email || !password || (!isLogin && (!username || !fullname || !age || !height || !weight))) {
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
                result = await authService.signup({
                    username,
                    fullname,
                    email,
                    password,
                    age,
                    height,
                    weight,
                })
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
                    {!isLogin && (
                        <>
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </>
                    )}
                    <label>Email ID</label>
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
                            <label>Age</label>
                            <input
                                type="number"
                                placeholder="Enter age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                placeholder="Enter height in cm"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                placeholder="Enter weight in kg"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
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
