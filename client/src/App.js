import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [id, setId] = useState('');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3007/api/user/${id}`);
      setUser(response.data);
      setMessage('');
    } catch (error) {
      setUser(null);
      setMessage('User not found');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3007/api/user/${id}`);
      setMessage('User deleted');
      setUser(null);
    } catch (error) {
      setMessage('Error deleting user');
    }
  };

  const handlePrintalluser = async () => {
    try {
      const response = await axios.get(`http://localhost:3007/api/user`);
      setUsers(response.data);
      setMessage('');
    } catch (error) {
      setUsers([]);
      setMessage('Error fetching users');
    }
  };

  return (
    <div className="App">
      <h1>User Search</h1>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter user ID"
      />
      <button onClick={handleSearch}>Search</button>
      {user && (
        <div>
          <h2>User Details</h2>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Consecutive Days: {user.consecutivedays}</p>
          <button onClick={() => handleDelete(user.id)}>Delete User</button>
        </div>
      )}
      <button onClick={handlePrintalluser}>Print All Users</button>
      {users.length > 0 && (
        <div>
          <h2>All Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                ID: {user.id}, Name: {user.name}, Consecutive Days: {user.consecutivedays}
              </li>
            ))}
          </ul>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;