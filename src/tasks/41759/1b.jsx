import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from "@/components/ui";

function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });
  const [newHabit, setNewHabit] = useState({ title: '', description: '' });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabit.title) {
      setHabits([...habits, { ...newHabit, id: Date.now(), streak: 0, lastCompleted: null, history: [] }]);
      setNewHabit({ title: '', description: '' });
    }
  };

  const completeHabit = (id) => {
    const date = new Date().toISOString().split('T')[0];
    setHabits(habits.map(h => 
      h.id === id ? { 
        ...h, 
        streak: (h.lastCompleted === getYesterday() ? h.streak + 1 : 1),
        lastCompleted: date,
        history: [...h.history.slice(-29), date] 
      } : h
    ));
  };

  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Habit Tracker</h1>
        
        {/* Add Habit Form */}
        <Card className="mb-4">
          <CardHeader>
            <Input 
              value={newHabit.title} 
              onChange={e => setNewHabit({...newHabit, title: e.target.value})} 
              placeholder="Habit Title" 
              className="mb-2"
            />
            <Input 
              value={newHabit.description} 
              onChange={e => setNewHabit({...newHabit, description: e.target.value})} 
              placeholder="Description" 
            />
          </CardHeader>
          <CardFooter>
            <Button onClick={addHabit}>Add Habit</Button>
          </CardFooter>
        </Card>

        {/* Habit List */}
        {habits.map((habit) => (
          <HabitCard 
            key={habit.id} 
            habit={habit} 
            onComplete={completeHabit} 
          />
        ))}
      </div>
    </div>
  );
}

function HabitCard({ habit, onComplete }) {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.lastCompleted === today;

  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{habit.title}</h2>
          <p>{habit.description}</p>
        </div>
        <span className="text-sm bg-green-200 px-2 py-1 rounded">Streak: {habit.streak}</span>
      </CardHeader>
      <CardBody>
        <div>Last 30 days: {habit.history.filter(d => d).length}/30</div>
      </CardBody>
      <CardFooter>
        {!isCompletedToday && <Button onClick={() => onComplete(habit.id)}>Mark as Done</Button>}
        {isCompletedToday && <Button disabled>Completed Today</Button>}
      </CardFooter>
    </Card>
  );
}

export default App;