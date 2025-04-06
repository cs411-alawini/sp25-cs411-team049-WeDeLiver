import React from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Burger, Container, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import classes from './AppHeader.module.css';

const links = [
  { path: '/home', label: 'Home' },
  { path: '/playlist', label: 'Playlist' },
  { path: '/questions', label: 'Questions' },
  { path: '/leaderboard', label: 'Leaderboard' },
];


export function AppHeader({ userId }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Group gap={20} visibleFrom="sm">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className={classes.link}>
                {link.label}
              </Link>
            ))}
          </Group>

          <Group gap={20} align="center">
            <Text className={classes.userId}>{userId}</Text>  {/* Display user ID */}
          </Group>

          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}