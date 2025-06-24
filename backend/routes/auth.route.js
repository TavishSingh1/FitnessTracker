import express from "express"
import { body } from "express-validator"
import { signup, login } from "../controllers/auth.controller.js"

const router = express.Router()

const signupValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").exists().withMessage("Password is required"),
]

router.post("/signup", signupValidation, signup)
router.post("/login", loginValidation, login)

export default router
