import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Form for adding and editing plants
const PlantForm = ({ plant, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    plant || { name: "", type: "", schedule: "", lastWatered: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.type && formData.schedule && formData.lastWatered) {
      onSave({ ...formData });
      setFormData({ name: "", type: "", schedule: "", lastWatered: "" }); // Reset form after save
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Plant Name"
        required
      />
      <Input
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Plant Type"
        required
      />
      <Input
        name="schedule"
        type="number"
        value={formData.schedule}
        onChange={handleChange}
        placeholder="Watering Schedule (days)"
        required
      />
      <Input
        name="lastWatered"
        type="date"
        value={formData.lastWatered}
        onChange={handleChange}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

// Calendar view showing watering schedules
const CalendarView = ({ plants }) => (
  <Card className="mb-4">
    <h2 className="font-semibold mb-2">Watering Schedule</h2>
    {plants.length > 0 ? (
      <ul className="space-y-2">
        {plants.map((plant) => (
          <li key={plant.id}>
            {plant.name} ({plant.type}) - Water every {plant.schedule} days
          </li>
        ))}
      </ul>
    ) : (
      <p>No plants added yet.</p>
    )}
  </Card>
);

// Summary section
const Summary = ({ plants }) => {
  const totalPlants = plants.length;
  const wateringFrequency = plants.reduce((acc, plant) => {
    acc[plant.schedule] = (acc[plant.schedule] || 0) + 1;
    return acc;
  }, {});
  const mostCommonSchedule = Object.entries(wateringFrequency).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "N/A";

  return (
    <Card className="mb-4">
      <h2 className="font-semibold mb-2">Summary</h2>
      <p>Total Plants: {totalPlants}</p>
      <p>Most Common Watering Frequency: {mostCommonSchedule} days</p>
    </Card>
  );
};

// Notification tracker for overdue watering
const NotificationTracker = ({ plants }) => {
  const overduePlants = plants.filter((plant) => {
    const lastWatered = new Date(plant.lastWatered);
    const nextWatering = new Date(
      lastWatered.getTime() + plant.schedule * 24 * 60 * 60 * 1000
    );
    return nextWatering < new Date();
  });

  return (
    <Card className="mb-4">
      <h2 className="font-semibold mb-2">Overdue Watering Tasks</h2>
      {overduePlants.length > 0 ? (
        <ul>
          {overduePlants.map((plant) => (
            <li key={plant.id}>
              {plant.name} ({plant.type}) - Last watered on {plant.lastWatered}
            </li>
          ))}
        </ul>
      ) : (
        <p>No overdue watering tasks.</p>
      )}
    </Card>
  );
};

// Main App component
export default function App() {
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);

  const handleSave = (plant) => {
    setPlants((prevPlants) =>
      plant.id
        ? prevPlants.map((p) => (p.id === plant.id ? plant : p))
        : [...prevPlants, plant]
    );
    setEditingPlant(null);
  };

  const handleDelete = (id) => {
    setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Garden Maintenance Planner</h1>
      {editingPlant ? (
        <Card className="mb-4">
          <PlantForm
            plant={editingPlant}
            onSave={handleSave}
            onCancel={() => setEditingPlant(null)}
          />
        </Card>
      ) : (
        <Button
          className="mb-4"
          onClick={() =>
            setEditingPlant({ name: "", type: "", schedule: "", lastWatered: "" })
          }
        >
          Add New Plant
        </Button>
      )}
      <Summary plants={plants} />
      <CalendarView plants={plants} />
      <NotificationTracker plants={plants} />
      {plants.map((plant) => (
        <Card key={plant.id} className="mb-2">
          <div className="flex justify-between">
            <span>
              {plant.name} ({plant.type}) - Last watered on {plant.lastWatered}
            </span>
            <div>
              <Button size="sm" onClick={() => setEditingPlant(plant)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(plant.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
