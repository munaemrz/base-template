import React, { useState } from 'react';

// Utility function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Event Form Component
function EventForm({ onSubmit }) {
  const [event, setEvent] = useState({ name: '', date: '', location: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(event);
    setEvent({ name: '', date: '', location: '', description: '' });
  };

  return (
    <div className="sm:w-full w-3/4 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          value={event.name} 
          onChange={e => setEvent({ ...event, name: e.target.value })}
          placeholder="Event Name" 
          className="input input-bordered w-full"
        />
        <input 
          type="date" 
          value={event.date} 
          onChange={e => setEvent({ ...event, date: e.target.value })}
          className="input input-bordered w-full"
        />
        <input 
          type="text" 
          value={event.location} 
          onChange={e => setEvent({ ...event, location: e.target.value })}
          placeholder="Location" 
          className="input input-bordered w-full"
        />
        <textarea 
          value={event.description} 
          onChange={e => setEvent({ ...event, description: e.target.value })}
          placeholder="Description" 
          className="textarea textarea-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">Create Event</button>
      </form>
    </div>
  );
}

// RSVP Form Component
function RSVPForm({ eventId, onSubmit }) {
  const [rsvp, setRsvp] = useState('yes');

  return (
    <div className="sm:w-full w-3/4 mx-auto">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(eventId, rsvp); }}>
        <select 
          value={rsvp} 
          onChange={e => setRsvp(e.target.value)} 
          className="select select-bordered w-full"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="maybe">Maybe</option>
        </select>
        <button type="submit" className="mt-2 btn btn-secondary w-full">RSVP</button>
      </form>
    </div>
  );
}

// Event Dashboard Component
function EventDashboard({ events, sendReminder }) {
  return (
    <div className="space-y-4">
      {events.map(event => (
        <div key={event.id} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{event.name}</h2>
            <p>Date: {formatDate(event.date)}</p>
            <p>Location: {event.location}</p>
            <p>{event.description}</p>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Yes</div>
                <div className="stat-value">{event.rsvps.yes}</div>
              </div>
              <div className="stat">
                <div className="stat-title">No</div>
                <div className="stat-value">{event.rsvps.no}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Maybe</div>
                <div className="stat-value">{event.rsvps.maybe}</div>
              </div>
            </div>
            <button onClick={() => sendReminder(event.id)} className="btn btn-info mt-4">Send Reminder</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main App Component
export default function App() {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents(prevEvents => [...prevEvents, { 
      ...event, 
      id: Date.now(), 
      rsvps: { yes: 0, no: 0, maybe: 0 } 
    }]);
  };

  const updateRSVP = (eventId, status) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { 
          ...event, 
          rsvps: { ...event.rsvps, [status]: event.rsvps[status] + 1 } 
        } : event
      )
    );
  };

  const sendReminder = (eventId) => {
    const event = events.find(e => e.id === eventId);
    alert(`Reminder sent for ${event.name}`);
  };

  return (
    <div className="App p-4 sm:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Event RSVP Manager</h1>
      <EventForm onSubmit={addEvent} />
      <h2 className="text-2xl mt-8 mb-4">Events</h2>
      {events.map(event => (
        <div key={event.id} className="mb-4">
          <h3 className="text-xl">{event.name}</h3>
          <RSVPForm eventId={event.id} onSubmit={updateRSVP} />
        </div>
      ))}
      <h2 className="text-2xl mt-8 mb-4">Dashboard</h2>
      <EventDashboard events={events} sendReminder={sendReminder} />
    </div>
  );
}