import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const EventForm = ({ event, onSave, onDelete }) => {
  const [form, setForm] = useState(event || { title: "", date: "", time: "", location: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: event?.id || Date.now(), completed: event?.completed || false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="title" value={form.title} onChange={handleChange} placeholder="Event Title" required />
      <Input name="date" type="date" value={form.date} onChange={handleChange} required />
      <Input name="time" type="time" value={form.time} onChange={handleChange} required />
      <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <div className="flex space-x-4">
        <Button type="submit">Save</Button>
        {event && <Button variant="destructive" onClick={() => onDelete(event.id)}>Delete</Button>}
      </div>
    </form>
  );
};

const CalendarView = ({ events, onDateSelect }) => {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  return (
    <div className="grid grid-cols-7 gap-2">
      {[...Array(daysInMonth)].map((_, i) => {
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), i + 1).toISOString().split("T")[0];
        const dayEvents = events.filter(event => event.date === date);
        return (
          <div
            key={i}
            onClick={() => onDateSelect(date)}
            className="p-2 border rounded cursor-pointer hover:bg-gray-100"
          >
            <p>{i + 1}</p>
            {dayEvents.length > 0 && <p>{dayEvents.length} events</p>}
          </div>
        );
      })}
    </div>
  );
};

const DailyAgenda = ({ events, onEdit }) => (
  <div>
    <h2 className="font-bold text-lg">Today's Events</h2>
    {events.length === 0 ? (
      <p>No events scheduled</p>
    ) : (
      events.map(event => (
        <div key={event.id} className="p-2 border rounded mb-2">
          <h3>{event.title}</h3>
          <p>{event.time} at {event.location}</p>
          <Button onClick={() => onEdit(event)}>Edit</Button>
        </div>
      ))
    )}
  </div>
);

const ProgressTracker = ({ events }) => {
  const completed = events.filter(event => event.completed).length;
  const progress = (completed / events.length) * 100 || 0;

  return (
    <div>
      <Progress value={progress} />
      <p>{completed} of {events.length} events completed</p>
    </div>
  );
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleSave = (event) => {
    if (events.some(e => e.id === event.id)) {
      setEvents(events.map(e => (e.id === event.id ? event : e)));
    } else {
      setEvents([...events, event]);
    }
    setEditingEvent(null);
  };

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const dailyEvents = events.filter(event => event.date === selectedDate);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Planner</h1>
      <CalendarView events={events} onDateSelect={setSelectedDate} />
      <DailyAgenda events={dailyEvents} onEdit={setEditingEvent} />
      <ProgressTracker events={dailyEvents} />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Event</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <EventForm event={editingEvent} onSave={handleSave} onDelete={handleDelete} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
