import express, { Request, Response } from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3007;

app.use(cors()); // Enable CORS
app.use(express.json());

app.get('/api/', (req: Request, res: Response) => {
    res.send('Homepage of my Pokedex.');
});

// Use the user router for all /api/user routes
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});