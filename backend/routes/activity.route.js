import express from 'express';
import { addActivity, deleteActivity, editActivity, getActivitiesByUser, getAllActivities, getUserActivityOnDate } from '../controllers/activity.controller.js';

const router = express.Router();

router.get("/getAll", getAllActivities);
router.post("/add", addActivity);
router.get("/user/:user", getActivitiesByUser);
router.post("/userOnDate", getUserActivityOnDate);
router.patch("/update/:id", editActivity);
router.delete("/delete/:id", deleteActivity);

export default router;