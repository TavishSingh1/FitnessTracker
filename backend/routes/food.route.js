import express from 'express';
import { addFood, deleteFood, getAllFoods, getFoodById, getFoodByUserId, getFoodByUserIdAndDate, updateFood } from '../controllers/food.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get("/getAll", auth, getAllFoods);
router.get("/:id", auth, getFoodById);
router.post("/add", auth, addFood);
router.patch("/update/:id", auth, updateFood);
router.delete("/delete/:id", auth, deleteFood);
router.get("/getByUser/:userId", auth, getFoodByUserId);
router.post("/getByUserAndDate", auth, getFoodByUserIdAndDate);

export default router;