import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ display: 'flex', height: '100vh' }}>
      <Navbar userId={userId} setSelectedPlaylist={setSelectedPlaylist} />
      <PlaylistTable
        songs={selectedPlaylist?.songs}
      />
    </div>
  );
}