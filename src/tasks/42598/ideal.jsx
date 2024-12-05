import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const App = () => {
  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState({});

  const handleAddEvent = (event) => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (new Date(event.date) < new Date(currentDate)) {
      setErrors({ form: "Cannot select a past date for the event." });
      return;
    }

    const newEvent = {
      id: Date.now(),
      ...event,
      rsvps: { Yes: 0, No: 0, Maybe: 0 },
    };

    setEvents([...events, newEvent]);
    setErrors({}); // Clear errors
  };

  const handleRSVP = (eventId, rsvpStatus) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              rsvps: { ...event.rsvps, [rsvpStatus]: event.rsvps[rsvpStatus] + 1 },
            }
          : event
      )
    );
  };

  const sendReminders = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;
    alert(
      `Reminder sent for "${event.name}" - Yes: ${event.rsvps.Yes}, No: ${event.rsvps.No}, Maybe: ${event.rsvps.Maybe}`
    );
  };

  return (
    <div className="p-6 flex space-x-6">
      <div className="w-2/3">
        <h1 className="text-3xl font-bold mb-6">Event RSVP Manager</h1>

        {/* Event Creation Form */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create Event</h2>
          <EventForm onSubmit={handleAddEvent} errors={errors} />
        </section>

        {/* Event RSVP Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">RSVP for Events</h2>
          {events.length > 0 ? (
            events.map((event) => (
              <EventRSVP
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                errors={errors}
                setErrors={setErrors}
              />
            ))
          ) : (
            <p className="text-gray-500">No events available. Create an event first.</p>
          )}
        </section>
      </div>

      {/* Dashboard */}
      <aside className="w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        {events.map((event) => (
          <DashboardCard key={event.id} event={event} sendReminders={sendReminders} />
        ))}
      </aside>
    </div>
  );
};

const EventForm = ({ onSubmit, errors }) => {
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.location) {
      return;
    }
    onSubmit(form);
    setForm({ name: "", date: "", location: "", description: "" }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-80">
      <div>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Event Name"
          required
        />
        {errors.form && <p className="text-red-500 text-sm mt-2">{errors.form}</p>}
      </div>
      <div>
        <Input
          name="date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Event Location"
          required
        />
      </div>
      <Textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Event Description (Optional)"
      />
      <Button type="submit" className="w-full">
        Add Event
      </Button>
    </form>
  );
};

const EventRSVP = ({ event, onRSVP, errors, setErrors }) => {
  const [rsvp, setRsvp] = useState("");

  const handleRSVP = () => {
    const currentDate = new Date().toISOString().split("T")[0];

    if (!rsvp) {
      setErrors((prev) => ({
        ...prev,
        [event.id]: "Please select an RSVP status.",
      }));
      return;
    }

    if (new Date(event.date) < new Date(currentDate)) {
      setErrors((prev) => ({
        ...prev,
        [event.id]: "RSVP is not allowed after the event date.",
      }));
      return;
    }

    onRSVP(event.id, rsvp);
    setErrors((prev) => ({ ...prev, [event.id]: "" })); // Clear error
    setRsvp(""); // Reset RSVP selection
  };

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-lg font-bold">{event.name}</h3>
      <p>Date: {format(new Date(event.date), "do MMMM, yyyy")}</p>
      <p>Location: {event.location}</p>
      <div className="mt-4">
        <Select value={rsvp} onValueChange={setRsvp}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select RSVP" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Maybe">Maybe</SelectItem>
          </SelectContent>
        </Select>
        {errors[event.id] && (
          <p className="text-red-500 text-sm mt-2">{errors[event.id]}</p>
        )}
        <Button
          onClick={handleRSVP}
          className="mt-2 w-full"
          disabled={new Date(event.date) < new Date()}
        >
          Submit RSVP
        </Button>
      </div>
    </div>
  );
};

const DashboardCard = ({ event, sendReminders }) => {
  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-lg font-bold">{event.name}</h3>
      <p>Date: {format(new Date(event.date), "do MMMM, yyyy")}</p>
      <p>Location: {event.location}</p>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="text-center">
          <p className="text-sm text-gray-600">Yes</p>
          <p className="text-lg font-bold">{event.rsvps.Yes}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">No</p>
          <p className="text-lg font-bold">{event.rsvps.No}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Maybe</p>
          <p className="text-lg font-bold">{event.rsvps.Maybe}</p>
        </div>
      </div>
      <Button
        onClick={() => sendReminders(event.id)}
        className="mt-4 w-full"
        disabled={new Date(event.date) < new Date()}
      >
        Send Reminder
      </Button>
    </div>
  );
};

export default App;
