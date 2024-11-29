import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from "@material-tailwind/react";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const ActivityForm = ({ onSubmit, onCancel, activity = {} }) => {
  const [formData, setFormData] = useState({...activity, date: activity.date || new Date().toISOString().split('T')[0]});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="sm:w-96">
      <CardHeader color="blue-gray" className="mb-4">
        <h2 className="text-xl">{activity.id ? 'Edit Activity' : 'Add Activity'}</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={(e) => {e.preventDefault(); onSubmit(formData);}}>
          <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
          <Input label="Date" type="date" name="date" value={formData.date} onChange={handleChange} required />
          <Input label="Time" type="time" name="time" value={formData.time} onChange={handleChange} required />
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} required />
          <Input label="Participants Needed" type="number" name="participantsNeeded" value={formData.participantsNeeded} onChange={handleChange} required />
          <div className="mt-4 flex justify-end">
            <Button type="submit" color="blue">Save</Button>
            <Button onClick={onCancel} color="red" className="ml-2">Cancel</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

const ActivityItem = ({ activity, onEdit, onDelete }) => (
  <Card className="mb-4">
    <CardBody>
      <h3>{activity.title}</h3>
      <p>{formatDate(activity.date)} at {activity.time}</p>
      <p>{activity.location}</p>
      <p>{activity.participantsFilled}/{activity.participantsNeeded} Participants</p>
      <div style={{width: `${(activity.participantsFilled / activity.participantsNeeded) * 100}%`, height: '10px', backgroundColor: 'green'}}></div>
    </CardBody>
    <CardFooter className="pt-0">
      <Button onClick={() => onEdit(activity)}>Edit</Button>
      <Button color="red" onClick={() => onDelete(activity.id)} className="ml-2">Delete</Button>
    </CardFooter>
  </Card>
);

const CalendarView = ({ activities }) => {
  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const days = Array.from({length: daysInMonth(currentMonth + 1, currentYear)}, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
      {days.map(day => {
        const dayActivities = activities.filter(a => new Date(a.date).getDate() === day && new Date(a.date).getMonth() === currentMonth);
        return (
          <div key={day} className="border p-2 min-h-[100px]">
            <div>{day}</div>
            {dayActivities.map(act => <div key={act.id}>{act.title}</div>)}
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');
    setActivities(savedActivities);
  }, []);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity) => {
    if (activity.id) {
      setActivities(activities.map(a => a.id === activity.id ? { ...activity, participantsFilled: a.participantsFilled } : a));
    } else {
      setActivities([...activities, { ...activity, id: Date.now(), participantsFilled: 0 }]);
    }
    setShowForm(false);
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const totalHours = activities.reduce((acc, curr) => acc + (curr.participantsNeeded * 2), 0); // Assuming 2 hours per activity

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-4">Volunteer Planner</h1>
      {showForm ? 
        <ActivityForm onSubmit={addActivity} onCancel={() => {setShowForm(false); setEditingActivity(null);}} activity={editingActivity} /> 
        :
        <>
          <Button onClick={() => {setShowForm(true); setEditingActivity(null);}}>Add Activity</Button>
          <div className="mt-4">
            <h2 className="text-2xl">Dashboard</h2>
            <p>Total Hours Volunteered: {totalHours} hours</p>
            <h2 className="text-2xl mt-2">Upcoming Activities</h2>
            {activities.map(activity => <ActivityItem key={activity.id} activity={activity} onEdit={setEditingActivity} onDelete={deleteActivity} />)}
            <h2 className="text-2xl mt-2">Calendar</h2>
            <CalendarView activities={activities} />
          </div>
        </>
      }
    </div>
  );
}