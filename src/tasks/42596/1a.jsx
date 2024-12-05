import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Shadcn components (simplified versions)
const Button = ({ className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600",
      className
    )}
    {...props}
  />
);

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "border border-gray-300 rounded-md px-3 py-2 w-full",
      className
    )}
    {...props}
  />
);

const Select = ({ className, ...props }) => (
  <select
    className={cn(
      "border border-gray-300 rounded-md px-3 py-2 w-full",
      className
    )}
    {...props}
  />
);

// Task component
const Task = ({ task, updateTask, deleteTask }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const deadline = new Date(task.deadline);
      const diff = deadline - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Overdue");
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [task.deadline]);

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <h3 className="font-bold">{task.name}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-sm">Assignee: {task.assignee}</p>
      <p className="text-sm">Deadline: {task.deadline}</p>
      <p className="text-sm font-semibold">Time left: {timeLeft}</p>
      <Select
        value={task.status}
        onChange={(e) => updateTask({ ...task, status: e.target.value })}
        className="mt-2"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </Select>
      <Button onClick={() => deleteTask(task.id)} className="mt-2 bg-red-500 hover:bg-red-600">
        Delete
      </Button>
    </div>
  );
};

// Main App component
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    deadline: "",
    assignee: "",
    status: "Not Started",
  });
  const [filter, setFilter] = useState({
    assignee: "",
    status: "",
    urgency: "",
  });

  const addTask = () => {
    if (newTask.name && newTask.assignee && newTask.deadline) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({
        name: "",
        description: "",
        deadline: "",
        assignee: "",
        status: "Not Started",
      });
    }
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter.assignee && task.assignee !== filter.assignee) return false;
    if (filter.status && task.status !== filter.status) return false;
    if (filter.urgency) {
      const now = new Date();
      const deadline = new Date(task.deadline);
      const diff = deadline - now;
      const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (filter.urgency === "urgent" && daysLeft > 3) return false;
      if (filter.urgency === "upcoming" && (daysLeft <= 3 || daysLeft > 7)) return false;
      if (filter.urgency === "later" && daysLeft <= 7) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Task Assignment Tracker</h1>

      <div className="mb-6 bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <Input
            placeholder="Assignee"
            value={newTask.assignee}
            onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
          />
          <Input
            type="datetime-local"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </div>
        <Button onClick={addTask} className="mt-4">
          Add Task
        </Button>
      </div>

      <div className="mb-6 bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Filter by Assignee"
            value={filter.assignee}
            onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
          />
          <Select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
          <Select
            value={filter.urgency}
            onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
          >
            <option value="">All Urgencies</option>
            <option value="urgent">Urgent (3 days or less)</option>
            <option value="upcoming">Upcoming (4-7 days)</option>
            <option value="later">Later (more than 7 days)</option>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        {filteredTasks.map((task) => (
          <Task key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} />
        ))}
      </div>
    </div>
  );
}