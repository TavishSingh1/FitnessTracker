import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Server is running successfully!"
    })
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});