import { useEffect, useState } from 'react';
import { IconDatabaseImport } from '@tabler/icons-react';
import { Table } from '@mantine/core';
import classes from './Navbar.module.css';
import axios from 'axios';

export default function Navbar({ userId, setSelectedPlaylist }) {
  const [active, setActive] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]); // State to hold the songs of the selected playlist

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const response = await axios.get(`http://localhost:3007/api/playlist/${userId}`);
        const fetchedPlaylists = response.data || [];
        const structuredPlaylist = fetchedPlaylists.map((playlist) => ({
          PlaylistID: playlist.PlaylistID,
          UserID: playlist.UserID,
          Date: new Date(playlist.Date).toISOString().split('T')[0], // Format date as needed
        }));

        setPlaylists(structuredPlaylist);

        if (fetchedPlaylists.length > 0) {
          // Automatically select the first playlist
          handleClick(fetchedPlaylists[0]);
        }
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      }
    }

    if (userId) {
      fetchPlaylists();
    }
  }, [userId]);

const handleClick = async (playlist) => {
  setActive(playlist.PlaylistID);
  try {
    console.log('Fetching songs for playlist:', playlist); // For debugging purposes
    const response = await axios.get(`http://localhost:3007/api/playlist/song/${playlist.PlaylistID}`);
    const result = response.data || [];
    // Set the songs and include the playlist name
    console.log('Fetched songs:', result); // For debugging purposes
    setSongs(result);
    setSelectedPlaylist({
      songs: result
    });
  } catch (error) {
    console.error('Failed to fetch playlist content:', error);
  }
};


  const playlistLinks = playlists.map((playlist) => (
    <a
      className={classes.link}
      data-active={playlist.PlaylistID  === active || undefined}
      href="#"
      key={playlist.playlistId}
      onClick={(event) => {
        event.preventDefault();
        handleClick(playlist);
      }}
    >
      <IconDatabaseImport className={classes.linkIcon} stroke={1.5} />
      <span>{playlist.Date}</span>
    </a>
  ));

  // Define the table rows using the song data
  return (
    <div>
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>{playlistLinks}</div>
      </nav>

    </div>
  );
}
