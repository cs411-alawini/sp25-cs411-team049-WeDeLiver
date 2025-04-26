import { useEffect, useState } from 'react';
import { IconDatabaseImport, IconSearch, IconTrash } from '@tabler/icons-react';
import { TextInput, ActionIcon, Modal, Button, Group, Text } from '@mantine/core';
import classes from './Navbar.module.css';
import axios from 'axios';

export default function Navbar({ userId, setSelectedPlaylist }) {
  const [active, setActive] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

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

  const handleDeleteClick = (playlist, event) => {
    event.stopPropagation();
    setPlaylistToDelete(playlist);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3007/api/playlist/${playlistToDelete.PlaylistID}`);
      // Remove the deleted playlist from state
      const updatedPlaylists = playlists.filter(p => p.PlaylistID !== playlistToDelete.PlaylistID);
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);

      // If the deleted playlist was active, select the first available playlist
      if (playlistToDelete.PlaylistID === active && updatedPlaylists.length > 0) {
        handleClick(updatedPlaylists[0]);
      } else if (updatedPlaylists.length === 0) {
        setActive('');
        setSelectedPlaylist({ songs: [] });
      }
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    } finally {
      setDeleteModalOpen(false);
      setPlaylistToDelete(null);
    }
  };

  const playlistLinks = filteredPlaylists.map((playlist) => (
    <div key={playlist.PlaylistID} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <a
        className={classes.link}
        data-active={playlist.PlaylistID === active || undefined}
        href="#"
        onClick={(event) => {
          event.preventDefault();
          handleClick(playlist);
        }}
        style={{ flex: 1 }}
      >
        <IconDatabaseImport className={classes.linkIcon} stroke={1.5} />
        <span>{playlist.Date}</span>
      </a>
      <ActionIcon
        variant="subtle"
        color="red"
        onClick={(event) => handleDeleteClick(playlist, event)}
        style={{ marginLeft: '8px' }}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </div>
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

      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPlaylistToDelete(null);
        }}
        title="Delete Playlist"
        centered
      >
        <Text>Are you sure you want to delete the playlist from {playlistToDelete?.Date}?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => {
            setDeleteModalOpen(false);
            setPlaylistToDelete(null);
          }}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
