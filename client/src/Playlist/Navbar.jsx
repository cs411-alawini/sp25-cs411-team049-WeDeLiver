import { useEffect, useState } from 'react';
import { IconDatabaseImport, IconSearch } from '@tabler/icons-react';
import { TextInput } from '@mantine/core';
import classes from './Navbar.module.css';
import axios from 'axios';

export default function Navbar({ userId, setSelectedPlaylist }) {
  const [active, setActive] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const response = await axios.get(`http://localhost:3007/api/playlist/${userId}`);
        const fetchedPlaylists = response.data || [];
        const structuredPlaylist = fetchedPlaylists.map((playlist) => ({
          PlaylistID: playlist.PlaylistID,
          UserID: playlist.UserID,
          Date: new Date(playlist.Date).toISOString().split('T')[0],
        }));

        setPlaylists(structuredPlaylist);
        setFilteredPlaylists(structuredPlaylist);

        if (structuredPlaylist.length > 0) {
          handleClick(structuredPlaylist[0]);
        }
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      }
    }

    if (userId) {
      fetchPlaylists();
    }
  }, [userId]);

  useEffect(() => {
    const filtered = playlists.filter((p) =>
      p.Date.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPlaylists(filtered);
  }, [search, playlists]);

  const handleClick = async (playlist) => {
    setActive(playlist.PlaylistID);
    try {
      const response = await axios.get(`http://localhost:3007/api/playlist/song/${playlist.PlaylistID}`);
      const result = response.data || [];
      setSongs(result);
      setSelectedPlaylist({ songs: result });
    } catch (error) {
      console.error('Failed to fetch playlist content:', error);
    }
  };

  const playlistLinks = filteredPlaylists.map((playlist) => (
    <a
      className={classes.link}
      data-active={playlist.PlaylistID === active || undefined}
      href="#"
      key={playlist.PlaylistID}
      onClick={(event) => {
        event.preventDefault();
        handleClick(playlist);
      }}
    >
      <IconDatabaseImport className={classes.linkIcon} stroke={1.5} />
      <span>{playlist.Date}</span>
    </a>
  ));

  return (
    <div>
      <nav className={classes.navbar}>
        <TextInput
          placeholder="Search"
          size="sm"
          leftSection={<IconSearch size={12} stroke={1.5} />}
          styles={{
            input: { width: '270px', marginBottom: '1rem', marginTop: '0.5rem'},
            section: { pointerEvents: 'none' }
          }}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <div className={classes.navbarMain}>{playlistLinks}</div>
      </nav>
    </div>
  );
}
