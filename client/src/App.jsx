import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Login from './Login/Login';
import Questions from './Questions/Questions'; // Ensure this path is correct based on your file structure
import Playlist from './Playlist/Playlist'; // Ensure this path is correct based on your file structure
import Leaderboard from './Leaderboard/Leaderboard'; // Ensure this path is correct based on your file structure
import HomePage from './HomePage/HomePage'; // Optional: If you have a home page component
import { AppHeader } from './AppHeader'; // Ensure this path is correct based on your file structure
import '@mantine/core/styles.css'; // core styles are required for all packages

function App() {
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem('userId');
    return saved ? JSON.parse(saved) : null;
  });

  // A function to handle setting user ID after login or creation and persist it
  const handleLogin = (id) => {
    setUserId(id);
    localStorage.setItem('userId', JSON.stringify(id));
  };

  // A function to handle logout: clear user ID and localStorage
  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      {/* Conditionally render AppHeader */}
      {userId && <AppHeader userId={userId} onLogout={handleLogout} />}  {/* Pass userId and onLogout to AppHeader only when it's set */}
      
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />  {/* Pass onLogin to Login */}
        <Route path="/questions" element={<Questions userId={userId} />} />
        <Route path="/playlist" element={<Playlist userId={userId} />} />
        <Route path="/leaderboard" element={<Leaderboard userId={userId} />} />
        <Route path="/home" element={<HomePage userId={userId} />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />  {/* Fallback for undefined routes */}
      </Routes>
    </Router>
  );
}

export default App;
