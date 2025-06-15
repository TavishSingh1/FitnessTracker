import express from 'express';
import { deleteUser, getAllUsers, registerUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/register", registerUser);
router.delete("/delete/:id", deleteUser);
router.patch("/update/:id", updateUser);
router.get("/getAll", getAllUsers);

export default router;