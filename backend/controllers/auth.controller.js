import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import User from "../models/user.model.js"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

export async function signup(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { username, fullname, email, password, age, height, weight } = req.body

    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ error: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user = new User({
            username,
            fullName: fullname,
            email,
            password: hashedPassword,
            age,
            height,
            weight,
        })

        await user.save()

        const payload = { user: { id: user.id } }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        })
    } catch (err) {
        console.error("Signup error:", err.message)
        res.status(500).json({ error: "Server error during signup" })
    }
}

export async function login(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const payload = { user: { id: user.id } }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        })
    } catch (err) {
        console.error("Login error:", err.message)
        res.status(500).json({ error: "Server error during login" })
    }
}
