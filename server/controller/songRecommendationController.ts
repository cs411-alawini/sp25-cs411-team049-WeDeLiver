import { Request, Response } from 'express';
import { pool } from '../db/db';
import { Playlist2Song } from '../models/playlist2song';

export const generatePlaylist = async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Call stored procedure to generate playlist and recommendations
        await pool.execute('CALL RecommendSongs(?)', [userId]);

        res.status(200).json({msg: "Playlist generated successfully!"});
    } catch (error) {
        console.error('Error generating mood-based playlist:', error);
        res.status(500).json({ error: 'Failed to generate playlist' });
    }
}; 