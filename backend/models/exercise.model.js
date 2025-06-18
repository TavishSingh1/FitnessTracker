import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    intensity: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        required: true
    },
    caloriesBurned: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;