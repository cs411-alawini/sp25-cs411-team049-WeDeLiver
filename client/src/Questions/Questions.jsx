import React, { useState,useEffect } from 'react';
import { Container, Title, Slider, Button, Stack,Box,Center } from '@mantine/core';
import axios from 'axios'; // Ensure you have axios installed for making HTTP requests

export default function SurveyForm({userId}) {
  const [stress, setStress] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [isExistingEntry, setIsExistingEntry] = useState(false);
  const [loading, setLoading] = useState(true);

  const date = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await axios.get(`http://localhost:3007/api/moodhealth/${userId}`);
        const todayData = response.data.find(entry => entry.Date === date);
        if (todayData) {
          setStress(todayData.StressLevel);
          setAnxiety(todayData.AnxietyLevel);
          setSleep(todayData.SleepHours);
          setIsExistingEntry(true);
        } else {
          // No data for today, leave as default
          setIsExistingEntry(false);
        }
      } catch (error) {
        console.error('Failed to fetch mood data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [userId, date]);

  
  const handleSubmit = async () => {
    const moodData = {
      userId, // Assuming userId is passed in from props or context
      date: date,
      stressLevel: stress,
      anxietyLevel: anxiety,
      sleepHours: sleep,
    };
    try {
      await axios.post(`http://localhost:3007/api/moodhealth/${userId}`, moodData); // backend already handles insert or update
      alert(isExistingEntry ? 'Mood data updated!' : 'Mood data submitted!');
      setIsExistingEntry(true); // For UI updates, e.g., button text
    } catch (error) {
      console.error('Error submitting mood data:', error);
      alert('Failed to submit mood data. Please try again later.');
    }
    // try {
    //   await axios.post(`http://localhost:3007/api/moodhealth/${userId}`, moodData);
    //   const data = await axios.get(`http://localhost:3007/api/moodhealth/${userId}`); // Optional: Fetch the updated mood data for confirmation
    //   console.log('Mood data submitted successfully:', data); // For debugging purposes
    // } catch (error) {
    //   console.error('Error submitting mood data:', error);
    //   alert('Failed to submit mood data. Please try again later.');
    //   return; // Exit the function if the request fails
    // }
  };

  return (
    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container size="sm">

        <Stack spacing="xl">
          <Title order={2} align="center">Daily Wellness Survey</Title>

          <Box>
            <Title order={5} mb="xs">How stressed are you feeling today?</Title>
            <Slider
              value={stress}
              onChange={setStress}
              min={1}
              max={10}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: 10, label: '10' },
              ]}
            />
          </Box>

          <Box>
            <Title order={5} mb="xs">How anxious or on-edge are you feeling today?</Title>
            <Slider
              value={anxiety}
              onChange={setAnxiety}
              min={1}
              max={10}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: 10, label: '10' },
              ]}
            />
          </Box>

          <Box>
            <Title order={5} mb="xs">How many hours did you sleep last night?</Title>
            <Slider
              value={sleep}
              onChange={setSleep}
              min={0}
              max={14}
              step={0.5}
              marks={[
                { value: 0, label: '0' },
                { value: 7, label: '7' },
                { value: 14, label: '14' },
              ]}
            />
          </Box>

          <Center>
            <Button size="md" onClick={handleSubmit}>
              {isExistingEntry ? 'Update Entry' : 'Submit'}
            </Button>
          </Center>
        </Stack>
      </Container>
    </Box>
  );
}
