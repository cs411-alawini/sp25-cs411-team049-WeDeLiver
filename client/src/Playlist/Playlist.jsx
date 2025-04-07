import { useState } from 'react';
import Navbar from './Navbar';
import PlaylistTable from './PlaylistSongs';

export default function Playlist({ userId }) {
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