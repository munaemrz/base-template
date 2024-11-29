// App.jsx
import React, { useState, useEffect } from 'react';
import { format, isPast } from 'date-fns';
import { Button, Input, Dialog, Card, CardContent, CardHeader } from '@shadcn/ui';

function App() {
  const [plants, setPlants] = useState([]);
  const [open, setOpen] = useState(false);
  const [editPlant, setEditPlant] = useState(null);

  const addPlant = (newPlant) => {
    setPlants([...plants, { ...newPlant, id: Date.now() }]);
    setOpen(false);
  };

  const updatePlant = (updatedPlant) => {
    setPlants(plants.map(plant => plant.id === updatedPlant.id ? updatedPlant : plant));
    setEditPlant(null);
    setOpen(false);
  };

  const deletePlant = (id) => {
    setPlants(plants.filter(plant => plant.id !== id));
  };

  const mostCommonWatering = () => {
    const frequencies = plants.map(p => p.wateringSchedule);
    return frequencies.sort((a, b) => 
      frequencies.filter(v => v === a).length - frequencies.filter(v => v === b).length
    ).pop();
  };

  const overduePlants = plants.filter(plant => 
    isPast(new Date(plant.lastWatered + plant.wateringSchedule * 86400000))
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Garden Maintenance Planner</h1>
      
      <Button onClick={() => {setOpen(true); setEditPlant(null);}} className="mb-4">Add Plant</Button>

      {/* Plant Summary */}
      <div className="mb-4">
        <p>Total Plants: {plants.length}</p>
        <p>Most Common Watering Frequency: {mostCommonWatering() || 'N/A'} days</p>
      </div>

      {/* Calendar View - Simplified for this example */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Watering Calendar</h2>
        {plants.map(plant => (
          <p key={plant.id}>{plant.name}: Water every {plant.wateringSchedule} days</p>
        ))}
      </div>

      {/* Overdue Notifications */}
      <div>
        <h2 className="text-lg font-semibold">Overdue Watering</h2>
        {overduePlants.length > 0 ? 
          overduePlants.map(plant => (
            <p key={plant.id} className="text-red-500">{plant.name} is overdue!</p>
          )) : 
          <p>All plants are up to date!</p>
        }
      </div>

      {/* Plant List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plants.map(plant => (
          <Card key={plant.id}>
            <CardHeader>
              <h3>{plant.name}</h3>
            </CardHeader>
            <CardContent>
              <p>Type: {plant.type}</p>
              <p>Water every: {plant.wateringSchedule} days</p>
              <p>Last Watered: {format(new Date(plant.lastWatered), 'PP')}</p>
              <Button onClick={() => {setEditPlant(plant); setOpen(true);}} className="mt-2 mr-2">Edit</Button>
              <Button onClick={() => deletePlant(plant.id)} variant="destructive">Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for Adding/Editing Plant */}
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{editPlant ? 'Edit Plant' : 'Add New Plant'}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <PlantForm onSubmit={editPlant ? updatePlant : addPlant} initialValues={editPlant} />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

function PlantForm({ onSubmit, initialValues = { name: '', type: '', wateringSchedule: '', lastWatered: Date.now() } }) {
  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => {e.preventDefault(); onSubmit(form);}}>
      <Input name="name" value={form.name} onChange={handleChange} placeholder="Plant Name" required className="mb-2" />
      <Input name="type" value={form.type} onChange={handleChange} placeholder="Type" required className="mb-2" />
      <Input type="number" name="wateringSchedule" value={form.wateringSchedule} onChange={handleChange} placeholder="Watering Schedule (days)" required className="mb-2" />
      <Button type="submit">Save</Button>
    </form>
  );
}

export default App;