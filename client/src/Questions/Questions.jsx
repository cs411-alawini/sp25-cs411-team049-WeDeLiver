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

  const date = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await axios.get(`http://localhost:3007/api/moodhealth/${userId}`);
        const todayData = response.data.find((entry) => {
          const entryDateStr = new Date(entry.Date).toISOString().split('T')[0];
          return entryDateStr === date;
        });
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
          setSelectedMood(null);
        }
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

      const selectedDateStr = new Date(selectedMood.date).toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];

      if (selectedDateStr === todayStr) {
        setIsExistingEntry(true); 
      } else {
        setIsExistingEntry(false); 
      }
    } else {
      setIsExistingEntry(false);
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

  const handleDelete = async () => {
    if (!selectedMood) return;
  
    try {
      await axios.delete(`http://localhost:3007/api/moodhealth/${userId}/${selectedMood.date}`);
      showNotification({
        title: 'Deleted',
        message: `Mood entry for ${selectedMood.date} deleted successfully.`,
        color: 'red',
      });
      setSelectedMood(null);
      setStress(5);
      setAnxiety(5);
      setSleep(7);
      setIsExistingEntry(false);
      setRefreshMoodList((prev) => !prev); // refresh sidebar
    } catch (error) {
      console.error('Error deleting mood data:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to delete mood entry.',
        color: 'red',
      });
    }
  };

  // Check if the selected date is today
  const isTodaySelected = selectedMood?.date === date;

  return (
    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar userId={userId} setSelectedMood={setSelectedMood} refresh={refreshMoodList} />
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
            isEditable={isTodaySelected}
          />

          <Center>
            <Stack spacing="sm">
              {!selectedMood && !isExistingEntry && (
                <Button size="md" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
              {selectedMood?.date === date && isExistingEntry && (
                <Button size="md" onClick={handleSubmit}>
                  Update Entry
                </Button>
              )}
              {selectedMood && (
                <Button
                  size="md"
                  color="red"
                  variant="outline"
                  onClick={handleDelete}
                >
                  Delete Entry
                </Button>
              )}
            </Stack>
          </Center>
        </Stack>
      </Container>
    </Box>
  );
}
