import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextInput, Button, Title, Paper, Stack, Notification, Group, Box, Modal } from '@mantine/core';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import './Login.css'; // Import your CSS file for additional styles

function Login({ onLogin }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');  // New state for the user's name
  const [country, setCountry] = useState('');  // New state for the user's country
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);  // State to control modal visibility
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://localhost:3007/api/user/${id}`);
      setUser(response.data);
      setMessage('Login successful');
      console.log('Login successful:', response.data); // For debugging purposes
      onLogin(response.data.ID);  // Call the onLogin function passed from App to set userId
      navigate('/home');  // Navigate to the home page after successful login
    } catch (error) {
      setUser(null);
      setMessage('User not found. Please create a new user.');
    }
  };

  // Handle user creation
  const handleCreate = async () => {
    try {
      const newUser = { name, country };  // Include the name in the newUser object
      const response = await axios.post('http://localhost:3007/api/user', newUser);
      setUser(response.data);
      setMessage('User created successfully');
      onLogin(response.data.ID);  // Call the onLogin function passed from App to set userId
      navigate('/home');  // Navigate to the home page after user creation
    } catch (error) {
      setMessage('Error creating user');
    }
  };

  return (
    <div className="App" style={{ minHeight: '100vh', backgroundColor: '#f1f3f5', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Container size="sm">
        <Paper shadow="xl" radius="lg" p="xl" withBorder>
          <Stack spacing="lg">
            <Title align="center" order={2} color="blue">
              🔐 User Lookup Portal
            </Title>

            <Group>
              <TextInput
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter user ID"
                withAsterisk
                size="md"
                classNames={{ input: 'text-input' }}
              />
              
              <Box>
                <Button onClick={handleLogin}>
                  Login
                </Button>
                <Button onClick={() => setModalOpen(true)}>  {/* Open the modal when Create User is clicked */}
                  Create User
                </Button>
              </Box>
            </Group>

            {message && (
              <Notification color="red" radius="md" mt="md">
                {message}
              </Notification>
            )}

          </Stack>
        </Paper>
      </Container>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}  // Close the modal when the user clicks the close button
        title="Create New User"
      >
        <TextInput
          label="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          withAsterisk
        />
        <TextInput
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter your country"
            withAsterisk
            mt="md"
        />
        <Group position="left" mt="md">
          <Button onClick={handleCreate}>Create User</Button>
        </Group>
      </Modal>
    </div>
  );
}

export default Login;
