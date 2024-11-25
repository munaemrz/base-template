import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', deadline: '', completed: false });

  const addTask = () => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ title: '', deadline: '', completed: false });
    setOpen(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = (status) => tasks.filter(task => {
    if (status === 'Completed') return task.completed;
    if (status === 'In Progress') return !task.completed && new Date(task.deadline) >= new Date();
    return !task.completed && new Date(task.deadline) < new Date();
  });

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
      <Button onClick={() => setOpen(true)} className="mb-4">Add Task</Button>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {['Pending', 'In Progress', 'Completed'].map(status => (
          <div key={status}>
            <h2 className="text-xl mb-4">{status}</h2>
            <div className="space-y-4">
              {filteredTasks(status).map(task => (
                <Card key={task.id}>
                  <CardHeader>
                    <CardTitle>{task.title}</CardTitle>
                    <CardDescription>
                      Deadline: {format(new Date(task.deadline), 'PPP')}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTask(task.id)} 
                    />
                    <label className="ml-2">Mark as {task.completed ? 'Incomplete' : 'Complete'}</label>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
                onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                type="date" 
                id="deadline" 
                value={newTask.deadline} 
                onChange={(e) => setNewTask({...newTask, deadline: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={addTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;