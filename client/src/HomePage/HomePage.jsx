import React, { useEffect, useState } from 'react';
import { Container, Paper, Title, Text, Loader, Group, SemiCircleProgress } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage({ userId }) {
  const [user, setUser] = useState(null);
  const [averages, setAverages] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const navigate = useNavigate();
  const moodEmojiMap = {
    "Excellent": "😄",
    "Good": "😊",
    "Okay": "😐",
    "Low": "😟",
    "Very Low": "😢"
  };

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
         <div style={{ textAlign: 'center' }}>
        <h3>No scores found</h3>
        <p>Please complete a survey to start generating playlists!</p>
      </div>
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
  <Title order={4} align="center" mb="md">
    Your Mood Averages (Last 7 Days)
  </Title>

  <Group position="apart" grow>
    <SemiCircleProgress
      value={100 - Number(averages.AvgStress) * 10}
      size={150}
      thickness={15}
      fillDirection="left-to-right"
      orientation="up"
      filledSegmentColor={
      averages.AvgStress >= 7 ? '#ff6b6b' :  // Red for high stress
      averages.AvgStress >= 4 ? '#ffa502' :  // Orange for medium
      '#51cf66'                              // Green for low
      }
      label={`Stress: ${Number(averages.AvgStress).toFixed(2)}/10`}
      emptySegmentColor="var(--mantine-color-gray-3)"
    />

    <SemiCircleProgress
      value={100 - Number(averages.AvgAnxiety) * 10}
      size={150}
      thickness={15}
      fillDirection="left-to-right"
      orientation="up"
      filledSegmentColor={
        averages.AvgAnxiety >= 7 ? '#ff6b6b' :  // Red for high anxiety
        averages.AvgAnxiety >= 4 ? '#ffa502' :  // Orange for medium
        '#51cf66'                              // Green for low
        }
      label={`Anxiety: ${Number(averages.AvgAnxiety).toFixed(2)}/10`}
      emptySegmentColor="var(--mantine-color-gray-3)"
    />

    <SemiCircleProgress
      value={(Number(averages.AvgSleep) / 10) * 100}
      size={150}
      thickness={15}
      fillDirection="left-to-right"
      orientation="up"
      filledSegmentColor={
        averages.AvgSleep >= 8 ? '#51cf66' :  // Green for a lot of sleep
        averages.AvgSleep >= 6 ? '#ffa502' :  // Orange for medium
        '#ff6b6b'                             // Green for low
        }
      label={`Sleep: ${Number(averages.AvgSleep).toFixed(2)} hrs`}
      emptySegmentColor="var(--mantine-color-gray-3)"
    />

    <SemiCircleProgress
      value={Number(averages.AvgMood)}
      size={150}
      thickness={15}
      fillDirection="left-to-right"
      orientation="up"
      filledSegmentColor={
        averages.AvgMood >= 70 ? '#51cf66' :  // Green for high score
        averages.AvgMood >= 40 ? '#ffa502' :  // Orange for medium
        '#ff6b6b'                             // Green for low
        }
      label={`Mood: ${Number(averages.AvgMood).toFixed(2)}/100`}
      emptySegmentColor="var(--mantine-color-gray-3)"
    />
  </Group>

  {/* Mood Interpretation moved here */}
  <Text align="center" mt="lg" size="lg" weight={600}>
    Mood Interpretation: <span style={{ color: 'green' }}>
      {moodEmojiMap[averages.MoodInterpretation]} {averages.MoodInterpretation}
    </span>
  </Text>
</Paper>

      </Container>
    </div>
  );
}

export default HomePage;
