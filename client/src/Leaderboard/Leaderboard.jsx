import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Title, Loader, Center, Paper, SegmentedControl, Group
} from '@mantine/core';

export default function Leaderboard({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('global'); // 'global' or 'local'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);

      try {
        const url =
          view === 'global'
            ? 'http://localhost:3007/api/leaderboard'
            : `http://localhost:3007/api/leaderboard/${userId}`;
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [view, userId]);

  const rows = data.map((user, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{user.Name}</td>
      <td>{user.Consecutivedays}</td>
      <td>{user.playlist_count}</td>
    </tr>
  ));

  return (
    <Container size="md" mt="xl">
      <Title align="center" mb="md">🏆 Leaderboard</Title>

      <Group position="center" mb="md">
        <SegmentedControl
          value={view}
          onChange={setView}
          data={[
            { label: 'Global', value: 'global' },
            { label: 'Local', value: 'local' },
          ]}
        />
      </Group>

      {loading ? (
        <Center mt="xl">
          <Loader size="lg" />
        </Center>
      ) : (
        <Paper shadow="md" radius="md" withBorder p="md">
          <Table highlightOnHover striped>
            <thead style={{ borderBottom: '2px solid #000' }}>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Consecutive Days</th>
                <th>Playlists</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
