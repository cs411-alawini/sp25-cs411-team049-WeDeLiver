import React, { useEffect, useState } from 'react';
import { Container, Paper, Title, Text, Loader, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage({ userId }) {
  const [user, setUser] = useState(null);
  const [averages, setAverages] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    // Fetch user profile
    axios.get(`http://localhost:3007/api/user/${userId}`)
      .then(response => setUser(response.data))
      .catch(error => {
        console.error('Error fetching user:', error);
        navigate('/');
      });

    // Fetch mood averages from stored procedure
    axios.get(`http://localhost:3007/api/moodhealth/average/${userId}`)
      .then(response => setAverages(response.data[0][0]))
      .catch(error => console.error('Error fetching mood averages:', error));

  }, [userId, navigate]);
  

  if (!user || !averages) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader />
      </div>
    );
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

        <Paper shadow="xs" p="md" mt="xl" withBorder>
          <Title order={4}>Your Mood Averages (Last 7 Days)</Title>
          <Text mt="sm">Average Stress Level: <strong>{Number(averages.AvgStress).toFixed(2)}</strong> /10 </Text>
          <Text>Average Anxiety Level: <strong>{Number(averages.AvgAnxiety).toFixed(2)}</strong> /10</Text>
          <Text>Average Sleep Hours: <strong>{Number(averages.AvgSleep).toFixed(2)}</strong></Text>
          <Text>Average Mood Score: <strong>{Number(averages.AvgMood).toFixed(2)}</strong> /100</Text>

        </Paper>
      </Container>
    </div>
  );
}

export default HomePage;
