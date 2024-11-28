import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Tabs, Tab } from "@shadcn/ui";

function App() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ location: '', date: '', activities: '' });

  const addTrip = () => {
    if (newTrip.location && newTrip.date) {
      setTrips([...trips, { ...newTrip, status: 'upcoming' }]);
      setNewTrip({ location: '', date: '', activities: '' });
    }
  };

  const moveTripStatus = (index, status) => {
    const updatedTrips = [...trips];
    updatedTrips[index].status = status;
    setTrips(updatedTrips);
  };

  const TripCard = ({ trip, index }) => (
    <Card className="mb-4">
      <CardHeader>
        <h3>{trip.location}</h3>
        <p>{trip.date}</p>
      </CardHeader>
      <CardBody>{trip.activities}</CardBody>
      <CardFooter>
        {trip.status !== 'completed' && (
          <Button onClick={() => moveTripStatus(index, 'completed')}>Trip Completed</Button>
        )}
        {trip.status === 'upcoming' && (
          <Button onClick={() => moveTripStatus(index, 'ongoing')}>Trip Started</Button>
        )}
      </CardFooter>
    </Card>
  );

  const SummaryView = () => {
    const totalDays = trips.reduce((acc, trip) => acc + (new Date(trip.date).getDays() || 1), 0);
    return (
      <div>
        <h2>Summary</h2>
        <p>Total Days: {totalDays}</p>
        <p>Key Activities: {trips.map(t => t.activities).join(', ')}</p>
      </div>
    );
  };

  const MapView = () => (
    <div className="h-64 bg-gray-200 flex items-center justify-center">
      <span>Map Placeholder</span>
    </div>
  );

  return (
    <div className="p-4 max-w-lg mx-auto sm:px-6 lg:px-8">
      <Tabs defaultValue="add" className="w-full mb-4">
        <TabsList>
          <Tab value="add">Add Trip</Tab>
          <Tab value="view">View Trips</Tab>
          <Tab value="map">Map</Tab>
          <Tab value="summary">Summary</Tab>
        </TabsList>

        <TabsContent value="add">
          <Input 
            placeholder="Destination" 
            value={newTrip.location} 
            onChange={e => setNewTrip({...newTrip, location: e.target.value})} 
          />
          <Input 
            type="date" 
            value={newTrip.date} 
            onChange={e => setNewTrip({...newTrip, date: e.target.value})} 
            className="mt-2"
          />
          <Input 
            placeholder="Activities" 
            value={newTrip.activities} 
            onChange={e => setNewTrip({...newTrip, activities: e.target.value})} 
            className="mt-2"
          />
          <Button onClick={addTrip} className="mt-4 w-full">Add Trip</Button>
        </TabsContent>

        <TabsContent value="view">
          <Tabs defaultValue="upcoming">
            <TabsList>
              <Tab value="upcoming">Upcoming</Tab>
              <Tab value="ongoing">Ongoing</Tab>
              <Tab value="completed">Completed</Tab>
            </TabsList>
            {['upcoming', 'ongoing', 'completed'].map(status => (
              <TabsContent value={status}>
                {trips.filter(t => t.status === status).map((trip, index) => (
                  <TripCard key={index} trip={trip} index={index} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="map">
          <MapView />
        </TabsContent>

        <TabsContent value="summary">
          <SummaryView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;