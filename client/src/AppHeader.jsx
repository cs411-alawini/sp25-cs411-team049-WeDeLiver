import React, { useEffect, useState } from 'react';
import { Burger, Container, Group, Text, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './AppHeader.module.css';
import { IconLogout } from '@tabler/icons-react';

const links = [
  { path: '/home', label: 'Home' },
  { path: '/playlist', label: 'Playlist' },
  { path: '/questions', label: 'Questions' },
  { path: '/leaderboard', label: 'Leaderboard' },
];

export function AppHeader({ userId, onLogout }) {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [userName, setUserName] = useState('');

  // Fetch user details when the component mounts
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3007/api/user/${userId}`)
        .then(response => {
          setUserName(response.data.Name); // Set the user's name
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    }
  }, [userId]);

  return (
    <header className={classes.header}>
      <Container fluid>
        <div className={classes.inner}>
          <Group gap={20} visibleFrom="sm">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className={classes.link}>
                {link.label}
              </Link>
            ))}
          </Group>

          <Group gap={20} align="center">
            {userId && (
              <Text className={classes.userId}>
                {userName}, {userId}
              </Text>
            )}
            <ActionIcon variant="transparent" color="red" size="xs" onClick={() => { onLogout(); navigate('/'); }}>
              <IconLogout size={16} />
            </ActionIcon>
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          </Group>
        </div>
      </Container>
    </header>
  );
}