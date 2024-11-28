import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";


const AddDestinationForm = ({ onAdd }) => {
  const [form, setForm] = useState({ location: "", date: "", activities: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.location && form.date) {
      onAdd({ ...form, id: Date.now(), status: "upcoming" });
      setForm({ location: "", date: "", activities: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      />
      <Input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />
      <Input
        placeholder="Activities (comma-separated)"
        value={form.activities}
        onChange={(e) => setForm({ ...form, activities: e.target.value })}
        required
      />
      <Button type="submit">Add Destination</Button>
    </form>
  );
};

const DestinationList = ({ destinations, updateStatus }) => {
  const categories = ["upcoming", "ongoing", "completed"];

  return (
    <div>
      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="font-bold capitalize mb-2">{category} Trips</h3>
          {destinations
            .filter((dest) => dest.status === category)
            .map((dest, index) => (
              <Card key={dest.id} className="p-4">
                <h4 className="font-semibold">{dest.location}</h4>
                <p>Date: {dest.date}</p>
                <p>Activities: {dest.activities}</p>
                {category !== "completed" && (
                  <Button
                    onClick={() =>
                      updateStatus(dest.id, category === "upcoming" ? "ongoing" : "completed")
                    }
                  >
                    {category === "upcoming" ? "Start Trip" : "Complete Trip"}
                  </Button>
                )}
              </Card>
            ))}
        </div>
      ))}
    </div>
  );
};

const SummaryView = ({ destinations }) => {
  const totalTrips = destinations.length;
  const totalDays = destinations.reduce((acc) => acc + 1, 0);
  const allActivities = [
    ...new Set(destinations.flatMap((dest) => dest.activities.split(", "))),
  ];

  return (
    <Card className="p-4">
      <h3 className="font-bold mb-2">Summary</h3>
      <p>Total Trips: {totalTrips}</p>
      <p>Total Days: {totalDays}</p>
      <p>Key Activities:</p>
      <ul className="list-disc pl-5">
        {allActivities.map((activity, i) => (
          <li key={i}>{activity}</li>
        ))}
      </ul>
    </Card>
  );
};

const MapView = ({ destinations }) => (
  <div className="h-64 bg-gray-200 flex items-center justify-center">
    <p>Map Placeholder ({destinations.length} destinations pinned)</p>
  </div>
);

export default function App() {
  const [destinations, setDestinations] = useState([]);

  const addDestination = (destination) => {
    setDestinations((prev) => [...prev, destination]);
  };

  const updateStatus = (id, newStatus) => {
    setDestinations((prev) =>
      prev.map((dest) => (dest.id === id ? { ...dest, status: newStatus } : dest))
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Travel Itinerary Manager</h1>
      <AddDestinationForm onAdd={addDestination} />
      <MapView destinations={destinations} />
      <SummaryView destinations={destinations} />
      <DestinationList destinations={destinations} updateStatus={updateStatus} />
    </div>
  );
}
