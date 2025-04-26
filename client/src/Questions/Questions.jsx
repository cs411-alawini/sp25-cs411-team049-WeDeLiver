import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Container, Title, Slider, Button, Stack,Box,Center } from '@mantine/core';
import Navbar from './Navbar'; 
import axios from 'axios'; 
import MoodSliders from './MoodSliders'; 

export default function SurveyForm({ userId }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  const [stress, setStress] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [isExistingEntry, setIsExistingEntry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [refreshMoodList, setRefreshMoodList] = useState(false);
  const [moodEntries, setMoodEntries] = useState([]);

  const date = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await axios.get(`http://localhost:3007/api/moodhealth/${userId}`);
        const fetchedData = response.data || [];
        const todayData = fetchedData.find((entry) => {
          const entryDateStr = new Date(entry.Date).toISOString().split('T')[0];
          return entryDateStr === date;
        });

        const structuredData = fetchedData.map((entry) => ({
          date: new Date(entry.Date).toISOString().split('T')[0],
          ...entry,
        }));

        if (todayData) {
          setStress(todayData.StressLevel);
          setAnxiety(todayData.AnxietyLevel);
          setSleep(todayData.SleepHours);
          setIsExistingEntry(true);
          setSelectedMood({
            ...todayData,
            date: new Date(todayData.Date).toISOString().split('T')[0],
          });
        } else {
          setIsExistingEntry(false);
          // Add default entry for current date
          const defaultEntry = {
            date: date,
            UserID: userId,
            StressLevel: 0,
            AnxietyLevel: 0,
            SleepHours: 0,
            MoodScore: 0
          };
          structuredData.unshift(defaultEntry);
          setSelectedMood(defaultEntry);
        }

        setMoodEntries(structuredData);
      } catch (error) {
        console.error('Failed to fetch mood data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [userId, date]);

  useEffect(() => {
    if (selectedMood) {
      setStress(selectedMood.StressLevel);
      setAnxiety(selectedMood.AnxietyLevel);
      setSleep(selectedMood.SleepHours);
    }
  }, [selectedMood]);

  const handleSubmit = async () => {
    const moodData = {
      userId,
      date,
      stressLevel: stress,
      anxietyLevel: anxiety,
      sleepHours: sleep,
    };
    try {
      await axios.post(`http://localhost:3007/api/moodhealth/${userId}`, moodData);
      setIsExistingEntry(true);
      showNotification({
        title: 'Success',
        message: isExistingEntry ? 'Mood entry updated successfully!' : 'Mood entry submitted!',
        color: 'teal',
      });
      setRefreshMoodList((prev) => !prev);
    } catch (error) {
      console.error('Error submitting mood data:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to submit mood data. Please try again later.',
        color: 'red',
      });
    }
  };

  return (
    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar
        userId={userId}
        setSelectedMood={setSelectedMood}
        refresh={refreshMoodList}
        isExistingEntry={isExistingEntry}
        moodEntries={moodEntries}
      />
      <Container size="sm">
        <Stack spacing="xl">
          <Title order={2} align="center">Daily Wellness Survey</Title>

          <MoodSliders
            stress={stress}
            setStress={setStress}
            anxiety={anxiety}
            setAnxiety={setAnxiety}
            sleep={sleep}
            setSleep={setSleep}
          />

          <Center>
            <Stack spacing="sm">
              {selectedMood?.date === date && !isExistingEntry && (
                <Button size="md" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
              {selectedMood?.date === date && isExistingEntry && (
                <Button size="md" onClick={handleSubmit}>
                  Update Entry
                </Button>
              )}
            </Stack>
          </Center>
        </Stack>
      </Container>
    </Box>
  );
}
