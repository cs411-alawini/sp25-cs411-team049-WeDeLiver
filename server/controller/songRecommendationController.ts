import { pool } from '../db/db';

export const generatePlaylist = async (userId: number): Promise<void> => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
        // Call stored procedure to generate playlist and recommendations
        await pool.execute('CALL RecommendSongs(?)', [userId]);
    } catch (error) {
        console.error('Error generating mood-based playlist:', error);
        throw error;
    }
}; 