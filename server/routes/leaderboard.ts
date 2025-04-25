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
            SELECT u.Name, u.Consecutivedays, COUNT(p.PlaylistID) AS playlist_count, u.Country
            FROM Users u
            LEFT JOIN Playlist p ON u.ID = p.UserID
            GROUP BY u.ID, u.Name, u.Consecutivedays, u.Country
            ORDER BY u.Consecutivedays DESC, playlist_count DESC
            LIMIT 20;
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:userId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    try {
        const query = `
            SELECT u.Name, u.Consecutivedays, COUNT(p.PlaylistID) AS playlist_count
            FROM Users u
            LEFT JOIN Playlist p ON u.ID = p.UserID
            WHERE u.Country = (SELECT Country FROM Users WHERE ID = ?)
            GROUP BY u.ID, u.Name, u.Consecutivedays
            ORDER BY u.Consecutivedays DESC, playlist_count DESC
            LIMIT 20;
        `;
        const [rows] = await pool.query(query, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching leaderboard data for user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



export default router;