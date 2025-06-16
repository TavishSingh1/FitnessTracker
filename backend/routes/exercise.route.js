import express from 'express';
import { addExercise, deleteExercise, getAllExercises, updateExercise } from '../controllers/exercise.controller.js';

const router = express.Router();

router.get("/getAll", getAllExercises);
router.post("/add", addExercise);
router.patch("/update/:id", updateExercise);
router.delete("/delete/:id", deleteExercise);

export default router;