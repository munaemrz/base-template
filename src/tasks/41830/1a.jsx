import React, { useState, useEffect } from 'react';
import { Calendar, Select, Button, Card, LineChart, PieChart } from 'react-tailwind-shadcn';

const MOODS = [
  { value: 'Happy', label: 'Happy' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Sad', label: 'Sad' },
];

function JournalEntryForm({ onSubmit, onCancel, entry = {} }) {
  const [form, setForm] = useState({ title: entry.title || '', date: entry.date || new Date(), mood: entry.mood || 'Neutral' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, date: form.date.toISOString().split('T')[0] });
  };

  return (
    <Card className="p-4 sm:p-6">
      <form onSubmit={handleSubmit}>
        <input 
          value={form.title} 
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
          placeholder="Title" 
          className="mb-2 block w-full p-2 border rounded"
        />
        <input 
          type="date" 
          value={form.date} 
          onChange={(e) => setForm({ ...form, date: new Date(e.target.value) })} 
          className="mb-2 block w-full p-2 border rounded"
        />
        <Select 
          options={MOODS} 
          selected={form.mood} 
          onChange={(value) => setForm({ ...form, mood: value })} 
          className="mb-2"
        />
        <Button type="submit" className="mr-2">Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </form>
    </Card>
  );
}

function App() {
  const [entries, setEntries] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filterMood, setFilterMood] = useState(null);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    setEntries(storedEntries);
  }, []);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry) => {
    setEntries([...entries, { ...entry, id: Date.now() }]);
    setSelectedEntry(null);
  };

  const updateEntry = (updatedEntry) => {
    setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    setSelectedEntry(null);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const moodCount = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const streak = () => {
    let currentStreak = 0;
    let lastDate = null;
    for (const entry of entries.sort((a, b) => new Date(b.date) - new Date(a.date))) {
      const entryDate = new Date(entry.date);
      if (!lastDate || entryDate.toDateString() === lastDate.toDateString()) {
        currentStreak++;
      } else if (lastDate - entryDate === 86400000) { // one day in milliseconds
        currentStreak++;
      } else {
        break;
      }
      lastDate = entryDate;
    }
    return currentStreak;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Mental Wellness Journal</h1>
      {selectedEntry === null ? (
        <>
          <Button onClick={() => setSelectedEntry({})}>New Entry</Button>
          <div className="mt-4 flex flex-wrap justify-between">
            <Card className="w-full sm:w-1/2 mb-4 sm:mb-0">
              <h2 className="text-lg mb-2">Summary</h2>
              <p>Total Entries: {entries.length}</p>
              <PieChart 
                data={Object.entries(moodCount).map(([mood, count]) => ({ mood, count }))} 
                valueAccessor={d => d.count} 
                labelAccessor={d => d.mood}
              />
            </Card>
            <Card className="w-full sm:w-1/2">
              <h2 className="text-lg mb-2">Current Streak</h2>
              <p>{streak()} days</p>
            </Card>
          </div>
          <div className="mt-4">
            <Button onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}>
              Switch to {viewMode === 'list' ? 'Calendar' : 'List'} View
            </Button>
            <Select 
              options={[{value: null, label: 'All'}, ...MOODS]} 
              selected={filterMood}
              onChange={setFilterMood}
              className="ml-2"
            />
            {viewMode === 'list' ? (
              <ul>
                {entries.filter(e => !filterMood || e.mood === filterMood).map(entry => (
                  <li key={entry.id} className="border p-2 mb-2">
                    <h3>{entry.title}</h3>
                    <p>{entry.date} - {entry.mood}</p>
                    <Button onClick={() => setSelectedEntry(entry)}>Edit</Button>
                    <Button onClick={() => deleteEntry(entry.id)} className="ml-2">Delete</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <Calendar 
                entries={entries.filter(e => !filterMood || e.mood === filterMood)} 
                onSelectDate={(date) => console.log('Selected', date)}
              />
            )}
          </div>
        </>
      ) : (
        <JournalEntryForm 
          onSubmit={selectedEntry.id ? updateEntry : addEntry} 
          onCancel={() => setSelectedEntry(null)} 
          entry={selectedEntry}
        />
      )}
    </div>
  );
}

export default App;