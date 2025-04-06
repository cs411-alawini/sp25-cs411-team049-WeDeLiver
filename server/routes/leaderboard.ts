import express, { Request, Response, Router } from 'express';
import { pool } from '../db/db';

const router = Router();
router.get('/test', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Leaderboard router is working!' });
});

// Get leaderboard data
router.get('/', async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT u.Name, u.Consecutivedays, COUNT(p.PlaylistID) AS playlist_count
            FROM Users u
            LEFT JOIN Playlist p ON u.ID = p.UserID
            GROUP BY u.ID, u.Name, u.Consecutivedays
            ORDER BY u.Consecutivedays DESC, playlist_count DESC
            LIMIT 10;
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;