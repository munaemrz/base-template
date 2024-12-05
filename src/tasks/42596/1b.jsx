import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem } from "@/components/ui";

const statuses = ["Not Started", "In Progress", "Completed"];

function TaskForm({ onSubmit, members }) {
  const [task, setTask] = useState({ name: '', description: '', deadline: '', assignee: members[0] || '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    setTask({ name: '', description: '', deadline: '', assignee: members[0] || '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        type="text" 
        placeholder="Task Name" 
        value={task.name} 
        onChange={(e) => setTask({...task, name: e.target.value})} 
        required 
      />
      <Input 
        type="text" 
        placeholder="Description" 
        value={task.description} 
        onChange={(e) => setTask({...task, description: e.target.value})} 
      />
      <Input 
        type="date" 
        value={task.deadline} 
        onChange={(e) => setTask({...task, deadline: e.target.value})} 
        required 
      />
      <Select value={task.assignee} onChange={(value) => setTask({...task, assignee: value})}>
        {members.map(member => <SelectItem key={member} value={member}>{member}</SelectItem>)}
      </Select>
      <Button type="submit">Add Task</Button>
    </form>
  );
}

function TaskItem({ task, onStatusChange, onDelete }) {
  const timeLeft = () => {
    const diff = new Date(task.deadline) - new Date();
    if (diff < 0) return "Overdue";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <div>
        <h3 className="font-bold">{task.name}</h3>
        <p>{task.description}</p>
        <p>Deadline: {task.deadline} - {timeLeft()}</p>
        <p>Assignee: {task.assignee}</p>
      </div>
      <div className="space-x-2">
        <Select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value)}>
          {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
        </Select>
        <Button onClick={() => onDelete(task.id)} variant="destructive">Delete</Button>
      </div>
    </div>
  );
}

function TaskList({ tasks, onStatusChange, onDelete, filter }) {
  const filteredTasks = tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.assignee && task.assignee !== filter.assignee) return false;
    if (filter.urgency && new Date(task.deadline) > new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {filteredTasks.map(task => (
        <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState(['Alice', 'Bob', 'Charlie']);
  const [filter, setFilter] = useState({ status: '', assignee: '', urgency: false });

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(tasks.map(task => ({...task})));
    }, 1000);
    return () => clearInterval(timer);
  }, [tasks]);

  const addTask = (task) => {
    setTasks([...tasks, { id: Date.now(), status: statuses[0], ...task }]);
  };

  const handleStatusChange = (id, status) => {
    setTasks(tasks.map(task => task.id === id ? {...task, status} : task));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Task Assignment Tracker</h1>
      <TaskForm onSubmit={addTask} members={members} />
      <div className="mt-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <Select onValueChange={(value) => setFilter({...filter, status: value})}>
            <SelectItem value="">All Statuses</SelectItem>
            {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
          </Select>
          <Select onValueChange={(value) => setFilter({...filter, assignee: value})}>
            <SelectItem value="">All Members</SelectItem>
            {members.map(member => <SelectItem key={member} value={member}>{member}</SelectItem>)}
          </Select>
          <Button onClick={() => setFilter({...filter, urgency: !filter.urgency})}>
            {filter.urgency ? 'Show All' : 'Urgent Tasks'}
          </Button>
        </div>
        <TaskList tasks={tasks} onStatusChange={handleStatusChange} onDelete={handleDelete} filter={filter} />
      </div>
    </div>
  );
}