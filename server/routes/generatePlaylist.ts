import { Router, Request, Response } from 'express';
import { generatePlaylist } from '../controller/songRecommendationController';

const router = Router();

// Generate mood-based playlist
router.post('/:userId', async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ message: 'Invalid user ID' });
        return;
    }
    try {
        req.body.userId = userId;
        await generatePlaylist(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 