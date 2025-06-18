import mongoose, { mongo } from "mongoose";
import Consumption from "../models/consumption.model.js"

export const getAllConsumptions = async (req, res) => {
    try {
        const consumptions = await Consumption.find({});
        if(!consumptions || consumptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No consumptions found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Consumptions fetched successfully",
            data: consumptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch consumptions",
            error: error.message
        });
    }
}

export const getConsumptionById = async (req, res) => {
    const userId = req.params.userId;
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
    try {
        const userConsumptions = await Consumption.find({ user: userId });
        if(!userConsumptions || userConsumptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No consumptions found for this user"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Consumptions fetched successfully",
            data: userConsumptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch consumptions",
            error: error.message
        });
    }
}

export const getConsumptionByIdAndDate = async (req, res) => {
    const {userId, date} = req.body;
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
    try {
        var userDate = new Date(date);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid date format"
        });
    }
    try {
        const userConsumption = await Consumption.find({ 
            user: userId, 
            date: { $gte: new Date(userDate.setHours(0, 0, 0, 0)), $lte: new Date(userDate.setHours(23, 59, 59, 999)) } 
        });
        if(!userConsumption || userConsumption.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No consumptions found for this user on the specified date"
            });
        }
        res.status(200).json({
            success: true,
            message: "Consumption fetched successfully",
            data: userConsumption
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch consumption",
            error: error.message
        });
    }
}

export const addConsumption = async (req, res) => {
    const consumptionData = req.body;
    if(!consumptionData.user || !consumptionData.food || !consumptionData.date || !consumptionData.quantity) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    if(!mongoose.Types.ObjectId.isValid(consumptionData.user) || !mongoose.Types.ObjectId.isValid(consumptionData.food)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user or food ID"
        });
    }
    try {
        const newConsumption = new Consumption(consumptionData);
        await newConsumption.save();
        res.status(201).json({
            success: true,
            message: "Consumption added successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add consumption",
            error: error.message
        });
    }
}

export const updateConsumption = async (req, res) => {
    const id = req.params.id;
    const consumptionData = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid consumption ID"
        });
    }
    if(!consumptionData.user || !consumptionData.food || !consumptionData.date || !consumptionData.quantity) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    if(!mongoose.Types.ObjectId.isValid(consumptionData.user) || !mongoose.Types.ObjectId.isValid(consumptionData.food)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user or food ID"
        });
    }
    try {
        const updatedConsumption = await Consumption.findByIdAndUpdate(id, consumptionData, { new: true });
        if(!updatedConsumption) {
            return res.status(404).json({
                success: false,
                message: "Consumption not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Consumption updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update consumption",
            error: error.message
        });
    }
}

export const deleteConsumption = async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid consumption ID"
        });
    }
    try {
        const deletedConsumption = await Consumption.findByIdAndDelete(id);
        if(!deletedConsumption) {
            return res.status(404).json({
                success: false,
                message: "Consumption not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Consumption deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete consumption",
            error: error.message
        });
    }
}