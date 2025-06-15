import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    calories: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Food = mongoose.model("Food", foodSchema);
export default Food;