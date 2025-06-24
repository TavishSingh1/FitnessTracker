import express from 'express';
import auth from '../middlewares/auth.js';
import { addActivity, deleteActivity, editActivity, getActivitiesByUser, getAllActivities, getUserActivityOnDate, getActivityById } from '../controllers/activity.controller.js';

const router = express.Router();

router.get("/getAll",auth, getAllActivities);
router.post("/add",auth, addActivity);
router.get("/user/:user",auth, getActivitiesByUser);
router.post("/userOnDate",auth, getUserActivityOnDate);
router.patch("/update/:id",auth, editActivity);
router.delete("/delete/:id",auth, deleteActivity);
router.get("/:id", auth, getActivityById);

export default router;