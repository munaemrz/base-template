import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

const statuses = ["Not Started", "In Progress", "Completed"];

const TaskForm = ({ onAddTask, teamMembers }) => {
  const [task, setTask] = useState({
    name: "",
    description: "",
    deadline: "",
    assignee: teamMembers[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ ...task, status: "Not Started", id: Date.now() });
    setTask({ name: "", description: "", deadline: "", assignee: teamMembers[0] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Task Name"
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
        required
      />
      <Input
        type="text"
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <Input
        type="datetime-local"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
        required
      />
      <Select
        onValueChange={(value) => setTask({ ...task, assignee: value })}
        value={task.assignee}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Assignee" />
        </SelectTrigger>
        <SelectContent>
          {teamMembers.map((member) => (
            <SelectItem key={member} value={member}>
              {member}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Add Task</Button>
    </form>
  );
};

const TaskItem = ({ task, onStatusChange, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date(task.deadline);
      const diff = deadline - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        setTimeLeft("Overdue");
      }
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [task.deadline]);

  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <div>
        <h3 className="font-bold">{task.name}</h3>
        <p>{task.description}</p>
        <p>
          Deadline: {new Date(task.deadline).toLocaleString()} - {timeLeft}
        </p>
        <p>Assignee: {task.assignee}</p>
      </div>
      <div className="space-x-2">
        <Select
          onValueChange={(value) => onStatusChange(task.id, value)}
          value={task.status}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="destructive" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, filters, onStatusChange, onDelete }) => {
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesAssignee = !filters.assignee || task.assignee === filters.assignee;
    const isUrgent =
      filters.urgency &&
      new Date(task.deadline) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const matchesUrgency = !filters.urgency || isUrgent;

    return matchesStatus && matchesAssignee && matchesUrgency;
  });

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [teamMembers] = useState(["Alice", "Bob", "Charlie"]);
  const [filters, setFilters] = useState({ status: "", assignee: "", urgency: false });

  const addTask = (task) => setTasks((prev) => [...prev, task]);
  const updateStatus = (id, status) =>
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  const deleteTask = (id) => setTasks((prev) => prev.filter((task) => task.id !== id));

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Task Assignment Tracker</h1>
      <TaskForm onAddTask={addTask} teamMembers={teamMembers} />
      <div className="mt-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <Select
            onValueChange={(value) => setFilters((f) => ({ ...f, status: value }))}
            value={filters.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AllStatuses">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setFilters((f) => ({ ...f, assignee: value }))}
            value={filters.assignee}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AllAssignees">All Assignees</SelectItem>
              {teamMembers.map((member) => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setFilters((f) => ({ ...f, urgency: !f.urgency }))}>
            {filters.urgency ? "Show All" : "Urgent Tasks"}
          </Button>
        </div>
        <TaskList tasks={tasks} filters={filters} onStatusChange={updateStatus} onDelete={deleteTask} />
      </div>
    </div>
  );
}
