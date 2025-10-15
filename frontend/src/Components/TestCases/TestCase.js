import React, { useState, useEffect } from 'react';
import { Folder } from 'lucide-react';

const BACKEND_API_KEY = process.env.REACT_APP_BACKEND_API_KEY;
 
// Check if the key is available and throw an error if not
if (!BACKEND_API_KEY) {
  throw new Error(
    "Missing API Key! Please check your .env file and build config."
  );
}

export const TestCase = () => {
  const [folderData, setFolderData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const BASE_URL = "http://localhost:3100";
  const AUTH_HEADER = {
    "Content-Type": "application/json",
    Authorization: `ApiKey ${BACKEND_API_KEY}`,
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await fetch(
          `${BASE_URL}/api/projects?page=1&page_size=20&search=Demo`,
          {
            method: "GET",
            headers: AUTH_HEADER,
          }
        );
        if (!projectsRes.ok) {
          throw new Error("Failed to fetch projects");
        }
        const projectsData = await projectsRes.json();
        const projectsList = projectsData.data;
        setProjectsData(projectsList);
        console.log(projectsList);

        if (projectsList.length > 0) {
          const projectId = projectsList[0].id;
          setSelectedProjectId(projectId); // Set default project
          const foldersRes = await fetch(
            `${BASE_URL}/api/projects/${projectId}/folders`,
            {
              method: "GET",
              headers: AUTH_HEADER,
            }
          );

          if (!foldersRes.ok) {
            throw new Error("Failed to fetch Folders");
          }
          const foldersData = await foldersRes.json();
          setFolderData(foldersData);
          console.log(foldersData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      if (!selectedProjectId) return;
      try {
        const foldersRes = await fetch(
          `${BASE_URL}/api/projects/${selectedProjectId}/folders`,
          {
            method: "GET",
            headers: AUTH_HEADER,
          }
        );
        if (!foldersRes.ok) {
          throw new Error("Failed to fetch folders");
        }
        const foldersData = await foldersRes.json();
        setFolderData(foldersData);
        console.log(foldersData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFolders();
  }, [selectedProjectId]);

  const renderFolderTree = () => {
    return folderData.map((folder) => (
      <div
        key={folder.id}
        className="flex items-center py-2 px-3 hover:bg-blue-50 cursor-pointer rounded"
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

      <div className="flex flex-col container mx-auto p-6 gap-2">
        <div className="w-1/4 bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Select Project</h3>
          <select
            className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select a project</option>
            {projectsData.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name || project.id}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/4 bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Folder Structure</h3>
          <div className="space-y-1">
            {folderData.length > 0 ? (
              renderFolderTree()
            ) : (
              <div className="text-gray-500">No folders available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};