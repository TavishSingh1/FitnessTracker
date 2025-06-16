import express from 'express';
import { deleteUser, getAllUsers, loginUser, registerUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/register", registerUser);
router.delete("/delete/:id", deleteUser);
router.patch("/update/:id", updateUser);
router.get("/getAll", getAllUsers);
router.post("/login", loginUser);

export default router;