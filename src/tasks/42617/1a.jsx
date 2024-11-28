import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

// Utility function to format date for display
const formatDate = (date) => format(date, 'MMMM d, yyyy');

// Event Form Component
function EventForm({ onSubmit, onCancel, event = {} }) {
  const [formData, setFormData] = useState({ 
    title: event.title || '', 
    date: event.date || new Date(), 
    time: event.time || '', 
    location: event.location || '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-sm">
        <h2 className="text-xl mb-4">{event.id ? 'Edit Event' : 'Add Event'}</h2>
        <input 
          className="w-full mb-2 p-2 border rounded"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event Title"
        />
        <input 
          type="date"
          className="w-full mb-2 p-2 border rounded"
          name="date"
          value={formatDate(formData.date)}
          onChange={handleChange}
        />
        <input 
          type="time"
          className="w-full mb-2 p-2 border rounded"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />
        <input 
          className="w-full mb-4 p-2 border rounded"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <button onClick={() => onSubmit(formData)} className="bg-blue-500 text-white p-2 rounded mr-2">Save</button>
        <button onClick={onCancel} className="bg-gray-300 p-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

// Calendar Component
function Calendar({ currentDate, setCurrentDate, events, onSelectDay }) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="grid grid-cols-7 gap-1 mt-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
        <div key={day} className="text-center font-bold">{day}</div>
      )}
      {days.map(day => {
        const dayEvents = events.filter(e => isSameDay(e.date, day));
        return (
          <div 
            key={day.toISOString()} 
            onClick={() => onSelectDay(day)}
            className={`text-center p-2 cursor-pointer ${isSameDay(day, currentDate) ? 'bg-blue-200' : ''} hover:bg-gray-100`}
          >
            {day.getDate()}
            {dayEvents.length > 0 && <div className="text-xs mt-1">{dayEvents.length}</div>}
          </div>
        );
      })}
    </div>
  );
}

// Daily Agenda Component
function DailyAgenda({ date, events, onEdit, onDelete }) {
  const dayEvents = events.filter(e => isSameDay(e.date, date));

  return (
    <div>
      <h3 className="text-lg mb-2">Events on {formatDate(date)}</h3>
      {dayEvents.map(event => (
        <div key={event.id} className="border p-2 mb-2 rounded">
          <h4>{event.title}</h4>
          <p>{event.time} at {event.location}</p>
          <button onClick={() => onEdit(event)} className="text-blue-500 mr-2">Edit</button>
          <button onClick={() => onDelete(event.id)} className="text-red-500">Delete</button>
        </div>
      ))}
    </div>
  );
}

// Main App Component
export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = (eventData) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...eventData, id: e.id } : e));
    } else {
      setEvents([...events, { ...eventData, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const completedEvents = events.filter(e => isSameDay(e.date, currentDate) && e.completed).length;
  const totalEvents = events.filter(e => isSameDay(e.date, currentDate)).length;

  return (
    <div className="p-4 max-w-xl mx-auto sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Event Planner</h1>
      <button onClick={() => { setShowForm(true); setEditingEvent(null); }} className="mb-4 bg-green-500 text-white px-4 py-2 rounded">Add Event</button>
      {showForm && 
        <EventForm 
          onSubmit={handleAddEvent} 
          onCancel={() => setShowForm(false)} 
          event={editingEvent} 
        />}
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} events={events} onSelectDay={setCurrentDate} />
      <DailyAgenda 
        date={currentDate} 
        events={events} 
        onEdit={event => { setEditingEvent(event); setShowForm(true); }} 
        onDelete={handleDelete}
      />
      <div className="mt-4">
        <p>Progress: {completedEvents}/{totalEvents} events completed today</p>
      </div>
    </div>
  );
}