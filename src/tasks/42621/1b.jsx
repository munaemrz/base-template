import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Placeholder for Shadcn components
const Button = ({ children, ...props }) => (
  <button
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    {...props}
  >
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input
    className="border border-gray-300 rounded px-3 py-2 w-full"
    {...props}
  />
);

const Select = ({ children, ...props }) => (
  <select
    className="border border-gray-300 rounded px-3 py-2 w-full"
    {...props}
  >
    {children}
  </select>
);

const Card = ({ children, ...props }) => (
  <div
    className="bg-white shadow-md rounded-lg p-4 mb-4"
    {...props}
  >
    {children}
  </div>
);

// Sub-components
const AddDestinationForm = ({ onAddDestination }) => {
  const [destination, setDestination] = useState({
    location: "",
    travelDate: "",
    activities: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDestination(destination);
    setDestination({ location: "", travelDate: "", activities: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h2 className="text-xl font-bold mb-4">Add Destination</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Location"
          value={destination.location}
          onChange={(e) =>
            setDestination({ ...destination, location: e.target.value })
          }
          required
        />
        <Input
          type="date"
          value={destination.travelDate}
          onChange={(e) =>
            setDestination({ ...destination, travelDate: e.target.value })
          }
          required
        />
        <Input
          type="text"
          placeholder="Activities (comma-separated)"
          value={destination.activities}
          onChange={(e) =>
            setDestination({ ...destination, activities: e.target.value })
          }
          required
        />
        <Button type="submit">Add Destination</Button>
      </div>
    </form>
  );
};

const DestinationList = ({ destinations }) => {
  const categorizeDestinations = () => {
    const now = new Date();
    return destinations.reduce(
      (acc, dest) => {
        const travelDate = new Date(dest.travelDate);
        if (travelDate > now) {
          acc.upcoming.push(dest);
        } else if (
          travelDate.toDateString() === now.toDateString()
        ) {
          acc.ongoing.push(dest);
        } else {
          acc.completed.push(dest);
        }
        return acc;
      },
      { upcoming: [], ongoing: [], completed: [] }
    );
  };

  const { upcoming, ongoing, completed } = categorizeDestinations();

  const renderDestinations = (category, title) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {category.map((dest, index) => (
        <Card key={index}>
          <h4 className="font-bold">{dest.location}</h4>
          <p>Date: {dest.travelDate}</p>
          <p>Activities: {dest.activities}</p>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Destinations</h2>
      {renderDestinations(upcoming, "Upcoming Trips")}
      {renderDestinations(ongoing, "Ongoing Trips")}
      {renderDestinations(completed, "Completed Trips")}
    </div>
  );
};

const MapView = ({ destinations }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Map View</h2>
      <div className="bg-gray-200 h-64 flex items-center justify-center">
        <p className="text-gray-600">
          Map placeholder with {destinations.length} pinned
          destination(s)
        </p>
      </div>
    </div>
  );
};

const TripSummary = ({ destinations }) => {
  const totalDays = destinations.reduce((sum, dest) => sum + 1, 0);
  const allActivities = destinations
    .flatMap((dest) => dest.activities.split(","))
    .map((activity) => activity.trim())
    .filter((activity, index, self) => self.indexOf(activity) === index);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Trip Summary</h2>
      <Card>
        <p>Total number of trips: {destinations.length}</p>
        <p>Total number of days: {totalDays}</p>
        <p>Key activities planned:</p>
        <ul className="list-disc pl-5">
          {allActivities.slice(0, 5).map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default function App() {
  const [destinations, setDestinations] = useState([]);

  const handleAddDestination = (newDestination) => {
    setDestinations([...destinations, newDestination]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Travel Itinerary Manager
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <AddDestinationForm onAddDestination={handleAddDestination} />
          <MapView destinations={destinations} />
        </div>
        <div>
          <TripSummary destinations={destinations} />
          <DestinationList destinations={destinations} />
        </div>
      </div>
    </div>
  );
}