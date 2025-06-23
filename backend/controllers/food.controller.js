import mongoose from "mongoose";
import Food from "../models/food.model.js";

export const getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find({});
        if (foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No foods found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Foods fetched successfully",
            data: foods
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch foods",
            error: error.message
        });
    }
}

export const getFoodById = async (req, res) => {
    const id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
        return res.status(400).json({
            success: false,
            message: "Invalid food ID"
        });
    }
    try {
        const food = await Food.findById(id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Food fetched successfully",
            data: food
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food",
            error: error.message
        });
    }
}

export const getFoodByUserId = async (req, res) => {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
    try {
        const foods = await Food.find({ user: userId });
        if (foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No foods found for this user"
            });
        }
        res.status(200).json({
            success: true,
            message: "Foods fetched successfully",
            data: foods
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch foods",
            error: error.message
        });
    }
}

export const getFoodByUserIdAndDate = async (req, res) => {
    const { userId, date } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
    try {
        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format"
            });
        }
        const dateObj = new Date(date);
        const foods = await Food.find({ user: userId, date: { $gte: new Date(dateObj.setHours(0, 0, 0, 0)), $lte: new Date(dateObj.setHours(23, 59, 59, 999)) } });
        if (foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No foods found for this user on the specified date"
            });
        }
        res.status(200).json({
            success: true,
            message: "Foods fetched successfully",
            data: foods
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch foods",
            error: error.message
        });
    }
}

export const addFood = async (req, res) => {
    const foodData = req.body;
    if (!foodData.name || !foodData.calories || !foodData.user || !foodData.date) {
        return res.status(400).json({
            success: false,
            message: "Name and calories are required"
        });
    }
    if (!mongoose.Types.ObjectId.isValid(foodData.user)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
    try {
        foodData.date = new Date(foodData.date);
        if (isNaN(foodData.date.getTime())) {
            throw new Error("Invalid date format");
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Invalid date format"
        });
    }
    try {
        const newFood = new Food(foodData);
        await newFood.save();
        res.status(201).json({
            success: true,
            message: "Food added successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add food",
            error: error.message
        });
    }
}

export const updateFood = async (req, res) => {
    const id = req.params.id;
    const foodData = req.body;
    if (!foodData.name || !foodData.calories || !foodData.user || !foodData.date) {
        return res.status(400).json({
            success: false,
            message: "Name and calories are required"
        });
    }
    if (!mongoose.Types.ObjectId.isValid(foodData.user)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
    try {
        foodData.date = new Date(foodData.date);
        if (isNaN(foodData.date.getTime())) {
            throw new Error("Invalid date format");
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Invalid date format"
        });
    }
    try {
        const updatedFood = await Food.findByIdAndUpdate(id, foodData, { new: true });
        if (!updatedFood) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Food updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update food",
            error: error.message
        });
    }
}

export const deleteFood = async (req, res) => {
    const id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
        return res.status(400).json({
            success: false,
            message: "Invalid food ID"
        });
    }
    try {
        const deletedFood = await Food.findByIdAndDelete(id);
        if (!deletedFood) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Food deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete food",
            error: error.message
        });
    }
}