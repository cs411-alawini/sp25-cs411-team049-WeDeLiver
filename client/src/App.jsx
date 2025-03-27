import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextInput, Button, Title, Paper, Stack, Text, Notification, Group } from '@mantine/core';

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
    <Container size="sm" padding="md">
      <Title align="center" mb="lg">User Search</Title>
      <Paper shadow="xs" padding="md">
        <Stack spacing="md">
          <TextInput
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter user ID"
            label="User ID"
            withAsterisk
          />
          <Group position="center">
            <Button onClick={handleSearch}>Search</Button>
            <Button onClick={handlePrintalluser} variant="outline">Print All Users</Button>
          </Group>
        </Stack>
      </Paper>
      {user && (
        <Paper shadow="xs" padding="md" mt="md">
          <Title order={4}>User Details</Title>
          <Text>ID: {user.id}</Text>
          <Text>Name: {user.name}</Text>
          <Text>Consecutive Days: {user.consecutivedays}</Text>
          <Button onClick={() => handleDelete(user.id)} color="red" mt="md">Delete User</Button>
        </Paper>
      )}
      {users.length > 0 && (
        <Paper shadow="xs" padding="md" mt="md">
          <Title order={4}>All Users</Title>
          <Stack spacing="sm">
            {users.map((user) => (
              <Paper key={user.id} shadow="xs" padding="sm">
                <Text>ID: {user.id}</Text>
                <Text>Name: {user.name}</Text>
                <Text>Consecutive Days: {user.consecutivedays}</Text>
              </Paper>
            ))}
          </Stack>
        </Paper>
      )}
      {message && (
        <Notification color="red" mt="md">
          {message}
        </Notification>
      )}
    </Container>
  );
}

export default App;