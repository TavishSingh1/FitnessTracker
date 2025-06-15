import mongoose from "mongoose";

const consumptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Consumption = mongoose.model("Consumption", consumptionSchema);
export default Consumption;