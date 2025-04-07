import { Table, Container, Paper } from '@mantine/core';

export default function PlaylistTable({ songs }) {
  if (!songs) {
    return <div>No songs available in this playlist.</div>;
  }

  const rows = songs.map((song, index) => (
    <tr key={song.songId || index} style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
      <td>{song.Artists}</td>
      <td>{song.AlbumName}</td>
      <td>{song.TrackName}</td>
    </tr>
  ));

  return (
    <Container size="md" mt="xl">
      <Paper shadow="md" radius="md" withBorder p="md" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Table style={{ width: '800px', height: '400px', tableLayout: 'fixed' }}>
            <thead style={{ borderBottom: '3px solid #000' }}>
            <tr>
              <th style={{ textAlign: 'left' }}>Artists</th>
              <th style={{ textAlign: 'left' }}>Album</th>
              <th style={{ textAlign: 'left' }}>Track Name</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Container>
  );
}