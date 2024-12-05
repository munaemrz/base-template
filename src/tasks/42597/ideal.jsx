import React, { useState } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-96 p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const FinancialSummary = ({ projects }) => {
  const totalEarnings = projects
    .filter((p) => p.completed)
    .reduce((sum, p) => sum + p.earnings, 0);
  const completedProjects = projects.filter((p) => p.completed).length;
  const pendingProjects = projects.length - completedProjects;

  return (
    <div className="p-4 border rounded shadow space-y-4">
      <h3 className="text-lg font-bold">Financial Summary</h3>
      <div className="flex justify-between">
        <div>
          <p>Total Earnings</p>
          <p className="text-lg font-semibold">${totalEarnings.toFixed(2)}</p>
        </div>
        <div>
          <p>Completed Projects</p>
          <p className="text-lg font-semibold">{completedProjects}</p>
        </div>
        <div>
          <p>Pending Projects</p>
          <p className="text-lg font-semibold">{pendingProjects}</p>
        </div>
      </div>
    </div>
  );
};

const ProjectForm = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    project || {
      name: "",
      client: "",
      earnings: 0,
      completed: false,
      type: "Development",
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, earnings: parseFloat(formData.earnings) });
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
          className="mt-1 block w-full border rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Client</label>
        <input
          type="text"
          name="client"
          value={formData.client}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm"
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
          className="mt-1 block w-full border rounded-md shadow-sm"
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
          className="mt-1 block w-full border rounded-md shadow-sm"
        >
          {["Development", "Design", "Content Writing", "Other"].map((type) => (
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
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm">Completed</span>
        </label>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-md text-sm bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border rounded-md text-sm bg-blue-500 text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const ProjectCard = ({ project, onEdit, onDelete, expanded, onToggle }) => (
  <div className="border rounded shadow p-4 mb-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">{project.name}</h3>
      <button
        onClick={onToggle}
        className="text-blue-500 hover:text-blue-700 text-sm"
      >
        {expanded ? "Collapse" : "Expand"}
      </button>
    </div>
    <p>Client: {project.client}</p>
    {expanded && (
      <>
        <p>Earnings: ${project.earnings.toFixed(2)}</p>
        <p>Type: {project.type}</p>
        <p>Status: {project.completed ? "Completed" : "Pending"}</p>
        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={() => onEdit(project)}
            className="px-3 py-1 border rounded bg-gray-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="px-3 py-1 border rounded bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      </>
    )}
  </div>
);

export default function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");

  const handleSaveProject = (project) => {
    if (project.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p))
      );
    } else {
      setProjects((prev) => [...prev, { ...project, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleExpand = (id) => {
    setExpandedProject((prev) => (prev === id ? null : id));
  };

  const filteredProjects =
    filterType === "All"
      ? projects
      : projects.filter((p) => p.type === filterType);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Freelancer Portfolio Tracker</h1>
      <FinancialSummary projects={projects} />
      <div className="my-4">
        <label className="block text-sm font-medium mb-2">Filter by Type</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="block w-full border rounded-md shadow-sm"
        >
          <option value="All">All</option>
          {["Development", "Design", "Content Writing", "Other"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditingProject(null);
        }}
        className="mb-4 px-4 py-2 border rounded bg-green-500 text-white"
      >
        Add New Project
      </button>
      <div>
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={(p) => {
              setEditingProject(p);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteProject}
            expanded={expandedProject === project.id}
            onToggle={() => handleToggleExpand(project.id)}
          />
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
      >
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
        />
      </Modal>
    </div>
  );
}
