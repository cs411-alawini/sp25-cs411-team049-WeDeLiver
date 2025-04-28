import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Container, Title, Slider, Button, Stack, Box, Center, Modal, Text, TextInput, Group, ActionIcon } from '@mantine/core';
import Navbar from './Navbar'; 
import axios from 'axios'; 
import MoodSliders from './MoodSliders'; 
import { IconSend, IconArrowRight } from '@tabler/icons-react';


export default function SurveyForm({ userId }) {
  const navigate = useNavigate();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

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
  const [moodInput, setMoodInput] = useState(''); // For mood input analysis

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
          setAnxiety(todayData.AnxietyLevel);http://localhost:3000/questions#
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
  }, [userId, date, refreshMoodList]);

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
      date: selectedMood.date,
      stressLevel: stress,
      anxietyLevel: anxiety,
      sleepHours: sleep,
    };
    try {
      await axios.post(`http://localhost:3007/api/moodhealth/${userId}`, moodData);
      setIsExistingEntry(true);
      // showNotification({
      //   title: 'Success',
      //   message: isExistingEntry ? 'Mood entry updated successfully!' : 'Mood entry submitted!',
      //   color: 'teal',
      // });

      // Show playlist modal after successful submission
      setShowPlaylistModal(true);
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

  const analyzeMood = async () => {
    if (!moodInput.trim()) {
      showNotification({
        title: 'Error',
        message: 'Please enter your mood description.',
        color: 'red',
      });
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3007/api/moodhealth/text/${userId}`, {
        text: moodInput
      });
  
      const { stressLevel, anxietyLevel, sleepHours } = response.data;

      console.log("stressLevel:", stressLevel); 
      console.log("anxietyLevel:", anxietyLevel);
      console.log("sleepHours:", sleepHours);
  
      setStress(stressLevel);
      setAnxiety(anxietyLevel);
      setSleep(sleepHours);
  
      showNotification({
        title: 'Analysis Complete',
        message: 'Mood metrics updated based on your description.',
        color: 'teal',
      });
      
      setMoodInput('');
    } catch (error) {
      console.error('Error analyzing mood:', error);
      showNotification({
        title: 'Error',
        message: 'Mood analysis failed. Please try again.',
        color: 'red',
      });
    }
  };
  
  

  // Check if the selected date is today
  const isTodaySelected = selectedMood?.date === date;


  const handleViewPlaylist = () => {
    setShowPlaylistModal(false);
    navigate('/playlist');
  };
  
  return (
    <>
    <Box style={{ 
      display: 'flex', 
      width: '100%',
      minHeight: '100vh'
    }}>
      <Navbar
        userId={userId}
        setSelectedMood={setSelectedMood}
        refresh={refreshMoodList}
        isExistingEntry={isExistingEntry}
        moodEntries={moodEntries}
      />
      <Container size="sm" > 
        <Stack spacing="xl" style={{ width: '100%' , marginTop: '8rem' }}>
          <Title order={2} align="center">Daily Wellness Survey</Title>
          <Box>
            <Title order={5} mb="xs">Predict your mood with AI:</Title>
            <Group align="flex-end" grow>
              <TextInput
                radius="xl"
                size="md"
                placeholder="Tell us about your day..."
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                style={{ flexGrow: 3 }}
                leftSection={<IconArrowRight size={18} stroke={1.5} />}
                rightSectionWidth={42}
                rightSection={
                  <ActionIcon size={32} radius="xl" variant="filled" onClick={analyzeMood}>
                    <IconSend size={18} stroke={1.5} />
                  </ActionIcon>
                }
              />
            </Group>
          </Box>
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
    <Modal
      opened={showPlaylistModal}
      onClose={() => setShowPlaylistModal(false)}
      title="New Playlist Available!"
      centered
      overlayProps={{
        blur: 3,
      }}
      styles={{
        title: {
          fontSize: '1.5rem',
          fontWeight: 600,
        },
        content: {
          padding: '2rem',
        },
      }}
    >
    <Text size="lg" mb="xl">
      Your new personalized playlist is ready!
    </Text>
    <Button
      fullWidth
      onClick={handleViewPlaylist}
      variant="gradient"
      gradient={{ from: 'indigo', to: 'cyan' }}
      size="lg"
    >
      View Playlist
    </Button>
  </Modal>
  </>
  );
}
