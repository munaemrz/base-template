import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const MOODS = ["Happy", "Neutral", "Sad"];

const JournalForm = ({ onSave, onCancel, entry = {} }) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [date, setDate] = useState(entry?.date || "");
  const [mood, setMood] = useState(entry?.mood || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && date && mood) {
      onSave({ id: entry?.id || Date.now(), title, date, mood });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        required
        className="border p-2 rounded w-full"
      >
        <option value="" disabled>
          Select Mood
        </option>
        {MOODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <div className="flex space-x-4">
        <Button type="submit">Save Entry</Button>
        <Button variant="destructive" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const CalendarView = ({ entries, onDateSelect }) => {
  const daysInMonth = new Date().getDate();

  return (
    <div className="grid grid-cols-7 gap-2">
      {[...Array(daysInMonth)].map((_, i) => {
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), i + 1).toISOString().split("T")[0];
        const dayEntries = entries.filter((entry) => entry.date === date);
        return (
          <div
            key={i}
            onClick={() => onDateSelect(date)}
            className="p-2 border rounded cursor-pointer hover:bg-gray-100"
          >
            <p>{i + 1}</p>
            {dayEntries.length > 0 && <p>{dayEntries.length} entries</p>}
          </div>
        );
      })}
    </div>
  );
};

const DailySummary = ({ entries }) => {
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-xl font-semibold">Mood Distribution</h2>
      {MOODS.map((mood) => (
        <div key={mood}>
          <p>
            {mood}: {moodCounts[mood] || 0}
          </p>
          <Progress value={(moodCounts[mood] || 0) / entries.length * 100 || 0} />
        </div>
      ))}
    </div>
  );
};

const StreakTracker = ({ entries }) => {
  const calculateStreak = () => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let lastDate = null;

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      if (!lastDate || (lastDate - entryDate) / (1000 * 60 * 60 * 24) === 1) {
        streak++;
        lastDate = entryDate;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Journaling Streak</h2>
      <p>Current Streak: {calculateStreak()} days</p>
      <Progress value={(calculateStreak() / 30) * 100} />
    </div>
  );
};

const App = () => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSaveEntry = (entry) => {
    if (editingEntry) {
      setEntries((prevEntries) =>
        prevEntries.map((e) => (e.id === editingEntry.id ? entry : e))
      );
    } else {
      setEntries((prevEntries) => [...prevEntries, entry]);
    }
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };

  const filteredEntries = selectedDate
    ? entries.filter((entry) => entry.date === selectedDate)
    : entries;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Mental Wellness Journal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Journal Form</h2>
          <JournalForm
            onSave={handleSaveEntry}
            onCancel={() => setEditingEntry(null)}
            entry={editingEntry}
          />
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
          <CalendarView entries={entries} onDateSelect={setSelectedDate} />
        </Card>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
          <DailySummary entries={filteredEntries} />
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Streak Tracker</h2>
          <StreakTracker entries={entries} />
        </Card>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Journal Entries</h2>
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="p-4 border rounded mb-4">
            <h3 className="text-lg font-semibold">{entry.title}</h3>
            <p>{entry.date} - {entry.mood}</p>
            <Button onClick={() => setEditingEntry(entry)} className="mr-2">
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteEntry(entry.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
