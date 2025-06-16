import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/user.route.js';
import exerciseRouter from './routes/exercise.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Server is running successfully!"
    })
})

app.use('/api/user', userRouter);
app.use('/api/exercise', exerciseRouter);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});