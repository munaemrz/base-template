import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plantTypes = ["Flower", "Vegetable", "Herb", "Tree", "Shrub"];
const wateringFrequencies = ["Daily", "Every 2 days", "Weekly", "Bi-weekly", "Monthly"];

function PlantForm({ onSubmit, initialData }) {
  const [plant, setPlant] = useState(initialData || { name: "", type: "", wateringSchedule: "", lastWatered: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(plant);
    setPlant({ name: "", type: "", wateringSchedule: "", lastWatered: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Plant Name"
        value={plant.name}
        onChange={(e) => setPlant({ ...plant, name: e.target.value })}
        required
      />
      <Select
        value={plant.type}
        onValueChange={(value) => setPlant({ ...plant, type: value })}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Plant Type" />
        </SelectTrigger>
        <SelectContent>
          {plantTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={plant.wateringSchedule}
        onValueChange={(value) => setPlant({ ...plant, wateringSchedule: value })}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Watering Schedule" />
        </SelectTrigger>
        <SelectContent>
          {wateringFrequencies.map((freq) => (
            <SelectItem key={freq} value={freq}>
              {freq}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={plant.lastWatered}
        onChange={(e) => setPlant({ ...plant, lastWatered: e.target.value })}
        required
      />
      <Button type="submit">{initialData ? "Update" : "Add"} Plant</Button>
    </form>
  );
}

function PlantList({ plants, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {plants.map((plant) => (
        <Card key={plant.id}>
          <CardHeader>
            <CardTitle>{plant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Type: {plant.type}</p>
            <p>Watering Schedule: {plant.wateringSchedule}</p>
            <p>Last Watered: {plant.lastWatered}</p>
            <div className="mt-2 space-x-2">
              <Button onClick={() => onEdit(plant)}>Edit</Button>
              <Button variant="destructive" onClick={() => onDelete(plant.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CalendarView({ plants }) {
  const [date, setDate] = useState(new Date());

  const getWateringDates = () => {
    const dates = {};
    plants.forEach((plant) => {
      const lastWatered = new Date(plant.lastWatered);
      let nextWatering = new Date(lastWatered);
      switch (plant.wateringSchedule) {
        case "Daily":
          nextWatering.setDate(lastWatered.getDate() + 1);
          break;
        case "Every 2 days":
          nextWatering.setDate(lastWatered.getDate() + 2);
          break;
        case "Weekly":
          nextWatering.setDate(lastWatered.getDate() + 7);
          break;
        case "Bi-weekly":
          nextWatering.setDate(lastWatered.getDate() + 14);
          break;
        case "Monthly":
          nextWatering.setMonth(lastWatered.getMonth() + 1);
          break;
      }
      const dateKey = nextWatering.toISOString().split("T")[0];
      if (!dates[dateKey]) dates[dateKey] = [];
      dates[dateKey].push(plant.name);
    });
    return dates;
  };

  const wateringDates = getWateringDates();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      components={{
        Day: ({ day, ...props }) => {
          const dateKey = day.toISOString().split("T")[0];
          const plantsToWater = wateringDates[dateKey];
          return (
            <div {...props}>
              {day.getDate()}
              {plantsToWater && (
                <div className="absolute bottom-0 right-0">
                  <Badge variant="secondary" className="text-xs">
                    {plantsToWater.length}
                  </Badge>
                </div>
              )}
            </div>
          );
        },
      }}
    />
  );
}

function Summary({ plants }) {
  const totalPlants = plants.length;
  const frequencyCount = plants.reduce((acc, plant) => {
    acc[plant.wateringSchedule] = (acc[plant.wateringSchedule] || 0) + 1;
    return acc;
  }, {});
  const mostCommonFrequency = Object.entries(frequencyCount).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    ["", 0]
  )[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Plants: {totalPlants}</p>
        <p>Most Common Watering Frequency: {mostCommonFrequency}</p>
      </CardContent>
    </Card>
  );
}

function NotificationTracker({ plants }) {
  const overduePlants = plants.filter((plant) => {
    const lastWatered = new Date(plant.lastWatered);
    const today = new Date();
    const daysSinceWatered = Math.floor((today - lastWatered) / (1000 * 60 * 60 * 24));
    switch (plant.wateringSchedule) {
      case "Daily":
        return daysSinceWatered > 1;
      case "Every 2 days":
        return daysSinceWatered > 2;
      case "Weekly":
        return daysSinceWatered > 7;
      case "Bi-weekly":
        return daysSinceWatered > 14;
      case "Monthly":
        return daysSinceWatered > 30;
      default:
        return false;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overdue Watering Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {overduePlants.length > 0 ? (
          <ul className="list-disc pl-5">
            {overduePlants.map((plant) => (
              <li key={plant.id}>{plant.name}</li>
            ))}
          </ul>
        ) : (
          <p>No overdue watering tasks</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);

  useEffect(() => {
    const storedPlants = localStorage.getItem("plants");
    if (storedPlants) {
      setPlants(JSON.parse(storedPlants));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("plants", JSON.stringify(plants));
  }, [plants]);

  const handleAddPlant = (newPlant) => {
    setPlants([...plants, { ...newPlant, id: Date.now() }]);
  };

  const handleEditPlant = (plant) => {
    setEditingPlant(plant);
  };

  const handleUpdatePlant = (updatedPlant) => {
    setPlants(plants.map((p) => (p.id === updatedPlant.id ? updatedPlant : p)));
    setEditingPlant(null);
  };

  const handleDeletePlant = (id) => {
    setPlants(plants.filter((p) => p.id !== id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Garden Maintenance Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {editingPlant ? "Edit Plant" : "Add New Plant"}
          </h2>
          <PlantForm
            onSubmit={editingPlant ? handleUpdatePlant : handleAddPlant}
            initialData={editingPlant}
          />
          <h2 className="text-2xl font-semibold mt-8 mb-4">Plant List</h2>
          <PlantList plants={plants} onEdit={handleEditPlant} onDelete={handleDeletePlant} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Watering Calendar</h2>
          <CalendarView plants={plants} />
          <div className="mt-8 space-y-6">
            <Summary plants={plants} />
            <NotificationTracker plants={plants} />
          </div>
        </div>
      </div>
    </div>
  );
}