import React from 'react';
import { Box, Title, Slider } from '@mantine/core';

export default function MoodSliders({ stress, setStress, anxiety, setAnxiety, sleep, setSleep, isEditable }) {
  return (
    <>
      <Box>
        <Title order={5} mb="xs">How stressed are you feeling today?</Title>
        <Slider
          value={stress}
          onChange={isEditable ? setStress : undefined}
          min={1}
          max={10}
          step={1}
          marks={[
            { value: 1, label: '1' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
          ]}
          disabled={!isEditable}
        />
      </Box>

      <Box>
        <Title order={5} mb="xs">How anxious or on-edge are you feeling today?</Title>
        <Slider
          value={anxiety}
          onChange={isEditable ? setAnxiety : undefined}
          min={1}
          max={10}
          step={1}
          marks={[
            { value: 1, label: '1' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
          ]}
          disabled={!isEditable}
        />
      </Box>

      <Box>
        <Title order={5} mb="xs">How many hours did you sleep last night?</Title>
        <Slider
          value={sleep}
          onChange={isEditable ? setSleep : undefined}
          min={0}
          max={14}
          step={0.5}
          marks={[
            { value: 0, label: '0' },
            { value: 7, label: '7' },
            { value: 14, label: '14' },
          ]}
          disabled={!isEditable}
        />
      </Box>
    </>
  );
}
