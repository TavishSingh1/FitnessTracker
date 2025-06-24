import mongoose from "mongoose";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";
import Exercise from "../models/exercise.model.js";

export const getAllActivities = async (req, res) => {
    try {
        // Populate the exercise field to get full exercise details
        const activities = await Activity.find({}).populate('exercise');

        if (!activities || activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No activities found"
            });
        }

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching activities",
            error: error.message
        });
    }
}

export const addActivity = async (req, res) => {
    const activityData = req.body;

    if (!mongoose.Types.ObjectId.isValid(activityData.user) || !mongoose.Types.ObjectId.isValid(activityData.exercise) || !await User.findById(activityData.user) || !await Exercise.findById(activityData.exercise)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user or exercise ID"
        });
    }

    if (!activityData.user || !activityData.exercise || !activityData.duration || !activityData.date) {
        return res.status(400).json({
            success: false,
            message: "User, exercise, and duration are required"
        });
    }

    if (activityData.duration <= 0) {
        return res.status(400).json({
            success: false,
            message: "Duration must be a positive number"
        });
    }

    try {
        activityData.date = new Date(activityData.date);
        if (isNaN(activityData.date.getTime())) {
            throw new Error();
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid date format"
        });
    }

    try {
        const allActivities = await Activity.find({user: activityData.user});
        for (const activity of allActivities) {
            if (activity.date.getDate() === activityData.date.getDate() && activity.date.getMonth() === activityData.date.getMonth() && activity.date.getFullYear() === activityData.date.getFullYear()) {
                const newStart = activityData.date.getTime();
                const newEnd = newStart + activityData.duration * 60000;

                const existingStart = activity.date.getTime();
                const existingEnd = existingStart + activity.duration * 60000;

                if ((newStart > existingStart && newStart < existingEnd) ||
                    (newEnd > existingStart && newEnd < existingEnd) ||
                    (newStart <= existingStart && newEnd >= existingEnd)) {
                    return res.status(400).json({
                        success: false,
                        message: "Activity time slot overlaps with an existing activity."
                    });
                }
            }
        }
        const newActivity = new Activity(activityData);
        await newActivity.save();
        res.status(201).json({
            success: true,
            message: "Activity added successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding activity",
            error: error.message
        });
    }
}

export const getActivitiesByUser = async (req, res) => {
    const user = req.params.user;

    if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }

    try {
        const activities = await Activity.find({ user: user });

        if (!activities || activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No activities found for this user"
            });
        }

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching activities for user",
            error: error.message
        });
    }
}

export const getUserActivityOnDate = async (req, res) => {
    const { user, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }

    try {
        const parsedDate = new Date(date);
        
        const activities = await Activity.find({
            user: user,
            date: {
                $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
                $lte: new Date(parsedDate.setHours(23, 59, 59, 999))
            }
        });

        if (!activities || activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No activities found for this user on the specified date"
            });
        }

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching activities for user on date",
            error: error.message
        });
    }
}

export const editActivity = async (req, res) => {
    const activityId = req.params.id;
    const activityData = req.body;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid activity ID"
        });
    }
    if (!activityData.user || !activityData.exercise || !activityData.duration || !activityData.date) {
        return res.status(400).json({
            success: false,
            message: "User, exercise, and duration are required"
        });
    }
    if (!mongoose.Types.ObjectId.isValid(activityData.user) || !mongoose.Types.ObjectId.isValid(activityData.exercise) || !await User.findById(activityData.user) || !await Exercise.findById(activityData.exercise)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user or exercise ID"
        });
    }
    if (activityData.duration <= 0) {
        return res.status(400).json({
            success: false,
            message: "Duration must be a positive number"
        });
    }
    try {
        activityData.date = new Date(activityData.date);
        if (isNaN(activityData.date.getTime())) {
            throw new Error();
        }
        const allActivities = await Activity.find({user: activityData.user});
        for (const activity of allActivities) {
            if (activity.date.getDate() === activityData.date.getDate() && activity.date.getMonth() === activityData.date.getMonth() && activity.date.getFullYear() === activityData.date.getFullYear() && activity._id.toString() !== activityId) {
                const newStart = activityData.date.getTime();
                const newEnd = newStart + activityData.duration * 60000;

                const existingStart = activity.date.getTime();
                const existingEnd = existingStart + activity.duration * 60000;

                if ((newStart > existingStart && newStart < existingEnd) ||
                    (newEnd > existingStart && newEnd < existingEnd) ||
                    (newStart <= existingStart && newEnd >= existingEnd)) {
                    return res.status(400).json({
                        success: false,
                        message: "Activity time slot overlaps with an existing activity."
                    });
                }
            }
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid date format"
        });
    }
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(activityId, activityData, { new: true });

        if (!updatedActivity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Activity updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating activity",
            error: error.message
        });
    }
}

export const deleteActivity = async (req, res) => {
    const activityId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid activity ID"
        });
    }

    try {
        const deletedActivity = await Activity.findByIdAndDelete(activityId);

        if (!deletedActivity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Activity deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting activity",
            error: error.message
        });
    }
}

export const getActivityById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid activity ID"
        });
    }
    try {
        const activity = await Activity.findById(id).populate('exercise');
        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }
        res.status(200).json({
            success: true,
            data: activity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching activity",
            error: error.message
        });
    }
}