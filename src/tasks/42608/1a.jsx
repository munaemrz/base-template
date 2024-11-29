import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Shadcn components (simplified versions)
const Button = ({ className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
      className
    )}
    {...props}
  />
);

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

const Select = ({ className, ...props }) => (
  <select
    className={cn(
      "px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
);

// Pet profile component
const PetProfile = ({ pet, onEdit, onDelete }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-4">
    <h3 className="text-lg font-semibold">{pet.name}</h3>
    <p>Type: {pet.type}</p>
    <p>Age: {pet.age}</p>
    <p>Feeding Time: {pet.feedingTime}</p>
    <div className="mt-2">
      <Button onClick={() => onEdit(pet)} className="mr-2">
        Edit
      </Button>
      <Button onClick={() => onDelete(pet.id)} className="bg-red-500 hover:bg-red-600">
        Delete
      </Button>
    </div>
  </div>
);

// Pet form component
const PetForm = ({ pet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(pet || {
    name: "",
    type: "",
    age: "",
    feedingTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Pet Name"
        className="mb-2 w-full"
        required
      />
      <Input
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Pet Type"
        className="mb-2 w-full"
        required
      />
      <Input
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Pet Age"
        type="number"
        className="mb-2 w-full"
        required
      />
      <Input
        name="feedingTime"
        value={formData.feedingTime}
        onChange={handleChange}
        placeholder="Feeding Time (HH:MM)"
        type="time"
        className="mb-2 w-full"
        required
      />
      <Button type="submit" className="mr-2">
        {pet ? "Update" : "Add"} Pet
      </Button>
      <Button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">
        Cancel
      </Button>
    </form>
  );
};

// Daily schedule component
const DailySchedule = ({ pets }) => {
  const sortedPets = [...pets].sort((a, b) => a.feedingTime.localeCompare(b.feedingTime));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Daily Feeding Schedule</h2>
      {sortedPets.map((pet) => (
        <div key={pet.id} className="mb-2">
          <span className="font-semibold">{pet.feedingTime}</span> - {pet.name} ({pet.type})
        </div>
      ))}
    </div>
  );
};

// Summary component
const Summary = ({ pets }) => {
  const totalPets = pets.length;
  const mostFrequentTime = pets.reduce((acc, pet) => {
    acc[pet.feedingTime] = (acc[pet.feedingTime] || 0) + 1;
    return acc;
  }, {});
  const maxTime = Object.entries(mostFrequentTime).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    ["", 0]
  )[0];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <p>Total Pets: {totalPets}</p>
      <p>Most Frequent Feeding Time: {maxTime || "N/A"}</p>
    </div>
  );
};

// Notification tracker component
const NotificationTracker = ({ pets }) => {
  const [overduePets, setOverduePets] = useState([]);

  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const overdue = pets.filter((pet) => pet.feedingTime < currentTime);
      setOverduePets(overdue);
    };

    checkOverdue();
    const interval = setInterval(checkOverdue, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [pets]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Overdue Feedings</h2>
      {overduePets.length === 0 ? (
        <p>No overdue feedings</p>
      ) : (
        <ul>
          {overduePets.map((pet) => (
            <li key={pet.id} className="text-red-500">
              {pet.name} - {pet.feedingTime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main App component
export default function App() {
  const [pets, setPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);

  const addPet = (pet) => {
    setPets([...pets, { ...pet, id: Date.now() }]);
    setEditingPet(null);
  };

  const updatePet = (updatedPet) => {
    setPets(pets.map((p) => (p.id === updatedPet.id ? updatedPet : p)));
    setEditingPet(null);
  };

  const deletePet = (id) => {
    setPets(pets.filter((p) => p.id !== id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Pet Care Manager</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pet Profiles</h2>
          {editingPet ? (
            <PetForm
              pet={editingPet}
              onSubmit={updatePet}
              onCancel={() => setEditingPet(null)}
            />
          ) : (
            <PetForm onSubmit={addPet} onCancel={() => {}} />
          )}
          {pets.map((pet) => (
            <PetProfile
              key={pet.id}
              pet={pet}
              onEdit={setEditingPet}
              onDelete={deletePet}
            />
          ))}
        </div>
        <div>
          <Summary pets={pets} />
          <NotificationTracker pets={pets} />
          <DailySchedule pets={pets} />
        </div>
      </div>
    </div>
  );
}