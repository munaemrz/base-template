import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";

const EventForm = ({ onSubmit }) => {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(eventData);
    setEventData({ name: "", date: "", location: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        value={eventData.name}
        onChange={handleChange}
        placeholder="Event Name"
        required
      />
      <Input
        name="date"
        type="date"
        value={eventData.date}
        onChange={handleChange}
        required
      />
      <Input
        name="location"
        value={eventData.location}
        onChange={handleChange}
        placeholder="Location"
        required
      />
      <Textarea
        name="description"
        value={eventData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <Button type="submit">Create Event</Button>
    </form>
  );
};

const RSVPForm = ({ eventId, onSubmit }) => {
  const [rsvpStatus, setRsvpStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(eventId, rsvpStatus);
    setRsvpStatus("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        value={rsvpStatus}
        onChange={(e) => setRsvpStatus(e.target.value)}
        required
      >
        <option value="">Select RSVP Status</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
        <option value="Maybe">Maybe</option>
      </Select>
      <Button type="submit">Submit RSVP</Button>
    </form>
  );
};

const EventDashboard = ({ events }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Event Dashboard</h2>
      {events.map((event) => (
        <Card key={event.id} className="p-4">
          <h3 className="text-xl font-semibold">{event.name}</h3>
          <p>Date: {event.date}</p>
          <p>Location: {event.location}</p>
          <p>Total RSVPs: {event.rsvps.length}</p>
          <p>
            Yes: {event.rsvps.filter((rsvp) => rsvp.status === "Yes").length}
          </p>
          <p>No: {event.rsvps.filter((rsvp) => rsvp.status === "No").length}</p>
          <p>
            Maybe: {event.rsvps.filter((rsvp) => rsvp.status === "Maybe").length}
          </p>
        </Card>
      ))}
    </div>
  );
};

const ReminderForm = ({ events, onSubmit }) => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedEvent, reminderMessage);
    setSelectedEvent("");
    setReminderMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        required
      >
        <option value="">Select Event</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </Select>
      <Textarea
        value={reminderMessage}
        onChange={(e) => setReminderMessage(e.target.value)}
        placeholder="Reminder Message"
        required
      />
      <Button type="submit">Send Reminder</Button>
    </form>
  );
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      rsvps: [],
    };
    setEvents([...events, newEvent]);
    setToastMessage("Event created successfully!");
    setShowToast(true);
  };

  const handleRSVP = (eventId, status) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              rsvps: [...event.rsvps, { id: Date.now().toString(), status }],
            }
          : event
      )
    );
    setToastMessage("RSVP submitted successfully!");
    setShowToast(true);
  };

  const handleSendReminder = (eventId, message) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      // In a real app, you would send actual reminders here
      console.log(`Sending reminder for ${event.name}: ${message}`);
      setToastMessage("Reminder sent successfully!");
      setShowToast(true);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Event RSVP Manager</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Create Event</h2>
          <EventForm onSubmit={handleCreateEvent} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">RSVP to Event</h2>
          <Select className="mb-4">
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </Select>
          <RSVPForm eventId={events[0]?.id} onSubmit={handleRSVP} />
        </section>

        <section>
          <EventDashboard events={events} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Send Reminders</h2>
          <ReminderForm events={events} onSubmit={handleSendReminder} />
        </section>
      </div>

      {showToast && (
        <Toast className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded">
          {toastMessage}
        </Toast>
      )}
    </div>
  );
}