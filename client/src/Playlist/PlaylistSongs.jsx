import { Box, Container, Stack } from '@mantine/core';

export default function PlaylistTable({ songs }) {
  if (!songs) {
    return <div>You have not generated any playlists</div>;
  }

  return (
    <Box style={{ 
      width: '100%',
      height: '100%',
      overflowY: 'auto'
    }}>
      <Container size="sm" style={{ 
        padding: '20px',
        height: '100%'
      }}>
        <Stack spacing="xl">
          {songs.map((song, index) => (
            <div key={song.TrackID || index}>
              <iframe
                style={{ 
                  borderRadius: '12px',
                  width: '100%',
                  maxWidth: '100%'
                }}
                src={`https://open.spotify.com/embed/track/${song.TrackID}?utm_source=generator`}
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}