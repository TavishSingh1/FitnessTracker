import express from "express";
import { addConsumption, deleteConsumption, getAllConsumptions, getConsumptionById, getConsumptionByIdAndDate, updateConsumption } from "../controllers/consumption.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/getAll", auth, getAllConsumptions);
router.get("/getById/:userId", auth, getConsumptionById);
router.post("/getByIdAndDate", auth, getConsumptionByIdAndDate);
router.post("/add", auth, addConsumption);
router.patch("/update/:id", auth, updateConsumption);
router.delete("/delete/:id", auth, deleteConsumption);

export default router;