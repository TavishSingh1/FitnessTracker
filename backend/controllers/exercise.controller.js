import mongoose from "mongoose";
import Exercise from "../models/exercise.model.js"

export const getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find({});

        if (exercises.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No exercises found."
            });
        }

        res.status(200).json({
            success: true,
            data: exercises
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching exercises.",
            error: error.message
        });
    }
}

export const addExercise = async (req, res) => {
    const exerciseData = req.body;

    if (!exerciseData.name || !exerciseData.duration || !exerciseData.caloriesBurned) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields: name, duration, and calories burned (caloriesBurned)."
        });
    }

    const newExercise = new Exercise(exerciseData);

    try {
        await newExercise.save();
        res.status(201).json({
            success: true,
            message: "Exercise added successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding exercise.",
            error: error.message
        });
    }
}

export const updateExercise = async (req, res) => {
    const exerciseId = req.params.id;
    const exerciseData = req.body;

    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid exercise ID."
        });
    }

    if (!exerciseData.name || !exerciseData.duration || !exerciseData.caloriesBurned) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields: name, duration, and calories burned (caloriesBurned)."
        });
    }

    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(exerciseId, exerciseData, { new: true });

        if (!updatedExercise) {
            return res.status(404).json({
                success: false,
                message: "Exercise not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Exercise updated successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating exercise.",
            error: error.message
        });
    }
}

export const deleteExercise = async (req, res) => {
    const exerciseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid exercise ID."
        });
    }

    try {
        const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);

        if (!deletedExercise) {
            return res.status(404).json({
                success: false,
                message: "Exercise not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Exercise deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting exercise.",
            error: error.message
        });
    }
}