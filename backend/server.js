import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import userRouter from './routes/user.route.js';
import exerciseRouter from './routes/exercise.route.js';
import activityRouter from './routes/activity.route.js';
import foodRouter from './routes/food.route.js';
import consumptionRouter from './routes/consumption.route.js';

import auth from './middlewares/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: "Server is running successfully!" });
});

app.use('/api/user', userRouter);

app.use('/api/exercise', auth, exerciseRouter);
app.use('/api/activity', auth, activityRouter);
app.use('/api/food', auth, foodRouter);
app.use('/api/consumption', auth, consumptionRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
