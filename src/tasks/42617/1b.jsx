import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const EventForm = ({ event, onSave, onDelete }) => {
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(event?.date || "");
  const [time, setTime] = useState(event?.time || "");
  const [location, setLocation] = useState(event?.location || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: event?.id || Date.now(), title, date, time, location });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-between">
        <Button type="submit">Save</Button>
        {event && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
};

const EventItem = ({ event, onEdit, onToggleComplete }) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div>
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500">
          {event.time} - {event.location}
        </p>
      </div>
      <div className="flex space-x-2">
        <input
          type="checkbox"
          checked={event.completed}
          onChange={() => onToggleComplete(event.id)}
          className="w-4 h-4"
        />
        <Button size="sm" onClick={() => onEdit(event)}>
          Edit
        </Button>
      </div>
    </div>
  );
};

const DailyAgenda = ({ events, onEdit, onToggleComplete }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Daily Agenda</h2>
      {events.length === 0 ? (
        <p>No events scheduled for this day.</p>
      ) : (
        events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onEdit={onEdit}
            onToggleComplete={onToggleComplete}
          />
        ))
      )}
    </div>
  );
};

const ProgressTracker = ({ events }) => {
  const completedCount = events.filter((event) => event.completed).length;
  const progress = (completedCount / events.length) * 100 || 0;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Progress Tracker</h2>
      <Progress value={progress} className="w-full" />
      <p>
        {completedCount} of {events.length} events completed
      </p>
    </div>
  );
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleSaveEvent = (event) => {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents([...events, event]);
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter((e) => e.id !== editingEvent.id));
    setEditingEvent(null);
  };

  const handleToggleComplete = (id) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, completed: !event.completed } : event
      )
    );
  };

  const selectedDateEvents = events.filter(
    (event) => event.date === selectedDate.toISOString().split("T")[0]
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Event Planner</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border shadow"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4">Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <EventForm onSave={handleSaveEvent} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          <DailyAgenda
            events={selectedDateEvents}
            onEdit={setEditingEvent}
            onToggleComplete={handleToggleComplete}
          />
          <ProgressTracker events={selectedDateEvents} />
        </div>
      </div>
      {editingEvent && (
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <EventForm
              event={editingEvent}
              onSave={handleSaveEvent}
              onDelete={handleDeleteEvent}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}