import { pool } from '../db/db';
import  {Playlist} from '../models/playlist';
import { Playlist2Song} from '../models/playlist2song';
import {Song} from '../models/song'


//
export const getAllPlaylist = async (): Promise<Playlist[]> => {
    try {
        const [rows] = await pool.query('SELECT * FROM Playlist');
        return rows as Playlist[];
    } catch (error) {
        console.error('Error getting all Playlist:', error);
        throw error;
    }
}

// Get playlist by user
export const getPlaylistByUser = async (userId: number): Promise<Playlist[]> => {
    try {
        const [rows] = await pool.query('SELECT * FROM Playlist WHERE UserID = ?', [userId]);
        return rows as Playlist[];
    } catch (error) {
        console.error('Error getting playlist by user:', error);
        throw error;
    }
}

//get song by playlist
export const getSongByPlaylist = async (playlistId: number): Promise<Song[]> => {
    try {
        const [rows] = await pool.query('SELECT AlbumName, TrackName, Artists FROM CS411.Playlist2Song natural join CS411.Song WHERE PlaylistID = ? order by Artists', [playlistId]);
        return rows as Song[];
    } catch (error) {
        console.error('Error getting song by playlist:', error);
        throw error;
    }
}


// Get playlist by user and date
// export const getPlaylistByUserAndDate = async (userId: number, date: string): Promise<Song[]> => {
//   try {
//     const [playlistRows] = await pool.query('SELECT * FROM PlayList WHERE UserID = ? AND Date = ?', [userId, date]);
//     const playlist = (playlistRows as Playlist[])[0];
//     if (!playlist) return [];

//     const [songIds] = await pool.query('SELECT SongID FROM Playlist2Song WHERE PlaylistID = ?', [playlist.playlistId]);
//     const ids = (songIds as Playlist2Song[]).map(row => row.songId);

//     if (ids.length === 0) return [];

//     const [songs] = await pool.query(`SELECT * FROM SongDB WHERE SongID IN (${ids.map(() => '?').join(',')})`, ids);
//     return songs as Song[];
//   } catch (error) {
//     console.error('Error fetching playlist:', error);
//     throw error;
//   }
// };

// // Add a new playlist
// export const addPlaylist = async (userId: number, date: string, songIds: number[]): Promise<number> => {
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();

//     const [result] = await conn.query('INSERT INTO PlayList (UserID, Date) VALUES (?, ?)', [userId, date]);
//     const playlistId = (result as any).insertId;

//     const values = songIds.map(songId => [playlistId, songId]);
//     await conn.query('INSERT INTO Playlist2Song (PlaylistID, SongID) VALUES ?', [values]);

//     await conn.commit();
//     return playlistId;
//   } catch (error) {
//     await conn.rollback();
//     console.error('Error adding playlist:', error);
//     throw error;
//   } finally {
//     conn.release();
//   }
// };

// // Update a playlist
// export const updatePlaylist = async (playlistId: number, songIds: number[]): Promise<void> => {
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();

//     await conn.query('DELETE FROM Playlist2Song WHERE PlaylistID = ?', [playlistId]);

//     const values = songIds.map(songId => [playlistId, songId]);
//     await conn.query('INSERT INTO Playlist2Song (PlaylistID, SongID) VALUES ?', [values]);

//     await conn.commit();
//   } catch (error) {
//     await conn.rollback();
//     console.error('Error updating playlist:', error);
//     throw error;
//   } finally {
//     conn.release();
//   }
// };
