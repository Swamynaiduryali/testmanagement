import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // <-- We need this
import { Folder } from "lucide-react";
import { get } from "../../APICRUD/apiClient";
import { FolderTestCase } from "./FolderTestCase";

export const TestCase = () => {
  // --- Get the passed data from the navigation ---
  const location = useLocation();
  const initialProjectId = location.state?.projectDbId || ""; // Get the ID, or use empty string if none

  const [folderData, setFolderData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  // --- Start with the ID passed from the Projects screen ---
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);

  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleSelectedFolder = (folder) => {
    setSelectedFolder(folder);
  };

  // 1. Fetch Projects (This is only needed to fill the dropdown list)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await get("/api/projects?page=1&page_size=20");
        const projectsData = await projectsRes.json();
        const projectsList = projectsData.data;
        setProjectsData(projectsList);
      } catch (error) {
        console.log("Project Fetch Error:", error.message || error);
      }
    };

    fetchProjects();
  }, []); // Run only once when the component first loads

  // 2. Fetch Folders (This runs whenever the selectedProjectId changes)
  useEffect(() => {
    const fetchFolders = async () => {
      // Don't run the fetch if we don't have an ID
      if (!selectedProjectId) {
        setFolderData([]); // Clear folders if no project is selected
        return;
      }

      try {
        const endpoint = `/api/projects/${selectedProjectId}/folders`;

        // Use the common 'get' function which returns the raw Response
        const foldersRes = await get(endpoint);

        // Handle the JSON parsing here
        const foldersData = await foldersRes.json();

        setFolderData(foldersData);
      } catch (error) {
        setFolderData([]);
      }
    };

    fetchFolders();
  }, [selectedProjectId]); // Re-run whenever selectedProjectId changes

  const renderFolderTree = () => {
    // ... (rest of the renderFolderTree function remains the same)
    return folderData.map((folder) => (
      <div
        key={folder.id}
        className="flex items-center py-2 px-3 hover:bg-blue-50 cursor-pointer rounded"
        onClick={() => handleSelectedFolder(folder)}
      >
        <Folder className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-sm text-gray-700">{folder.name}</span>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Test Cases</h1>
        </div>
      </header>

      <div className="flex container mx-auto p-6 gap-6">
        {/* Left column for Project Selection and Folder Structure */}
        <div className="w-1/4 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Select Project
            </h3>
            <select
              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {/* Added a default option that shows when nothing is selected */}
              <option value="" disabled>
                Select a project
              </option>
              {projectsData.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name || project.id}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Folder Structure
            </h3>
            <div className="space-y-1">
              {!selectedProjectId ? (
                <div className="text-gray-500 text-sm">
                  Please select a project to see folders.
                </div>
              ) : folderData.length > 0 ? (
                renderFolderTree()
              ) : (
                <div className="text-gray-500 text-sm">
                  No folders available for this project.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column for Test Cases (placeholder) */}
        <div className="w-3/4 bg-white rounded-lg shadow-sm border p-4">
          <FolderTestCase selectedFolder={selectedFolder} />
        </div>
      </div>
    </div>
  );
};
