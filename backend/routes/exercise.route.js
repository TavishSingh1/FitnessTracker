import express from 'express';
import { addExercise, deleteExercise, getAllExercises, getExerciseById, updateExercise } from '../controllers/exercise.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get("/getAll", auth, getAllExercises);
router.post("/add", auth, addExercise);
router.patch("/update/:id", auth, updateExercise);
router.delete("/delete/:id", auth, deleteExercise);
router.get("/:id", auth, getExerciseById);

export default router;