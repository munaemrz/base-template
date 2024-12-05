import React, { useState } from 'react';
import { Button, Input, Checkbox, Card, CardHeader, CardBody, CardFooter, Dialog, DialogHeader, DialogBody, DialogFooter } from "@shadcn/ui";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState({ name: '', client: '', earnings: 0, status: false, type: 'Development' });

  const addProject = (project) => {
    setProjects([...projects, { ...project, id: Date.now() }]);
    setDialogOpen(false);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const editProject = (id, updatedProject) => {
    setProjects(projects.map(project => project.id === id ? { ...project, ...updatedProject } : project));
  };

  const financialSummary = () => {
    const totalEarnings = projects.reduce((sum, p) => sum + (p.status ? parseFloat(p.earnings) : 0), 0);
    const pendingPayments = projects.reduce((sum, p) => sum + (!p.status ? parseFloat(p.earnings) : 0), 0);
    const completedProjects = projects.filter(p => p.status).length;

    return { totalEarnings, pendingPayments, completedProjects };
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <h1 className="text-2xl font-bold">Freelancer Portfolio Tracker</h1>
      <Button onClick={() => { setDialogOpen(true); setCurrentProject({ name: '', client: '', earnings: 0, status: false, type: 'Development' }); }}>Add Project</Button>

      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardBody>
            <p>Total Earnings: ${financialSummary().totalEarnings.toFixed(2)}</p>
            <p>Pending Payments: ${financialSummary().pendingPayments.toFixed(2)}</p>
            <p>Completed Projects: {financialSummary().completedProjects}</p>
          </CardBody>
        </Card>
      </div>

      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onDelete={deleteProject} 
          onEdit={(updatedProject) => editProject(project.id, updatedProject)} 
        />
      ))}

      <ProjectDialog 
        open={dialogOpen} 
        setOpen={setDialogOpen} 
        project={currentProject} 
        onSave={addProject} 
        onUpdate={(updatedProject) => { editProject(currentProject.id, updatedProject); setDialogOpen(false); }}
      />
    </div>
  );
};

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
        <CardTitle>{project.name}</CardTitle>
        <p>{project.client}</p>
      </CardHeader>
      {isExpanded && (
        <CardBody>
          <p>Type: {project.type}</p>
          <p>Earnings: ${project.earnings}</p>
          <Checkbox checked={project.status} onCheckedChange={(checked) => onEdit({ status: checked })}>Completed</Checkbox>
        </CardBody>
      )}
      <CardFooter className="flex justify-between">
        <Button onClick={() => onEdit(project)}>Edit</Button>
        <Button onClick={() => onDelete(project.id)} variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
};

const ProjectDialog = ({ open, setOpen, project, onSave, onUpdate }) => {
  const [localProject, setLocalProject] = useState(project);

  const handleSubmit = () => {
    if (project.id) {
      onUpdate(localProject);
    } else {
      onSave(localProject);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTitle>{project.id ? 'Edit Project' : 'Add New Project'}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <Input value={localProject.name} onChange={(e) => setLocalProject({...localProject, name: e.target.value})} placeholder="Project Name" />
        <Input value={localProject.client} onChange={(e) => setLocalProject({...localProject, client: e.target.value})} placeholder="Client" className="mt-2" />
        <Input type="number" value={localProject.earnings} onChange={(e) => setLocalProject({...localProject, earnings: e.target.value})} placeholder="Earnings" className="mt-2" />
        <select value={localProject.type} onChange={(e) => setLocalProject({...localProject, type: e.target.value})} className="mt-2 w-full p-2 border rounded">
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Content Writing">Content Writing</option>
        </select>
        <Checkbox checked={localProject.status} onCheckedChange={(checked) => setLocalProject({...localProject, status: checked})} className="mt-2">Completed</Checkbox>
      </DialogBody>
      <DialogFooter>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default App;