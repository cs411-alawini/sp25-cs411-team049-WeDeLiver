import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Title, Loader, Center, Paper } from '@mantine/core';
// the order of playlist in is backend
export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:3007/api/leaderboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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
