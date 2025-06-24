import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

import userRouter from './routes/user.route.js';
import exerciseRouter from './routes/exercise.route.js';
import activityRouter from './routes/activity.route.js';
import foodRouter from './routes/food.route.js';
import consumptionRouter from './routes/consumption.route.js';
import authRouter from './routes/auth.route.js'

import auth from './middlewares/auth.js';

const allowedOrigins = ['http://localhost:5173']

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: "Server is running successfully!" });
});

app.use('/api/auth', authRouter)

app.use('/api/user', userRouter);

app.use('/api/exercise', auth, exerciseRouter);
app.use('/api/activity', auth, activityRouter);
app.use('/api/food', auth, foodRouter);
app.use('/api/consumption', auth, consumptionRouter);

app.use(cors(corsOptions));

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
