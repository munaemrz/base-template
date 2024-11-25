import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", deadline: "", completed: false });

  const addTask = () => {
    const taskDeadline = new Date(newTask.deadline);
    const isOverdue = taskDeadline < new Date();
    const status = newTask.completed
      ? "Completed"
      : isOverdue
      ? "Pending"
      : "In Progress";
    setTasks([...tasks, { ...newTask, status, id: Date.now() }]);
    setNewTask({ title: "", deadline: "", completed: false });
    setOpen(false);
  };

  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, status: task.completed ? "In Progress" : "Completed" }
          : task
      )
    );
  };

  const filteredTasks = (status) => tasks.filter((task) => task.status === status);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
      <Button onClick={() => setOpen(true)} className="mb-4">Add Task</Button>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["Pending", "In Progress", "Completed"].map((status) => (
          <div key={status}>
            <h2 className="text-xl font-bold mb-4">{status}</h2>
            {filteredTasks(status).map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                  <CardContent>Deadline: {task.deadline}</CardContent>
                </CardHeader>
                <CardFooter>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskStatus(task.id)}
                    />
                    <span className="ml-2">Mark as {task.completed ? "Incomplete" : "Complete"}</span>
                  </label>
                </CardFooter>
              </Card>
            ))}
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
