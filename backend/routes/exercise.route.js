import express from 'express';
import { addExercise, deleteExercise, getAllExercises, getExerciseById, updateExercise } from '../controllers/exercise.controller.js';

const router = express.Router();

router.get("/getAll", getAllExercises);
router.post("/add", addExercise);
router.patch("/update/:id", updateExercise);
router.delete("/delete/:id", deleteExercise);
router.get("/:id", getExerciseById);

export default router;