import express from "express";
import { addConsumption, deleteConsumption, getAllConsumptions, getConsumptionById, getConsumptionByIdAndDate, updateConsumption } from "../controllers/consumption.controller.js";

const router = express.Router();

router.get("/getAll", getAllConsumptions);
router.get("/getById/:userId", getConsumptionById);
router.post("/getByIdAndDate", getConsumptionByIdAndDate);
router.post("/add", addConsumption);
router.patch("/update/:id", updateConsumption);
router.delete("/delete/:id", deleteConsumption);

export default router;