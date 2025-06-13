import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Server is running successfully!"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});