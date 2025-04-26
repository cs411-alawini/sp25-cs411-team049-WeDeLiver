import React, { useEffect, useState } from 'react';
import { Burger, Container, Group, Text, Button, ActionIcon, Drawer, Stack } from '@mantine/core';
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

  const handleLinkClick = () => {
    if (opened) {
      toggle();
    }
  };

  const navigationLinks = (
    <>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={classes.link}
          onClick={handleLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  const mobileNavigationLinks = (
    <Stack gap="sm">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={classes.link}
          onClick={handleLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </Stack>
  );

  const userInfo = (
    <Group gap={20} align="center">
      {userId && (
        <Text className={classes.userId}>
          {userName}, {userId}
        </Text>
      )}
      <ActionIcon
        variant="transparent"
        color="red"
        size="xs"
        onClick={() => {
          onLogout();
          navigate('/');
          if (opened) toggle();
        }}
      >
        <IconLogout size={16} />
      </ActionIcon>
    </Group>
  );

  const userInfoWithoutLogout = (
    <Group gap={20} align="center">
      {userId && (
        <Text className={classes.userId}>
          {userName}, {userId}
        </Text>
      )}
    </Group>
  );

  return (
    <>
      <header className={classes.header}>
        <Container fluid>
          <div className={classes.inner}>
            <Group gap={20} visibleFrom="sm">
              {navigationLinks}
            </Group>

            <Group gap={20} align="center" justify="space-between" style={{ width: '100%' }} hiddenFrom="sm">
              {userInfoWithoutLogout}
              <Burger opened={opened} onClick={toggle} size="sm" />
            </Group>

            <Group gap={20} align="center" visibleFrom="sm">
              {userInfo}
            </Group>
          </div>
        </Container>
      </header>

      <Drawer
        opened={opened}
        onClose={toggle}
        size="xs"
        position="left"
        hiddenFrom="sm"
        withCloseButton={false}
      >
        <Stack gap="xl" p="md">
          {userInfo}
          {mobileNavigationLinks}
        </Stack>
      </Drawer>
    </>
  );
}