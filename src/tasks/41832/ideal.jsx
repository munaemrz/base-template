import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Form for adding/editing activities
const ActivityForm = ({ onSave, onCancel, activity }) => {
  const [formData, setFormData] = useState(
    activity || { title: "", date: "", time: "", location: "", participants: 0, slotsFilled: 0 }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: activity?.id || Date.now() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Activity Title"
        required
      />
      <Input
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <Input
        name="time"
        type="time"
        value={formData.time}
        onChange={handleChange}
        required
      />
      <Input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        required
      />
      <Input
        name="participants"
        type="number"
        value={formData.participants}
        onChange={handleChange}
        placeholder="Participants Needed"
        min="1"
        required
      />
      <Input
        name="slotsFilled"
        type="number"
        value={formData.slotsFilled}
        onChange={handleChange}
        placeholder="Slots Filled"
        min="0"
        max={formData.participants}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

// Dashboard component
const Dashboard = ({ activities }) => {
  const totalHours = activities.length * 2; // Assuming each activity is 2 hours
  const upcomingActivities = activities.filter(
    (activity) => new Date(activity.date) > new Date()
  );

  return (
    <Card className="mb-4">
      <CardTitle>Dashboard</CardTitle>
      <CardContent>
        <p>Total Hours Volunteered: {totalHours}</p>
        <p>Upcoming Activities: {upcomingActivities.length}</p>
      </CardContent>
    </Card>
  );
};

// Progress tracker component
const ProgressTracker = ({ activity }) => {
  const progress = (activity.slotsFilled / activity.participants) * 100;

  return (
    <div className="mb-2">
      <p>{activity.title}</p>
      <Progress value={progress} />
      <p className="text-sm">
        {activity.slotsFilled}/{activity.participants} slots filled
      </p>
    </div>
  );
};

// Monthly calendar view
const CalendarView = ({ activities }) => {
  const groupedByDate = activities.reduce((acc, activity) => {
    acc[activity.date] = acc[activity.date] || [];
    acc[activity.date].push(activity);
    return acc;
  }, {});

  const daysInMonth = Array.from(
    { length: 31 },
    (_, i) => new Date(new Date().getFullYear(), new Date().getMonth(), i + 1)
  );

  return (
    <Card className="mb-4">
      <CardTitle>Monthly Calendar</CardTitle>
      <CardContent className="grid grid-cols-7 gap-4">
        {daysInMonth.map((date) => {
          const dateStr = date.toISOString().split("T")[0];
          return (
            <div key={dateStr} className="border p-2">
              <p className="font-bold">{date.getDate()}</p>
              {groupedByDate[dateStr]?.map((activity) => (
                <p key={activity.id} className="text-sm">
                  {activity.title}
                </p>
              ))}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

// Main App component
export default function App() {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);

  const handleSave = (activity) => {
    setActivities((prevActivities) =>
      activity.id
        ? prevActivities.map((a) => (a.id === activity.id ? activity : a))
        : [...prevActivities, activity]
    );
    setEditingActivity(null);
  };

  const handleDelete = (id) => {
    setActivities((prevActivities) => prevActivities.filter((a) => a.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Volunteer Activity Planner</h1>
      {editingActivity && (
        <Card className="mb-4">
          <CardContent>
            <ActivityForm
              activity={editingActivity}
              onSave={handleSave}
              onCancel={() => setEditingActivity(null)}
            />
          </CardContent>
        </Card>
      )}
      <Button
        className="mb-4"
        onClick={() =>
          setEditingActivity({
            title: "",
            date: "",
            time: "",
            location: "",
            participants: 0,
            slotsFilled: 0,
          })
        }
      >
        Add New Activity
      </Button>
      <Dashboard activities={activities} />
      <CalendarView activities={activities} />
      <Card className="mb-4">
        <CardTitle>Activity Progress</CardTitle>
        <CardContent>
          {activities.map((activity) => (
            <ProgressTracker key={activity.id} activity={activity} />
          ))}
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardTitle>All Activities</CardTitle>
        <CardContent>
          {activities.map((activity) => (
            <div key={activity.id} className="flex justify-between mb-2">
              <span>
                {activity.title} - {activity.date} at {activity.time}
              </span>
              <div>
                <Button
                  size="sm"
                  onClick={() => setEditingActivity(activity)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(activity.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
