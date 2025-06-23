import React, { useState } from "react";
import "./login.css";

const LoginPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Simulate successful login/signup
    alert(`${isLogin ? "Login" : "Signup"} successful!`);
    onLoginSuccess(); // Go to home page
  };

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
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
              />
            </>
          )}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <p className="switch-mode">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleMode}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
