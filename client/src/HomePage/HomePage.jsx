import React, { useEffect, useState } from 'react';
import { Container, Paper, Title, Text, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom'; // To navigate programmatically
import axios from 'axios';

function HomePage({ userId }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user details when the component mounts
  useEffect(() => {
    if (userId) {
      // Fetch user data from the backend
      axios.get(`http://localhost:3007/api/user/${userId}`)
        .then(response => {
          setUser(response.data);  // Store the fetched user data
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          navigate('/'); // Redirect to login page if user is not found
        });
    } else {
      navigate('/'); // Redirect to login page if no userId is provided
    }
  }, [userId, navigate]);

  // Show a loading state while fetching the user data
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Container size="sm">
          <Title align="center" order={2} color="blue">
            Welcome, {user.Name}!
          </Title>
          <Text align="center" mt="md">
            You're logged in as <strong>{user.ID}</strong>
          </Text>
          {/* Optional: You can add a logout button or other content here */}
      </Container>
    </div>
  );
}

export default HomePage;
