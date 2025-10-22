import React, { useState, useEffect } from "react";
import { Folder, MoreVertical, X, ChevronRight, ChevronDown } from "lucide-react";
import { get, post, del, patch } from "../../APICRUD/apiClient";

export const TestCase = () => {
  const [folderData, setFolderData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  // UI States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [activeMenuFolder, setActiveMenuFolder] = useState(null);
  const [parentFolderId, setParentFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await get("/api/projects?page=1&page_size=20");
        const data = await res.json();
        setProjectsData(data.data || []);
      } catch (err) {
        console.error("Project fetch error:", err);
      }
    };
    fetchProjects();
  }, []);

  // Fetch Folders
  const fetchFolders = async () => {
    if (!selectedProjectId) {
      setFolderData([]);
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = `/api/projects/${selectedProjectId}/folders?include_children=true&nested=true`;
      const res = await get(endpoint);
      const data = await res.json();

      // Normalize structure
      const normalize = (folders) =>
        folders.map((f) => ({
          ...f,
          subFolders: f.subFolders || f.children || [],
          subFoldersCount: (f.subFolders || f.children || []).length,
        }));

      setFolderData(Array.isArray(data) ? normalize(data) : []);
    } catch (err) {
      console.error("Folder fetch error:", err);
      setFolderData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [selectedProjectId]);

  // Create Folder or Subfolder
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      alert("Please enter a folder name");
      return;
    }
    if (!selectedProjectId) {
      alert("Please select a project first");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: folderName.trim(),
        ...(parentFolderId ? { parent_id: parentFolderId } : {}),
      };

      const endpoint = `/api/projects/${selectedProjectId}/folders`;
      const res = await post(endpoint, payload);
      if (!res.ok) throw new Error("Failed to create folder");

      await fetchFolders();

      if (parentFolderId) {
        setExpandedFolders((prev) => new Set([...prev, parentFolderId]));
      }

      // Reset modal state
      setIsCreateModalOpen(false);
      setFolderName("");
      setParentFolderId(null);
    } catch (err) {
      console.error("Create folder error:", err);
      alert("Failed to create folder");
    } finally {
      setIsLoading(false);
    }
  };

  // Subfolder Modal Trigger
  const handleCreateSubFolder = (folderId) => {
    setParentFolderId(folderId);
    setIsCreateModalOpen(true);
    setActiveMenuFolder(null);
  };

  // Delete Folder
  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("Are you sure you want to delete this folder and all its contents?"))
      return;
    try {
      setIsLoading(true);
      const endpoint = `api/folders/${folderId}`;
      await del(endpoint);
      await fetchFolders();

      if (selectedFolder?.id === folderId) setSelectedFolder(null);
      alert("Folder deleted successfully");
    } catch (err) {
      console.error("Delete folder error:", err);
      alert("Failed to delete folder");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Folder
  const handleEditFolder = async (folderId) => {
    const folder = findFolderById(folderData, folderId);
    if (!folder) return;

    const newName = prompt("Enter new folder name:", folder.name);
    if (!newName?.trim()) return;

    try {
      setIsLoading(true);
      const endpoint = `/api/projects/${selectedProjectId}/folders/${folderId}`;
      await patch(endpoint, { name: newName.trim() });
      await fetchFolders();
      alert("Folder updated successfully");
    } catch (err) {
      console.error("Edit folder error:", err);
      alert("Failed to update folder");
    } finally {
      setIsLoading(false);
    }
  };

  // Recursive Find Helper
  const findFolderById = (folders, id) => {
    for (const f of folders) {
      if (f.id === id) return f;
      if (f.subFolders?.length) {
        const found = findFolderById(f.subFolders, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Folder Expansion
  const toggleFolderExpansion = (e, folderId) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      newSet.has(folderId) ? newSet.delete(folderId) : newSet.add(folderId);
      return newSet;
    });
  };

  // Toggle Folder Menu
  const toggleFolderMenu = (e, folderId) => {
    e.stopPropagation();
    setActiveMenuFolder(activeMenuFolder === folderId ? null : folderId);
  };

  // Copy Folder URL
  const handleCopyFolderUrl = (folderId) => {
    const url = `${window.location.origin}/projects/${selectedProjectId}/folders/${folderId}`;
    navigator.clipboard.writeText(url).then(() => alert("Folder URL copied!"));
    setActiveMenuFolder(null);
  };

  // Close menu outside click
  useEffect(() => {
    const handleOutside = () => setActiveMenuFolder(null);
    if (activeMenuFolder) {
      document.addEventListener("click", handleOutside);
      return () => document.removeEventListener("click", handleOutside);
    }
  }, [activeMenuFolder]);

  // Render Folder Tree Recursively
  const renderFolder = (folder, level = 0) => {
    const hasSubFolders = folder.subFolders?.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolder?.id === folder.id;

    return (
      <div key={folder.id}>
        <div
          className={`relative flex items-center py-2 px-3 hover:bg-blue-50 cursor-pointer rounded group ${
            isSelected ? "bg-blue-100" : ""
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => setSelectedFolder(folder)}
        >
          {hasSubFolders ? (
            <button
              onClick={(e) => toggleFolderExpansion(e, folder.id)}
              className="mr-1 hover:bg-gray-200 rounded p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}

          <Folder className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-sm text-gray-700 flex-1">{folder.name}</span>

          <button
            onClick={(e) => toggleFolderMenu(e, folder.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {activeMenuFolder === folder.id && (
            <div className="absolute right-0 top-8 z-50 bg-white border rounded-lg shadow-lg py-1 w-48">
              <button
                onClick={() => handleCreateSubFolder(folder.id)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Add Sub Folder
              </button>
              <button
                onClick={() => handleEditFolder(folder.id)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit Folder
              </button>
              <button
                onClick={() => handleCopyFolderUrl(folder.id)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Copy Folder URL
              </button>
              <div className="border-t my-1"></div>
              <button
                onClick={() => handleDeleteFolder(folder.id)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {isExpanded &&
          hasSubFolders &&
          folder.subFolders.map((sub) => renderFolder(sub, level + 1))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Test Cases</h1>
        </div>
      </header>

      <div className="flex container mx-auto p-6 gap-6">
        {/* Left Panel */}
        <div className="w-1/4 flex flex-col gap-4">
          {/* Project Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Select Project</h3>
            <select
              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select a project</option>
              {projectsData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name || p.id}
                </option>
              ))}
            </select>
          </div>

          {/* Folder Tree */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Folder Structure</h3>
              <button
                onClick={() => {
                  setParentFolderId(null);
                  setIsCreateModalOpen(true);
                }}
                disabled={!selectedProjectId || isLoading}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition disabled:bg-gray-300"
              >
                Create Folder
              </button>
            </div>

            <div className="space-y-1">
              {!selectedProjectId ? (
                <div className="text-gray-500 text-sm">
                  Please select a project to see folders.
                </div>
              ) : isLoading ? (
                <div className="text-gray-500 text-sm">Loading folders...</div>
              ) : folderData.length > 0 ? (
                folderData.map((f) => renderFolder(f))
              ) : (
                <div className="text-gray-500 text-sm">No folders available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-3/4 bg-white rounded-lg shadow-sm border p-4">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {selectedFolder
                ? `Test Cases for ${selectedFolder.name}`
                : "Select a folder to view test cases"}
            </h3>
            <p className="text-gray-500 text-sm">
              {selectedFolder
                ? "Test case list will appear here."
                : "Choose a folder from the left panel."}
            </p>
          </div>
        </div>
      </div>

      {/* Folder Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {parentFolderId ? "Create Sub Folder" : "Create Folder"}
              </h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setParentFolderId(null);
                  setFolderName("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setParentFolderId(null);
                  setFolderName("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={isLoading || !folderName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading
                  ? "Creating..."
                  : parentFolderId
                  ? "Create Sub Folder"
                  : "Create Folder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
