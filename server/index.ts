import express, { Request, Response } from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import dotenv from 'dotenv';
import leaderboardRouter from './routes/leaderboard';
import moodHealthRouter from './routes/moodhealth'; 
import playlistRouter from './routes/playlist';

dotenv.config();

const app = express();
const port = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

app.get('/api/', (req: Request, res: Response) => {
    res.send('Homepage of my Pokedex.');
});

app.use('/api/user', userRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/moodhealth', moodHealthRouter);
app.use('/api/playlist', playlistRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
