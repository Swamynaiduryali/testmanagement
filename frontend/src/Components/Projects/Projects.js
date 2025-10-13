import React, { useState, useEffect } from "react";

export const Projects = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // New state for edit modal
  const [showImportModal, setShowImportModal] = useState(false); // New state for import modal
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [editProjectData, setEditProjectData] = useState({
    id: "",
    title: "",
    subtitle: "",
  }); // New state for editing project

  // Initialize projects from localStorage or use default data
  const getInitialProjects = () => {
    try {
      const savedProjects = localStorage.getItem("testManagementProjects");
      if (savedProjects) {
        return JSON.parse(savedProjects);
      }
    } catch (error) {
      console.error("Error loading projects from localStorage:", error);
    }

    // Default projects if nothing in localStorage
    return [
      {
        id: "PR-2",
        title: "Test",
        subtitle: "Test",
        testCases: 0,
        testRuns: 0,
        starred: false,
      },
      {
        id: "PR-1",
        title: "Demo Project",
        subtitle:
          "This project contains test cases and test runs for the demo project",
        testCases: 100,
        testRuns: 5,
        starred: false,
        hasIcon: true,
      },
    ];
  };

  const [projects, setProjects] = useState(getInitialProjects);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("testManagementProjects", JSON.stringify(projects));
    } catch (error) {
      console.error("Error saving projects to localStorage:", error);
    }
  }, [projects]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      alert("Please enter a project name");
      return;
    }

    // Generate new project ID
    const maxId = projects.reduce((max, project) => {
      const num = parseInt(project.id.replace("PR-", ""));
      return num > max ? num : max;
    }, 0);

    const newProject = {
      id: `PR-${maxId + 1}`,
      title: projectName.trim(),
      subtitle: projectDescription.trim(),
      testCases: 0,
      testRuns: 0,
      starred: false,
      hasIcon: true,
    };

    setProjects([newProject, ...projects]);
    setShowCreateModal(false);
    setProjectName("");
    setProjectDescription("");
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setProjectName("");
    setProjectDescription("");
  };

  const toggleStarProject = (projectId) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, starred: !project.starred }
          : project
      )
    );
  };

  const handleEditProject = () => {
    if (!editProjectData.title.trim()) {
      alert("Please enter a project name");
      return;
    }

    setProjects(
      projects.map((project) =>
        project.id === editProjectData.id
          ? {
              ...project,
              title: editProjectData.title.trim(),
              subtitle: editProjectData.subtitle.trim(),
            }
          : project
      )
    );
    setShowEditModal(false);
    setEditProjectData({ id: "", title: "", subtitle: "" });
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditProjectData({ id: "", title: "", subtitle: "" });
  };

  const handleOpenEditModal = (project) => {
    setEditProjectData({
      id: project.id,
      title: project.title,
      subtitle: project.subtitle,
    });
    setShowEditModal(true);
  };

  const deleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((project) => project.id !== projectId));
    }
  };

  // New handler for Quick Import
  const handleQuickImport = () => {
    setShowImportModal(true);
  };

  // New handler for selecting an import source
  const handleImportFrom = (source) => {
    console.log(`Import from ${source} clicked`); // Replace with actual import logic
    setShowImportModal(false);
  };

  // New handler for closing import modal
  const handleCancelImport = () => {
    setShowImportModal(false);
  };

  const actionCards = [
    {
      icon: "📋",
      bgColor: "bg-blue-100",
      title: "Create a New Project",
      description: "Start from a clean slate and add data through CSV import",
      action: () => setShowCreateModal(true),
    },
    {
      icon: "➕",
      bgColor: "bg-blue-100",
      title: "Explore the Demo Project",
      description:
        "View the demo project to explore features of Test Management",
      action: () => console.log("Explore Demo Project clicked"),
    },
    {
      icon: "⬇",
      bgColor: "bg-blue-100",
      title: "Import from TestRail, Zephyr Scale, qTest or Xray",
      description:
        "Start migrating data from your existing tool to Test Management",
      action: () => console.log("Import clicked"),
    },
    {
      icon: "✨",
      bgColor: "bg-blue-600",
      title: "Generate Test Case with AI",
      description:
        "Save hours with AI-powered test case creation. Try it now in the demo project",
      action: () => console.log("Generate Test Case with AI clicked"),
      isHighlight: true,
    },
  ];

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const starredProjects = filteredProjects.filter((project) => project.starred);
  const displayedProjects =
    activeTab === "starred" ? starredProjects : filteredProjects;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-gray-800">←</button>
            <h1 className="text-2xl font-semibold text-gray-900">
              All Projects
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={handleQuickImport}
            >
              Quick Import
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setShowCreateModal(true)}
            >
              Create Project
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange("all")}
            className={`pb-3 px-1 font-medium border-b-2 transition ${
              activeTab === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Projects{" "}
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-sm">
              {projects.length}
            </span>
          </button>
          <button
            onClick={() => handleTabChange("starred")}
            className={`pb-3 px-1 font-medium border-b-2 transition ${
              activeTab === "starred"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Starred Projects{" "}
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-sm">
              {starredProjects.length}
            </span>
          </button>
        </div>

        {/* Welcome Banner - Only show on "All Projects" tab */}
        {showWelcome && activeTab === "all" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome to Test Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Get started by using one of the actions below
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionCards.map((card, index) => (
                <button
                  key={index}
                  className={`${card.bgColor} ${
                    card.isHighlight ? "text-white" : "text-gray-900"
                  } rounded-lg p-4 flex items-start gap-4 hover:opacity-90 transition text-left`}
                  onClick={card.action}
                >
                  <div
                    className={`text-2xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${
                      card.isHighlight ? "bg-blue-700" : "bg-white"
                    }`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{card.title}</h3>
                      <span className="text-xl">→</span>
                    </div>
                    <p
                      className={`text-sm ${
                        card.isHighlight ? "text-blue-100" : "text-gray-600"
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search projects by title/ID"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Projects Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 w-24">
                  ID
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  PROJECT TITLE
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  QUICK LINKS
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {displayedProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        className={`text-2xl ${
                          project.starred ? "text-yellow-400" : "text-gray-300"
                        } hover:text-yellow-400`}
                        onClick={() => toggleStarProject(project.id)}
                        aria-label={
                          project.starred ? "Unstar project" : "Star project"
                        }
                      >
                        {project.starred ? "★" : "☆"}
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {project.id}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-3">
                      {project.hasIcon && (
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          📁
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {project.title}
                        </div>
                        {project.subtitle && (
                          <div className="text-sm text-gray-500 mt-0.5">
                            {project.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-700 hover:underline">
                        {project.testCases} Test Cases
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-blue-600 hover:text-blue-700 hover:underline">
                        {project.testRuns} Test Runs
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative group">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Project actions"
                      >
                        ⋮
                      </button>
                      <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => toggleStarProject(project.id)}
                          aria-label={
                            project.starred
                              ? "Remove from Starred"
                              : "Add to Starred"
                          }
                        >
                          {project.starred
                            ? "Remove from Starred"
                            : "Add to Starred"}
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => handleOpenEditModal(project)}
                          aria-label="Edit project"
                        >
                          Edit Project
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={() => deleteProject(project.id)}
                          aria-label="Delete project"
                        >
                          Delete Project
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayedProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {activeTab === "starred"
              ? "No starred projects yet. Star a project to see it here."
              : "No projects found matching your search."}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="create-project-modal-title"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2
                id="create-project-modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                Create Project
              </h2>
              <button
                onClick={handleCancelCreate}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close create project modal"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
                  className="w-full px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  autoFocus
                  aria-required="true"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Write in brief about the project"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelCreate}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                aria-label="Cancel create project"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Create project"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="edit-project-modal-title"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2
                id="edit-project-modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                Edit Project
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close edit project modal"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={editProjectData.title}
                  onChange={(e) =>
                    setEditProjectData({
                      ...editProjectData,
                      title: e.target.value,
                    })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleEditProject()}
                  className="w-full px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  autoFocus
                  aria-required="true"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Write in brief about the project"
                  value={editProjectData.subtitle}
                  onChange={(e) =>
                    setEditProjectData({
                      ...editProjectData,
                      subtitle: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                aria-label="Cancel edit project"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Save project"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Quick Import Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="import-modal-title"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2
                id="import-modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                Import Test Cases From
              </h2>
              <button
                onClick={handleCancelImport}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close import modal"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-2">
              <button
                onClick={() => handleImportFrom("TestRail")}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm text-gray-700"
              >
                ⬤ TestRail
              </button>
              <button
                onClick={() => handleImportFrom("Xray")}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm text-gray-700"
              >
                ⬤ Xray
              </button>
              <button
                onClick={() => handleImportFrom("Zephyr Scale")}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm text-gray-700"
              >
                ⬤ Zephyr Scale
              </button>
              <button
                onClick={() => handleImportFrom("Zephyr Squad")}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm text-gray-700"
              >
                ⬤ Zephyr Squad
              </button>
              <button
                onClick={() => handleImportFrom("qTest")}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm text-gray-700"
              >
                ⬤ qTest
              </button>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleCancelImport}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                aria-label="Cancel import"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
