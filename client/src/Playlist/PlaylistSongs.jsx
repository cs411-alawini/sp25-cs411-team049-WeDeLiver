import { Table, Container, Paper } from '@mantine/core';

export default function PlaylistTable({ songs }) {
  if (!songs) {
    return <div>You have not generated any playlists</div>;
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
            {/* <thead style={{ borderBottom: '3px solid #000' }}>
            <tr>
              <th style={{ textAlign: 'left' }}>Artists</th>
              <th style={{ textAlign: 'left' }}>Album</th>
              <th style={{ textAlign: 'left' }}>Track Name</th>
            </tr>
          </thead> */}
          <tbody>
            {songs.map((song, index) => (
              <tr key={song.TrackID || index} style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                <td colSpan={3} style={{ padding: 0, border: 'none' }}>
                  <iframe
                    style={{ borderRadius: '12px' }}
                    src={`https://open.spotify.com/embed/track/${song.TrackID}?utm_source=generator`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Container>
  );
}