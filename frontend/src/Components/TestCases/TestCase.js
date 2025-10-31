import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Folder,
  MoreVertical,
  X,
  ChevronRight,
  ChevronDown,
  Search,
} from "lucide-react";
import { get, post, patch, del } from "../../APICRUD/apiClient";
import { FolderTestCase } from "./FolderTestCase";
import { CommonButton } from "../../CommonComponents/Button";
import { CreateTestCase } from "./CreateTestCase";
import { Modalpopup } from "../../CommonComponents/Modalpopup";

export const TestCase = () => {
  const GlobalOwnerId = process.env.REACT_APP_GLOBAL_OWNER_ID;
  const location = useLocation();
  const initialProjectId = location.state?.projectDbId || "";
  const [folderData, setFolderData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]); // NEW: Filtered projects for search
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openCreateTestCase, setOpenCreateTestCase] = useState(false);
  const [folderTestCases, setFolderTestCases] = useState(null);
  const [editingTestCaseId, setEditingTestCaseId] = useState(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  // Add this after your existing state declarations (around line 20)
  const [filters, setFilters] = useState({
    type: null,
    priority: null,
    state: null,
    searchTerm: "",
  });
  // Tags Management
  const [selectedTags, setSelectedTags] = useState([]);

  // Folder management states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isEditFolderModalOpen, setIsEditFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [activeMenuFolder, setActiveMenuFolder] = useState(null);
  const [parentFolderId, setParentFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);

  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      preconditions: "",
      owner: "OWNER1",
      state: "ACTIVE",
      priority: "LOW",
      type: "FUNCTIONAL",
      automation_status: "NOT_AUTOMATED",
    });

    setAddStep([
      {
        id: 1,
        step: "",
        expectedResult: "",
        actualResult: "",
      },
    ]);
    setErrors({
      title: "",
      steps: [],
    });
  };

  const handleSelectedFolder = (folder) => {
    setSelectedFolder(folder);
  };

  const onClose = () => {
    setOpenCreateTestCase((prev) => !prev);
    resetFormData();
    setEditingTestCaseId(null);
  };

  // Steps data
  const [addStep, setAddStep] = useState([
    {
      id: 1,
      step: "",
      expectedResult: "",
      actualResult: "",
    },
  ]);

  // All form data in a single object
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    preconditions: "",
    owner: "OWNER1",
    state: "ACTIVE",
    priority: "LOW",
    type: "FUNCTIONAL",
    automation_status: "NOT_AUTOMATED",
  });

  // Errors for validation of inputs
  const [errors, setErrors] = useState({
    title: "",
    steps: [],
  });

  // Adding steps
  const handleStepAdd = () => {
    setAddStep([
      ...addStep,
      {
        id: addStep.length + 1,
        step: "",
        expectedResult: "",
        actualResult: "",
      },
    ]);
  };

  // When changing step fields
  const handleStepChange = (index, field, value) => {
    const updated = [...addStep];
    updated[index][field] = value;
    setAddStep(updated);

    setErrors((prev) => {
      const newErrors = { ...prev };
      const stepErrors = newErrors.steps ? [...newErrors.steps] : [];

      while (stepErrors.length < updated.length) {
        stepErrors.push({ step: "", expectedResult: "" });
      }

      if (field === "step") {
        stepErrors[index] = {
          ...stepErrors[index],
          step: value.trim() ? "" : "Step is Mandatory",
        };
      }
      if (field === "expectedResult") {
        stepErrors[index] = {
          ...stepErrors[index],
          expectedResult: value.trim() ? "" : "Expected Result is Mandatory",
        };
      }
      newErrors.steps = stepErrors;
      return newErrors;
    });
  };

  // Remove step
  const handleRemoveStep = (e, id) => {
    e.preventDefault();
    setAddStep(addStep.filter((step) => step.id !== id));
  };

  // Handle all main form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "title") {
        newErrors.title = value.trim() ? "" : "Title is Mandatory";
      }
      return newErrors;
    });
  };

  // Validation for form with few values like title and steps as mandatory fields
  const validateForm = () => {
    const newErrors = { title: "", steps: [] };

    if (!formData.title.trim()) {
      newErrors.title = "Title is Mandatory";
    }

    addStep.forEach((step, index) => {
      newErrors.steps[index] = { step: "", expectedResult: "" };
      if (!step.step.trim()) {
        newErrors.steps[index].step = "Step is Mandatory";
      }
      if (!step.expectedResult.trim()) {
        newErrors.steps[index].expectedResult = "Expected Result is Mandatory";
      }
    });

    setErrors(newErrors);

    const isValid =
      !newErrors.title &&
      newErrors.steps.every((s) => s.step === "" && s.expectedResult === "");

    return isValid;
  };

  const fetchFolderTestCases = async (folder, filterParams = {}) => {
    if (!folder) {
      setFolderTestCases(null);
      return;
    }

    try {
      let res;

      // Check if any filters are applied
      const hasFilters =
        filterParams.type ||
        filterParams.priority ||
        filterParams.state ||
        filterParams.searchTerm;

      if (hasFilters) {
        // ✅ Path 2: User applied filters - use dynamic params
        const params = new URLSearchParams({
          folder_id: folder.id,
          page: "1",
          page_size: "20",
        });

        if (filterParams.type) params.append("type", filterParams.type);
        if (filterParams.priority)
          params.append("priority", filterParams.priority);
        if (filterParams.state) params.append("state", filterParams.state);
        if (filterParams.searchTerm)
          params.append("search", filterParams.searchTerm);

        res = await get(
          `/api/projects/${folder.project_id}/test-cases?${params.toString()}`
        );
      } else {
        // ✅ Path 1: User clicked folder - use base URL (no filters)
        res = await get(
          `/api/projects/${folder.project_id}/test-cases?folder_id=${folder.id}&page=1&page_size=20`
        );
      }

      const json = await res.json();
      setFolderTestCases(json.data || []);
    } catch (error) {
      console.error("Error fetching test cases:", error);
      setFolderTestCases([]);
    }
  };

  // Handle form submission
  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const detailsPayload = {
      title: formData.title,
      priority: formData.priority,
      state: formData.state,
      type: formData.type,
      automation_status: formData.automation_status,
    };

    const stepsPayload = {
      steps: addStep.map((step, index) => ({
        index: index + 1,
        step: step.step,
        expected: step.expectedResult,
      })),
    };

    try {
      if (editingTestCaseId) {
        console.log(selectedFolder);

        // ✅ Use selectedFolder.project_id instead of the whole object
        await patch(
          `/api/projects/${selectedFolder?.project_id}/test-cases/${editingTestCaseId}`,
          detailsPayload
        );

        await patch(
          `/api/projects/${selectedFolder?.project_id}/test-cases/${editingTestCaseId}`,
          stepsPayload
        );
      } else {
        const payload = {
          title: formData.title,
          description: formData.description,
          preconditions: formData.preconditions,
          folder_id: selectedFolder?.id || "",
          owner_id: GlobalOwnerId,
          state: formData.state,
          priority: formData.priority,
          type: formData.type,
          automation_status: formData.automation_status,
          steps: addStep.map((step, index) => ({
            index: index + 1,
            step: step.step,
            expected: step.expectedResult,
          })),
          // tag_ids: ["b6e2853c-a6ed-4957-b508-6a8efb46eb98"],
          tag_ids: selectedTags,
        };

        const response = await post(
          `/api/projects/${selectedProjectId}/test-cases`,
          payload
        );
        const data = await response.json();
        console.log("Test case created:", data);
      }

      resetFormData();
      setEditingTestCaseId(null);
      onClose();
      await fetchFolderTestCases(selectedFolder);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // Edit test case
  const handleEditTestCase = async (testCase) => {
    console.log(testCase.folder_id);
    setFormData({
      title: testCase.title || "",
      description: testCase.description || "",
      preconditions: testCase.preconditions || "",
      owner: testCase.owner?.display_name || "OWNER1",
      state: testCase.state || "ACTIVE",
      priority: testCase.priority || "LOW",
      type: testCase.type || "FUNCTIONAL",
      automation_status: testCase.automation_status || "NOT_AUTOMATED",
    });

    try {
      const res = await get(
        `/api/projects/${testCase.project_id}/test-cases?folder_id=${testCase.folder_id}&page=1&page_size=20`
      );

      const json = await res.json();
      console.log(json);

      const selectedTestCase = json?.data?.find(
        (item) => item.id === testCase.id
      );

      // Parse steps_json safely
      const stepsData = selectedTestCase?.steps_json
        ? JSON.parse(selectedTestCase.steps_json)
        : [];

      console.log(stepsData);

      setAddStep(
        stepsData.length
          ? stepsData.map((s, index) => ({
              id: s.index || index + 1,
              step: s.step || "",
              expectedResult: s.expected || "",
              actualResult: s.actual || "",
            }))
          : [
              {
                id: 1,
                step: "",
                expectedResult: "",
                actualResult: "",
              },
            ]
      );
    } catch (error) {
      console.error("Error fetching test case details:", error);
      setAddStep([
        {
          id: 1,
          step: "",
          expectedResult: "",
          actualResult: "",
        },
      ]);
    }

    setEditingTestCaseId(testCase.id);
    setOpenCreateTestCase(true);
  };

  // Delete test case
  const handleDeleteTestCase = async (testCaseId, testCaseProjectId) => {
    console.log(testCaseId, testCaseProjectId);
    //later I want to implement an modalpopup here
    if (!window.confirm("Are you sure you want to delete this test case?"))
      return;

    try {
      await del(`/api/projects/${testCaseProjectId}/test-cases/${testCaseId}`);
      alert("Test case deleted successfully!");

      // Refresh the test cases list
      await fetchFolderTestCases(selectedFolder);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete test case.");
    }
  };

  // Add filter change handler
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [filterType]: value };

      // Fetch test cases with new filters
      if (selectedFolder) {
        fetchFolderTestCases(selectedFolder, {
          type: newFilters.type,
          priority: newFilters.priority,
          state: newFilters.state,
          searchTerm: newFilters.searchTerm,
        });
      }

      return newFilters;
    });
  };

  const handleSearch = async (searchTerm) => {
    if (!selectedProjectId || !selectedFolder?.id) return;

    const trimmedSearch = searchTerm.trim();

    // Update filter state
    setFilters((prev) => ({ ...prev, searchTerm: trimmedSearch }));

    // If search box is empty, reload all test cases with active filters
    if (!trimmedSearch) {
      await fetchFolderTestCases(selectedFolder, {
        type: filters.type,
        priority: filters.priority,
        state: filters.state,
        searchTerm: "", // Empty search
      });
      return;
    }

    // Fetch with all active filters including search term
    await fetchFolderTestCases(selectedFolder, {
      type: filters.type,
      priority: filters.priority,
      state: filters.state,
      searchTerm: trimmedSearch,
    });
  };

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRes = await get("/api/projects?page=1&page_size=20");
        const projectsData = await projectsRes.json();
        const projectsList = projectsData.data;
        setProjectsData(projectsList);
        setFilteredProjects(projectsList); // Initialize filtered projects
      } catch (error) {
        console.log("Project Fetch Error:", error.message || error);
      }
    };

    fetchProjects();
  }, []);

  // NEW: Filter projects based on search term
  useEffect(() => {
    const filtered = projectsData.filter(
      (project) =>
        project.name?.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
        project.id?.toLowerCase().includes(projectSearchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);

    // Show search results only if there's a search term
    setShowSearchResults(projectSearchTerm.length > 0);
  }, [projectSearchTerm, projectsData]);

  // NEW: Handle project search
  const handleProjectSearch = (e) => {
    const value = e.target.value;
    setProjectSearchTerm(value);
    if (value) {
      setSelectedProjectId(""); // Clear selection when searching
    }
  };

  // NEW: Handle project selection from search
  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setProjectSearchTerm("");
    setShowSearchResults(false);
  };

  // Render Project Selection with Search
  const renderProjectSelection = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Select Project
      </h3>

      <div className="relative">
        {/* Search Input with Dropdown */}
        <div className="flex items-center border rounded px-2 py-1">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            className="flex-1 text-sm focus:outline-none py-1"
            placeholder="Search or select a project..."
            value={projectSearchTerm}
            onChange={handleProjectSearch}
            onFocus={() => setShowSearchResults(true)}
          />
          <button
            type="button"
            className="ml-2 text-gray-500 focus:outline-none"
            onClick={() => setShowSearchResults((prev) => !prev)}
          >
            ▾
          </button>
        </div>

        {/* Dropdown results */}
        {showSearchResults && (
          <div className="absolute z-50 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto mt-1">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                  onClick={() => handleProjectSelect(project.id)}
                >
                  {project.name || project.id}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No projects found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Fetch Folders with nested structure
  const fetchFolders = async () => {
    if (!selectedProjectId) {
      setFolderData([]);
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = `/api/projects/${selectedProjectId}/folders?include_children=true&nested=true`;
      const foldersRes = await get(endpoint);
      const foldersData = await foldersRes.json();

      // Normalize structure
      const normalize = (folders) =>
        folders.map((f) => ({
          ...f,
          subFolders: f.subFolders || f.children || [],
          subFoldersCount: (f.subFolders || f.children || []).length,
        }));

      setFolderData(Array.isArray(foldersData) ? normalize(foldersData) : []);
    } catch (error) {
      console.error("Folder Fetch Error:", error);
      setFolderData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [selectedProjectId]);

  // Call fetch on folder change
  useEffect(() => {
    if (selectedFolder) {
      // Reset filters when folder changes
      setFilters({
        type: null,
        priority: null,
        state: null,
        searchTerm: "",
      });
      fetchFolderTestCases(selectedFolder);
    }
  }, [selectedFolder]);

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

      setIsCreateFolderModalOpen(false);
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
    setIsCreateFolderModalOpen(true);
    setActiveMenuFolder(null);
  };

  // Delete Folder
  const handleDeleteFolder = async (folderId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this folder and all its contents?"
      )
    )
      return;
    try {
      setIsLoading(true);
      setActiveMenuFolder(null);
      const endpoint = `/api/folders/${folderId}`;
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
  const handleEditFolder = (folderId) => {
    const folderToEdit = findFolderById(folderData, folderId);
    if (folderToEdit) {
      setFolderName(folderToEdit.name);
      setEditingFolderId(folderId);
      setIsEditFolderModalOpen(true);
      setActiveMenuFolder(null);
    }
  };

  const handleUpdateFolder = async () => {
    if (!editingFolderId || !folderName.trim()) {
      alert("Please provide a folder name");
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = `/api/folders/${editingFolderId}`;
      const payload = { name: folderName.trim() };
      const res = await patch(endpoint, payload);
      if (!res.ok) throw new Error("Failed to update folder");

      await fetchFolders();
      setIsEditFolderModalOpen(false);
      setEditingFolderId(null);
      setFolderName("");
    } catch (err) {
      console.error("Update folder error:", err);
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
    navigator.clipboard.writeText(url).then(() => {
      alert("Folder URL copied!");
      setActiveMenuFolder(null);
    });
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
          onClick={() => handleSelectedFolder(folder)}
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

  const renderFolderTree = () => {
    if (isLoading) {
      return <div className="text-gray-500 text-sm">Loading folders...</div>;
    }
    return folderData.map((folder) => renderFolder(folder, 0));
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
        <div className="w-1/4 flex flex-col gap-4 relative">
          {" "}
          {/* Added relative for positioning */}
          {/* UPDATED: Project Selection with Search */}
          {renderProjectSelection()}
          {/* Rest of your existing folder structure code remains the same */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Folder Structure
              </h3>
              <button
                onClick={() => {
                  setParentFolderId(null);
                  setIsCreateFolderModalOpen(true);
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
              ) : folderData.length > 0 ? (
                renderFolderTree()
              ) : (
                <div className="text-gray-500 text-sm">
                  {isLoading
                    ? "Loading folders..."
                    : "No folders available for this project."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column for Test Cases (placeholder) */}
        {/* Swamy Changes */}
        <div className="w-full bg-white rounded-lg shadow-sm border p-4">
          <FolderTestCase
            selectedFolder={selectedFolder}
            folderTestCases={folderTestCases}
            handleEditTestCase={handleEditTestCase}
            handleDeleteTestCase={handleDeleteTestCase}
            handleCreateClick={() => {
              setEditingTestCaseId(null);
              onClose();
            }}
            handleSearch={handleSearch}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Test Case Modal */}
      <Modalpopup
        open={openCreateTestCase}
        onClose={onClose}
        height="700px"
        width="1200px"
        //  ${selectedFolder?.name}
        header={`${
          editingTestCaseId ? "Edit Test Case: " : "Create Test Case: "
        } ${selectedFolder?.name}`}
        content={
          <CreateTestCase
            addStep={addStep}
            formData={formData}
            errors={errors}
            handleStepAdd={handleStepAdd}
            handleStepChange={handleStepChange}
            handleRemoveStep={handleRemoveStep}
            handleInputChange={handleInputChange}
            selectedProjectId={selectedProjectId}
            handleSelectedTags={setSelectedTags}
          />
        }
        buttons={
          <div className="flex gap-2">
            <CommonButton variant="outlined" onClick={onClose}>
              Cancel
            </CommonButton>
            <CommonButton variant="contained" onClick={handleSave}>
              Save
            </CommonButton>
          </div>
        }
      />

      {/* Folder Creation Modal */}
      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {parentFolderId ? "Create Sub Folder" : "Create Folder"}
              </h2>
              <button
                onClick={() => {
                  setIsCreateFolderModalOpen(false);
                  setParentFolderId(null);
                  setFolderName("");
                }}
                disabled={isLoading}
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
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters and spaces
                  setFolderName(value);
                }}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsCreateFolderModalOpen(false);
                  setParentFolderId(null);
                  setFolderName("");
                }}
                disabled={isLoading}
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

      {/* Edit Folder Modal */}
      {isEditFolderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Folder</h2>
              <button
                onClick={() => {
                  setIsEditFolderModalOpen(false);
                  setEditingFolderId(null);
                  setFolderName("");
                }}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditFolderModalOpen(false);
                  setEditingFolderId(null);
                  setFolderName("");
                }}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateFolder}
                disabled={isLoading || !folderName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
