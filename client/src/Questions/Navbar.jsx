import { useEffect, useState, useRef } from 'react';
import { IconDatabaseImport, IconSearch } from '@tabler/icons-react';
import { TextInput, ActionIcon, Box } from '@mantine/core';
import classes from './Navbar.module.css';
import axios from 'axios';

export default function Navbar({ userId, setSelectedMood, refresh }) {
  const [activeDate, setActiveDate] = useState('');
  const [moodEntries, setMoodEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navbarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    async function fetchMoodHealth() {
      try {
        const response = await axios.get(`http://localhost:3007/api/moodhealth/${userId}`);
        const fetchedData = response.data || [];
        const currentDate = new Date().toISOString().split('T')[0];

        const structuredData = fetchedData.map((entry) => ({
          date: new Date(entry.Date).toISOString().split('T')[0],
          ...entry,
        }));

        setMoodEntries(structuredData);
        setFilteredEntries(structuredData);

        if (structuredData.length > 0 && !activeDate) {
          handleClick(structuredData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch mood entries:', error);
      }
    }

    if (userId) {
      fetchMoodHealth();
    }
  }, [userId, refresh]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isExpanded &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    const filtered = moodEntries.filter((entry) =>
      entry.date.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEntries(filtered);
  }, [search, moodEntries]);

  const handleClick = (mood) => {
    setActiveDate(mood.date);
    setSelectedMood(mood);
    setIsExpanded(false);
  };

  const moodLinks = filteredEntries.map((entry) => (
    <a
      className={classes.link}
      data-active={entry.date === activeDate || undefined}
      href="#"
      key={entry.date}
      onClick={(event) => {
        event.preventDefault();
        handleClick(entry);
      }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.5rem 0',
        textDecoration: 'none',
      }}
    >
      <IconDatabaseImport className={classes.linkIcon} stroke={1.5} style={{ marginTop: 2 }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{entry.date}</span>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>
          Mood Score: {entry.MoodScore}
        </span>
      </div>
    </a>
  ));

  return (
    <>
      <nav ref={navbarRef} className={`${classes.navbar} ${isExpanded ? classes.expanded : ''}`}>
        <Box className={classes.navbarContainer}>
          <TextInput
            placeholder="Search"
            size="sm"
            leftSection={<IconSearch size={12} stroke={1.5} />}
            styles={{
              input: { width: '100%', marginBottom: '1rem', marginTop: '0.5rem'},
              section: { pointerEvents: 'none' }
            }}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <div className={classes.navbarMain}>{moodLinks}</div>
        </Box>
      </nav>
      <ActionIcon
        ref={toggleButtonRef}
        className={classes.toggleButton}
        variant="subtle"
        size="lg"
        onClick={() => setIsExpanded(!isExpanded)}
        hiddenFrom="xs"
      >
        <IconSearch size={20} />
      </ActionIcon>
    </>
  );
}
