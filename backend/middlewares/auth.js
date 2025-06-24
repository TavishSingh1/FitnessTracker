import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

export default function auth(req, res, next) {
  // Debug: Log all headers to see what's being sent
  console.log("Request headers:", req.headers)

  const token = req.header("x-auth-token") || req.header("Authorization")?.replace("Bearer ", "")

  console.log("Extracted token:", token ? "Token found" : "No token found")
  console.log("x-auth-token header:", req.header("x-auth-token"))
  console.log("Authorization header:", req.header("Authorization"))

  if (!token) {
    console.log("No token provided in request")
    return res.status(401).json({ msg: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log("Token decoded successfully:", decoded)
    req.user = decoded.user
    next()
  } catch (error) {
    console.error("Token verification failed:", error.message)
    res.status(401).json({ msg: "Token is not valid" })
  }
}
