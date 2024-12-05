import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const projectTypes = [
  "Development",
  "Design",
  "Content Writing",
  "Marketing",
  "Other",
];

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState(project || {
    name: "",
    client: "",
    earnings: 0,
    completed: false,
    type: "Development",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Client
        </label>
        <input
          type="text"
          name="client"
          value={formData.client}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Earnings
        </label>
        <input
          type="number"
          name="earnings"
          value={formData.earnings}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Completed</span>
        </label>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const ProjectCard = ({ project, onEdit, onDelete, expanded, onToggle }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <button
          onClick={onToggle}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      <p className="text-gray-600 mb-2">Client: {project.client}</p>
      {expanded && (
        <>
          <p className="text-gray-600 mb-2">Earnings: ${project.earnings}</p>
          <p className="text-gray-600 mb-2">Type: {project.type}</p>
          <p className="text-gray-600 mb-2">
            Status: {project.completed ? "Completed" : "In Progress"}
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => onEdit(project)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const FinancialSummary = ({ projects }) => {
  const totalEarnings = projects.reduce((sum, p) => sum + p.earnings, 0);
  const pendingPayments = projects
    .filter((p) => !p.completed)
    .reduce((sum, p) => sum + p.earnings, 0);
  const completedProjects = projects.filter((p) => p.completed).length;

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-600">Total Earnings</p>
          <p className="text-2xl font-bold">${totalEarnings}</p>
        </div>
        <div>
          <p className="text-gray-600">Pending Payments</p>
          <p className="text-2xl font-bold">${pendingPayments}</p>
        </div>
        <div>
          <p className="text-gray-600">Completed Projects</p>
          <p className="text-2xl font-bold">{completedProjects}</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});

  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const handleSaveProject = (project) => {
    if (project.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p))
      );
    } else {
      setProjects((prev) => [...prev, { ...project, id: Date.now() }]);
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleExpand = (id) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Freelancer Portfolio Tracker</h1>
      <FinancialSummary projects={projects} />
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingProject ? "Edit Project" : "Add New Project"}
        </h2>
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => setEditingProject(null)}
        />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={setEditingProject}
            onDelete={handleDeleteProject}
            expanded={expandedProjects[project.id]}
            onToggle={() => handleToggleExpand(project.id)}
          />
        ))}
      </div>
    </div>
  );
}