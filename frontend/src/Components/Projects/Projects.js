import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { get, post, del, patch } from "../../APICRUD/apiClient";
import { Modalpopup } from "../../CommonComponents/Modalpopup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const BACKEND_API_KEY = process.env.REACT_APP_BACKEND_API_KEY;

// Check if the key is available and throw an error if not
if (!BACKEND_API_KEY) {
  throw new Error(
    "Missing API Key! Please check your .env file and build config."
  );
}

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenuFor, setShowMenuFor] = useState(null); // Track open menu
  const [showCreateModal, setShowCreateModal] = useState(false); // Create popup
  const [showEditModal, setShowEditModal] = useState(false); // Edit popup
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete popup
  const [currentProject, setCurrentProject] = useState(null); // For edit/delete
  const [newProjectName, setNewProjectName] = useState(""); // Create/Edit input
  const [actionLoading, setActionLoading] = useState(false); // Loading for mutations
  const menuRefs = useRef({}); // Refs for each menu to handle outside clicks
  const navigate = useNavigate();

  // Date formatter for readability
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  // Refetch function for reuse after mutations (using the new 'get' from apiClient)
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const projectsRes = await get("/api/projects?page=1&page_size=20");
      const projectsData = await projectsRes.json();

      const rawProjects = projectsData.data || [];

      const sortedProjects = rawProjects
        .filter((p) => !p.deleted_at)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      const mappedProjects = sortedProjects.map((p, index) => ({
        id: p.id || "",
        uniqueId: index + 1,
        title: p.name || "Untitled",
        createdAt: p.created_at ?? null,
      }));
      setProjects(mappedProjects);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Close menu if clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        showMenuFor &&
        menuRefs.current[showMenuFor] &&
        !menuRefs.current[showMenuFor].contains(e.target)
      ) {
        setShowMenuFor(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showMenuFor]);

  // Navigate with DB ID
  const handleNavigateToTestCases = (project) => {
    navigate("/test-cases", {
      state: { projectDbId: project.id, projectTitle: project.title },
    });
  };

  // Toggle menu
  const toggleMenu = (e, projectId) => {
    e.stopPropagation();
    setShowMenuFor(showMenuFor === projectId ? null : projectId);
  };

  // --- Modal Open/Close Logic ---

  const openCreateModal = () => {
    setNewProjectName("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewProjectName("");
  };

  const openEditModal = (project) => {
    setShowMenuFor(null);
    setCurrentProject(project);
    setNewProjectName(project.title);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setNewProjectName("");
    setCurrentProject(null);
  };

  const openDeleteModal = (project) => {
    setShowMenuFor(null);
    setCurrentProject(project);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentProject(null);
  };

  // --- API Handlers (Unchanged) ---

  const handleCreateSubmit = async () => {
    if (!newProjectName.trim()) return;
    setActionLoading(true);
    try {
      const endpoint = "/api/projects";
      const body = { name: newProjectName };
      const createRes = await post(endpoint, body);
      if (!createRes.ok) throw new Error("Failed to create");
      await fetchProjects();
      closeCreateModal(); // Use the new close function
    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create project.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!newProjectName.trim() || newProjectName === currentProject.title)
      return;
    setActionLoading(true);
    try {
      const endpoint = `/api/projects/${currentProject.id}`;
      const body = { name: newProjectName };
      const editRes = await patch(endpoint, body);
      if (!editRes.ok) throw new Error("Failed to edit");
      await fetchProjects();
      closeEditModal(); // Use the new close function
    } catch (err) {
      console.error("Edit error:", err);
      alert("Failed to edit project.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      const endpoint = `/api/projects/${currentProject.id}`;
      const deleteRes = await del(endpoint);
      if (!deleteRes.ok) throw new Error("Failed to delete");
      await fetchProjects();
      closeDeleteModal(); // Use the new close function
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete project.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- Render Logic ---

  // 🎯 Modal Content and Buttons Helper Components

  const CreateProjectContent = (
    <TextField
      fullWidth
      variant="outlined"
      label="Project Name"
      value={newProjectName}
      onChange={(e) => setNewProjectName(e.target.value)}
      placeholder="Enter project name"
      disabled={actionLoading}
    />
  );

  const CreateProjectButtons = [
    <Button
      key="cancel"
      onClick={closeCreateModal}
      disabled={actionLoading}
      color="inherit"
      sx={{ border: "1px solid black" }}
    >
      Cancel
    </Button>,
    <Button
      key="create"
      onClick={handleCreateSubmit}
      disabled={actionLoading || !newProjectName.trim()}
      variant="contained"
      color="primary"
      sx={{ border: "1px solid black" }}
    >
      {actionLoading ? "Creating..." : "Create"}
    </Button>,
  ];

  const EditProjectContent = (
    <TextField
      fullWidth
      variant="outlined"
      label="New Project Name"
      value={newProjectName}
      onChange={(e) => setNewProjectName(e.target.value)}
      placeholder="Enter new project name"
      disabled={actionLoading}
    />
  );

  const EditProjectButtons = [
    <Button
      key="cancel"
      onClick={closeEditModal}
      disabled={actionLoading}
      color="inherit"
      sx={{ border: "1px solid black" }}
    >
      Cancel
    </Button>,
    <Button
      key="save"
      onClick={handleEditSubmit}
      disabled={
        actionLoading ||
        !newProjectName.trim() ||
        newProjectName === currentProject?.title
      }
      variant="contained"
      color="primary"
      sx={{ border: "1px solid black" }}
    >
      {actionLoading ? "Saving..." : "Save"}
    </Button>,
  ];

  const DeleteProjectContent = (
    <Typography variant="body2" color="text.secondary">
      Are you sure you want to delete "
      <span style={{ fontWeight: 600, color: "#1f2937" }}>
        {currentProject?.title}
      </span>
      "? This action cannot be undone.
    </Typography>
  );

  const DeleteProjectButtons = [
    <Button
      key="cancel"
      onClick={closeDeleteModal}
      disabled={actionLoading}
      color="inherit"
      sx={{ border: "1px solid black" }}
    >
      Cancel
    </Button>,
    <Button
      key="delete"
      onClick={handleDeleteConfirm}
      disabled={actionLoading}
      variant="contained"
      sx={{
        backgroundColor: "gray",
        color: "white",
        "&:hover": {
          backgroundColor: "red",
          opacity: 1,
        },
      }}
    >
      {actionLoading ? "Deleting..." : "Delete"}
    </Button>,
  ];

  if (loading)
    return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>

        {/* Table with updated columns (only CREATED AT) + Actions */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 w-24">
                  ID
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  PROJECT NAME
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  CREATED AT
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 w-20">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-200 hover:bg-gray-50 relative"
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">
                    {project.uniqueId || "N/A"}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleNavigateToTestCases(project)}
                      className="text-left w-full font-medium text-gray-900 hover:text-blue-600"
                    >
                      {project.title || "Untitled"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={(e) => toggleMenu(e, project.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ...
                    </button>
                    {showMenuFor === project.id && (
                      <div
                        ref={(el) => (menuRefs.current[project.id] = el)}
                        className="absolute right-0 top-0 mt-10 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                      >
                        <button
                          onClick={() => openEditModal(project)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(project)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No projects found.
            </div>
          )}
        </div>
      </div>

      {/* 🎯 Create Project Modal (Using Modalpopup) */}
      <Modalpopup
        open={showCreateModal}
        onClose={closeCreateModal}
        header="Create Project"
        content={CreateProjectContent}
        buttons={CreateProjectButtons}
        width="400px" // Adjusted for the input field
        padding="20px"
      />

      {/* 🎯 Edit Project Modal (Using Modalpopup) */}
      <Modalpopup
        open={showEditModal}
        onClose={closeEditModal}
        header="Edit Project"
        content={EditProjectContent}
        buttons={EditProjectButtons}
        width="400px" // Adjusted for the input field
        padding="20px"
      />

      {/* 🎯 Delete Confirmation Modal (Using Modalpopup) */}
      <Modalpopup
        open={showDeleteModal}
        onClose={closeDeleteModal}
        header="Confirm Delete"
        content={DeleteProjectContent}
        buttons={DeleteProjectButtons}
        width="450px" // Slightly wider for text
        padding="20px"
      />
    </div>
  );
};
