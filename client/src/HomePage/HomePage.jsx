import React, { useEffect, useState } from 'react';
import { Container, Paper, Title, Text, Loader, Group, SemiCircleProgress, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage({ userId }) {
  const [user, setUser] = useState(null);
  const [averages, setAverages] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
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

    // Add resize event listener
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [userId, navigate]);
  

  const handleGeneratePlaylist = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`http://localhost:3007/api/generate-playlist/${userId}`);
      alert('Playlist generated successfully!');
      navigate('/playlist'); // Navigate to playlist page
    } catch (error) {
      console.error('Error generating playlist:', error);
      alert('Failed to generate playlist. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

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

  // Mobile layout styles
  const mobileContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  };

  // Desktop layout - use the original Group component
  const progressComponentStyle = isMobile ? { margin: '0 auto' } : {};

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Container size="sm">
        <Title align="center" order={2} color="blue">
          Welcome, {user.Name}!
        </Title>
        <Text align="center" mt="md">
          You're logged in as <strong>{user.ID}</strong>
        </Text>

        <Button 
          fullWidth 
          mt="md" 
          onClick={handleGeneratePlaylist}
          loading={isGenerating}
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan' }}
        >
          Generate Mood-Based Playlist
        </Button>

        <Paper shadow="xs" p="md" mt="xl" withBorder>
          <Title order={4} align="center" mb="md">
            Your Mood Averages (Last 7 Days)
          </Title>

          <div style={isMobile ? mobileContainerStyle : {}}>
            {isMobile ? (
              // Mobile view - stacked components
              <>
                <SemiCircleProgress
                  value={100 - Number(averages.AvgStress) * 10}
                  size={150}
                  thickness={15}
                  fillDirection="left-to-right"
                  orientation="up"
                  filledSegmentColor={
                    averages.AvgStress >= 7 ? '#ff6b6b' :
                    averages.AvgStress >= 4 ? '#ffa502' :
                    '#51cf66'
                  }
                  label={`Stress: ${Number(averages.AvgStress).toFixed(2)}/10`}
                  emptySegmentColor="var(--mantine-color-gray-3)"
                  style={progressComponentStyle}
                />

                <SemiCircleProgress
                  value={100 - Number(averages.AvgAnxiety) * 10}
                  size={150}
                  thickness={15}
                  fillDirection="left-to-right"
                  orientation="up"
                  filledSegmentColor={
                    averages.AvgAnxiety >= 7 ? '#ff6b6b' :
                    averages.AvgAnxiety >= 4 ? '#ffa502' :
                    '#51cf66'
                  }
                  label={`Anxiety: ${Number(averages.AvgAnxiety).toFixed(2)}/10`}
                  emptySegmentColor="var(--mantine-color-gray-3)"
                  style={progressComponentStyle}
                />

                <SemiCircleProgress
                  value={(Number(averages.AvgSleep) / 10) * 100}
                  size={150}
                  thickness={15}
                  fillDirection="left-to-right"
                  orientation="up"
                  filledSegmentColor={
                    averages.AvgSleep >= 8 ? '#51cf66' :
                    averages.AvgSleep >= 6 ? '#ffa502' :
                    '#ff6b6b'
                  }
                  label={`Sleep: ${Number(averages.AvgSleep).toFixed(2)} hrs`}
                  emptySegmentColor="var(--mantine-color-gray-3)"
                  style={progressComponentStyle}
                />

                <SemiCircleProgress
                  value={Number(averages.AvgMood)}
                  size={150}
                  thickness={15}
                  fillDirection="left-to-right"
                  orientation="up"
                  filledSegmentColor={
                    averages.AvgMood >= 70 ? '#51cf66' :
                    averages.AvgMood >= 40 ? '#ffa502' :
                    '#ff6b6b'
                  }
                  label={`Mood: ${Number(averages.AvgMood).toFixed(2)}/100`}
                  emptySegmentColor="var(--mantine-color-gray-3)"
                  style={progressComponentStyle}
                />
              </>
            ) : (
              // Desktop view - original Group layout
              <Group position="apart" grow>
                <SemiCircleProgress
                  value={100 - Number(averages.AvgStress) * 10}
                  size={150}
                  thickness={15}
                  fillDirection="left-to-right"
                  orientation="up"
                  filledSegmentColor={
                    averages.AvgStress >= 7 ? '#ff6b6b' :
                    averages.AvgStress >= 4 ? '#ffa502' :
                    '#51cf66'
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
                    averages.AvgAnxiety >= 7 ? '#ff6b6b' :
                    averages.AvgAnxiety >= 4 ? '#ffa502' :
                    '#51cf66'
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
                    averages.AvgSleep >= 8 ? '#51cf66' :
                    averages.AvgSleep >= 6 ? '#ffa502' :
                    '#ff6b6b'
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
                    averages.AvgMood >= 70 ? '#51cf66' :
                    averages.AvgMood >= 40 ? '#ffa502' :
                    '#ff6b6b'
                  }
                  label={`Mood: ${Number(averages.AvgMood).toFixed(2)}/100`}
                  emptySegmentColor="var(--mantine-color-gray-3)"
                />
              </Group>
            )}
          </div>

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
