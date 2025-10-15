import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3100";
  const AUTH_HEADER = {
    "Content-Type": "application/json",
    Authorization: `ApiKey ${BACKEND_API_KEY}`,
  };

  // Fetch projects from API only (no fallback)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await fetch(`${BASE_URL}/api/projects?page=1&page_size=20`, {
            method: "GET",
            headers: AUTH_HEADER,
        });
        if (!projectsRes.ok) throw new Error('Failed to fetch');
        const projectsData = await projectsRes.json();
        const rawProjects = projectsData.data || [];
        const sortedProjects = rawProjects
          .filter(p => !p.deleted_at)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const mappedProjects = sortedProjects.map((p, index) => ({
          id: p.id || "",
          uniqueId: index + 1,
          title: p.name || 'Untitled',
        }));
        setProjects(mappedProjects);
      } catch (err) {
        console.error('Error:', err);
        setProjects([]); // Empty on error
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Navigate with DB ID
  const handleNavigateToTestCases = (project) => {
    console.log('Routing with DB ID:', project.id); // Test log
    navigate('/test-cases', { state: { projectDbId: project.id, projectTitle: project.title } });
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          </div>
        </div>

        {/* Simple Table: ID and Project Name */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 w-24">ID</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">PROJECT NAME</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{project.uniqueId || 'N/A'}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleNavigateToTestCases(project)}
                      className="text-left w-full font-medium text-gray-900 hover:text-blue-600"
                    >
                      {project.title || 'Untitled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && <div className="text-center py-12 text-gray-500">No projects found.</div>}
        </div>
      </div>
    </div>
  );
};