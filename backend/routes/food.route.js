import express from 'express';
import { addFood, deleteFood, getAllFoods, getFoodById, updateFood } from '../controllers/food.controller.js';

const router = express.Router();

router.get("/getAll", getAllFoods);
router.get("/:id", getFoodById);
router.post("/add", addFood);
router.patch("/update/:id", updateFood);
router.delete("/delete/:id", deleteFood);

export default router;