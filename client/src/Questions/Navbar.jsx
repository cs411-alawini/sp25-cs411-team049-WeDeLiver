import { useEffect, useState } from 'react';
import { IconDatabaseImport, IconSearch } from '@tabler/icons-react';
import { TextInput } from '@mantine/core';
import classes from './Navbar.module.css';
import axios from 'axios';

export default function Navbar({ userId, setSelectedMood, refresh, isExistingEntry, moodEntries }) {
  const [activeDate, setActiveDate] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilteredEntries(moodEntries);
    if (moodEntries.length > 0 && !activeDate) {
      handleClick(moodEntries[0]);
    }
  }, [moodEntries]);

  useEffect(() => {
    const filtered = moodEntries.filter((entry) =>
      entry.date.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEntries(filtered);
  }, [search, moodEntries]);

  const handleClick = (mood) => {
    setActiveDate(mood.date);
    setSelectedMood(mood);
    console.log('Selected mood health data:', mood);
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
    <div>
      <nav className={classes.navbar}>
        <TextInput
          placeholder="Search"
          size="sm"
          leftSection={<IconSearch size={12} stroke={1.5} />}
          styles={{
            input: { width: '270px', marginBottom: '1rem', marginTop: '0.5rem'},
            section: { pointerEvents: 'none' }
          }}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <div className={classes.navbarMain}>{moodLinks}</div>
      </nav>
    </div>
  );
}
