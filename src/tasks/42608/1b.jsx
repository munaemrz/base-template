import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Card, CardHeader, CardBody, CardFooter, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@shadcn/ui";

function App() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      checkFeedingTimes();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [pets]);

  const checkFeedingTimes = () => {
    const now = new Date();
    const overduePets = pets.filter(pet => {
      const [hour, minute] = pet.feedingSchedule.split(':');
      const feedingTime = new Date(now);
      feedingTime.setHours(hour, minute, 0);
      return feedingTime <= now && !pet.fedToday;
    });

    if (overduePets.length > 0) {
      setNotification(`Time to feed ${overduePets.map(p => p.name).join(', ')}!`);
    } else {
      setNotification(null);
    }
  };

  const addPet = (newPet) => {
    setPets([...pets, { ...newPet, fedToday: false, id: Date.now() }]);
  };

  const updatePet = (updatedPet) => {
    setPets(pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet));
    setSelectedPet(null);
  };

  const deletePet = (id) => {
    setPets(pets.filter(pet => pet.id !== id));
  };

  const feedingTimes = pets.map(pet => pet.feedingSchedule);
  const mostFrequentFeedingTime = feedingTimes.sort((a, b) =>
    feedingTimes.filter(v => v === a).length - feedingTimes.filter(v => v === b).length
  ).pop();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Pet Care Manager</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PetForm onSubmit={selectedPet ? updatePet : addPet} selectedPet={selectedPet} onCancel={() => setSelectedPet(null)} />
        <div>
          <DailySchedule pets={pets} />
          <Summary pets={pets} mostFrequentTime={mostFrequentFeedingTime} />
          {notification && <div className="mt-4 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">{notification}</div>}
        </div>
      </div>
      <PetList pets={pets} onSelect={setSelectedPet} onDelete={deletePet} />
    </div>
  );
}

function PetForm({ onSubmit, selectedPet, onCancel }) {
  const [pet, setPet] = useState(selectedPet || { name: '', type: '', age: '', feedingSchedule: '08:00' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(pet);
    setPet({ name: '', type: '', age: '', feedingSchedule: '08:00' });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium">{selectedPet ? 'Edit Pet' : 'Add New Pet'}</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={pet.name} onChange={e => setPet({...pet, name: e.target.value})} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={pet.type} onChange={e => setPet({...pet, type: e.target.value})} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" value={pet.age} onChange={e => setPet({...pet, age: e.target.value})} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="feedingSchedule">Feeding Schedule</Label>
            <Input id="feedingSchedule" type="time" value={pet.feedingSchedule} onChange={e => setPet({...pet, feedingSchedule: e.target.value})} required />
          </div>
          <Button type="submit">{selectedPet ? 'Update' : 'Add'} Pet</Button>
          {selectedPet && <Button className="ml-2" variant="secondary" onClick={onCancel}>Cancel</Button>}
        </form>
      </CardBody>
    </Card>
  );
}

function DailySchedule({ pets }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium">Daily Schedule</h2>
      </CardHeader>
      <CardBody>
        {pets.map(pet => (
          <div key={pet.id} className="mb-2">
            <span>{pet.name}: {pet.feedingSchedule}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function Summary({ pets, mostFrequentTime }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-lg font-medium">Summary</h2>
      </CardHeader>
      <CardBody>
        <p>Total Pets: {pets.length}</p>
        <p>Most Frequent Feeding Time: {mostFrequentTime || 'N/A'}</p>
      </CardBody>
    </Card>
  );
}

function PetList({ pets, onSelect, onDelete }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-lg font-medium">Pets</h2>
      </CardHeader>
      <CardBody>
        {pets.map(pet => (
          <div key={pet.id} className="flex justify-between items-center mb-2">
            <span>{pet.name} ({pet.type})</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onSelect(pet)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(pet.id)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

export default App;