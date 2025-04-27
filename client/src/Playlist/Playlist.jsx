import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mantine/core';
import Navbar from './Navbar';
import PlaylistTable from './PlaylistSongs';

export default function Playlist({ userId }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  return (
    <Box style={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      justifyContent: 'center',
      position: 'relative',
      width: '100%',
      minHeight: '100vh'
    }}>
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        height: 'calc(100vh - 60px)',
        alignItems: 'flex-start',
        overflow: 'hidden'
      }}>
        <Navbar userId={userId} setSelectedPlaylist={setSelectedPlaylist} />
        <Box style={{ 
          flex: 1,
          height: '100%',
          overflow: 'hidden'
        }}>
          <PlaylistTable songs={selectedPlaylist?.songs} />
        </Box>
      </div>
    </Box>
  );
}