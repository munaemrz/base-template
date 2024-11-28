import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Utility function to format time
const formatTime = (date) => {
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

// Session Component
const Session = ({ session, onEdit, onDelete, onComplete }) => {
  return (
    <div className="border p-4 mb-2 rounded shadow">
      <h2 className="text-lg font-bold">{session.subject}</h2>
      <p>{session.date.toDateString()} at {formatTime(session.date)}</p>
      <button onClick={() => onEdit(session)} className="mr-2 mt-2 bg-blue-500 text-white px-4 py-1 rounded">Edit</button>
      <button onClick={() => onDelete(session.id)} className="mr-2 mt-2 bg-red-500 text-white px-4 py-1 rounded">Delete</button>
      <button onClick={() => onComplete(session.id)} className="mt-2 bg-green-500 text-white px-4 py-1 rounded">{session.completed ? 'Undo' : 'Complete'}</button>
    </div>
  );
};

// Main App Component
export default function App() {
  const [sessions, setSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    setSessions(savedSessions);
  }, []);

  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = () => {
    if (editingSession) {
      setSessions(sessions.map(s => s.id === editingSession.id ? { ...s, subject, date } : s));
      setEditingSession(null);
    } else {
      const newSession = { id: Date.now(), subject, date, completed: false };
      setSessions([...sessions, newSession]);
    }
    setSubject('');
    setDate(new Date());
  };

  const deleteSession = (id) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const editSession = (session) => {
    setEditingSession(session);
    setSubject(session.subject);
    setDate(session.date);
  };

  const completeSession = (id) => {
    setSessions(sessions.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  const totalHours = sessions.reduce((acc, session) => {
    // Assuming each session is an hour for simplicity
    return acc + (session.completed ? 1 : 0);
  }, 0);

  return (
    <div className="p-4 max-w-lg mx-auto sm:max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Study Planner</h1>
      
      {/* Add/Edit Session Form */}
      <div className="mb-4">
        <input 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full p-2 border mb-2 rounded"
        />
        <DatePicker 
          selected={date} 
          onChange={(date) => setDate(date)} 
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full p-2 border mb-2 rounded"
        />
        <button onClick={addSession} className="w-full bg-green-500 text-white p-2 rounded">
          {editingSession ? 'Update Session' : 'Add Session'}
        </button>
      </div>

      {/* Sessions List */}
      <div>
        {sessions.map(session => (
          <Session 
            key={session.id} 
            session={session} 
            onEdit={editSession}
            onDelete={deleteSession}
            onComplete={completeSession}
          />
        ))}
      </div>

      {/* Daily Summary */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold">Daily Summary</h2>
        <p>Total Study Hours: {totalHours}</p>
      </div>
    </div>
  );
}