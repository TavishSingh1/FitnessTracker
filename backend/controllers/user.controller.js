import User from '../models/user.model.js';
import mongoose from 'mongoose';

export const registerUser = async (req, res) => {
    const userData = req.body;

    if (!userData.username || !userData.fullName || !userData.email || !userData.password || !userData.age || !userData.height || !userData.weight) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields: username, email, password, age, height, weight."
        })
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!regex.test(userData.password)) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
    }

    const newUser = new User(userData);

    try {
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user.",
            error: error.message
        });
    }
}

export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID."
        });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user.",
            error: error.message
        });
    }
}

export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID."
        });
    }

    if (!updateData.username && !updateData.fullName && !updateData.email && !updateData.password && !updateData.age && !updateData.height && !updateData.weight) {
        return res.status(400).json({
            success: false,
            message: "Please provide at least one field to update."
        });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user.",
            error: error.message
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found."
            });
        }

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users.",
            error: error.message
        });
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide both username and password."
        });
    }
    try {
        const user = await User.find({ username: username, password: password });
        if (user.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }
        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: user[0]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in.",
            error: error.message
        });
    }
}