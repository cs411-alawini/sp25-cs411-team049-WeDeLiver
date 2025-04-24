import React from 'react';
import { Box, Title, Slider } from '@mantine/core';

export default function MoodSliders({ stress, setStress, anxiety, setAnxiety, sleep, setSleep }) {
  return (
    <>
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
    </>
  );
}
