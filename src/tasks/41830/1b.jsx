import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MOODS = ["Happy", "Neutral", "Sad"];

export default function App() {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState("");
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const storedEntries = localStorage.getItem("journalEntries");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
    updateStreak();
  }, [entries]);

  const updateStreak = () => {
    let currentStreak = 0;
    const today = new Date().toDateString();
    for (let i = entries.length - 1; i >= 0; i--) {
      const entryDate = new Date(entries[i].date).toDateString();
      if (
        entryDate === today ||
        (currentStreak > 0 &&
          new Date(entryDate).getTime() >=
            new Date(today).getTime() - currentStreak * 86400000)
      ) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setEntries(
        entries.map((entry) =>
          entry.id === editingId
            ? { ...entry, title, date: selectedDate, mood: selectedMood }
            : entry
        )
      );
      setEditingId(null);
    } else {
      setEntries([
        ...entries,
        {
          id: Date.now(),
          title,
          date: selectedDate,
          mood: selectedMood,
        },
      ]);
    }
    setTitle("");
    setSelectedMood("");
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setSelectedDate(new Date(entry.date));
    setSelectedMood(entry.mood);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const filteredEntries = entries.filter(
    (entry) =>
      (!selectedMood || entry.mood === selectedMood) &&
      new Date(entry.date).toDateString() === selectedDate.toDateString()
  );

  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Mental Wellness Journal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Add/Edit Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <Select
              value={selectedMood}
              onValueChange={setSelectedMood}
              required
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select mood" />
              </Select.Trigger>
              <Select.Content>
                {MOODS.map((mood) => (
                  <Select.Item key={mood} value={mood}>
                    {mood}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Button type="submit">{editingId ? "Update" : "Add"} Entry</Button>
          </form>
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Journal Entries</h2>
          <Select
            value={selectedMood}
            onValueChange={setSelectedMood}
            className="mb-4"
          >
            <Select.Trigger className="w-full">
              <Select.Value placeholder="Filter by mood" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">All Moods</Select.Item>
              {MOODS.map((mood) => (
                <Select.Item key={mood} value={mood}>
                  {mood}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="mb-4 p-2 border rounded">
              <h3 className="font-semibold">{entry.title}</h3>
              <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
              <p>Mood: {entry.mood}</p>
              <div className="mt-2">
                <Button
                  onClick={() => handleEdit(entry)}
                  className="mr-2"
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(entry.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card className="mt-6 p-4">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p>Total Entries: {entries.length}</p>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Mood Distribution</h3>
          {MOODS.map((mood) => (
            <div key={mood} className="mb-2">
              <p>
                {mood}: {moodCounts[mood] || 0}
              </p>
              <Progress
                value={((moodCounts[mood] || 0) / entries.length) * 100}
              />
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-6 p-4">
        <h2 className="text-xl font-semibold mb-4">Progress Tracker</h2>
        <p>Current Streak: {streak} days</p>
        <Progress value={(streak / 30) * 100} className="mt-2" />
      </Card>
    </div>
  );
}