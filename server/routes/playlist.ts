import { Router, Request, Response } from 'express';
import {  getAllPlaylist, getPlaylistByUser, getSongByPlaylist } from '../controller/playlist';


const router = Router();

//print all platlist
router.get('/', async (req: Request, res: Response) => {
    try {
        const allUsers = await getAllPlaylist();
        res.status(200).send(allUsers);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
// Get playlist by user
router.get('/:userId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        const playlist = await getPlaylistByUser(userId);
        if (playlist.length === 0) {
            res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json(playlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get song by playlist
router.get('/song/:playlistId', async (req: Request, res: Response) => {
    const playlistId = parseInt(req.params.playlistId);
    if (isNaN(playlistId)) {
        res.status(400).json({ message: 'Invalid playlist ID' });
    }
    try {
        const song = await getSongByPlaylist(playlistId);
        if (song.length === 0) {
            res.status(404).json({ message: 'Song not found' });
        }
        res.status(200).json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;