import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // <-- We need this
import { Folder } from "lucide-react";
import { get, post, patch } from "../../APICRUD/apiClient";
//Swamy Changes
import { FolderTestCase } from "./FolderTestCase";
import { CommonButton } from "../../CommonComponents/Button";
import { CreateTestCase } from "./CreateTestCase";
import { Modalpopup } from "../../CommonComponents/Modalpopup";

export const TestCase = () => {
  const GlobalOwnerId = "598ff3fb-cd06-430d-8cce-dc3e5ebe3900";
  // --- Get the passed data from the navigation ---
  const location = useLocation();
  const initialProjectId = location.state?.projectDbId || ""; // Get the ID, or use empty string if none

  const [folderData, setFolderData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  // Swamy changes --- Start with the ID passed from the Projects screen ---
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openCreateTestCase, setOpenCreateTestCase] = useState(false);
  const [folderTestCases, setFolderTestCases] = useState(null);
  const [editingTestCaseId, setEditingTestCaseId] = useState(null);

  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      preconditions: "",
      owner: "OWNER1",
      state: "ACTIVE",
      priority: "LOW",
      typeOfTestCase: "FUNCTIONAL",
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
  };

  //formData by clicking on save button at the modalpop up state lifiting from the CreateTestCase
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
    typeOfTestCase: "FUNCTIONAL",
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

    // Validate step and expectedResult fields on change
    setErrors((prev) => {
      const newErrors = { ...prev };
      const stepErrors = newErrors.steps ? [...newErrors.steps] : [];

      // Ensure array length matches steps
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
      // Validate title field
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

  const fetchFolderTestCases = async (folder) => {
    if (!folder) {
      setFolderTestCases(null);
      return;
    }
    try {
      const res = await get(
        `/api/projects/${folder.project_id}/test-cases?folder_id=${folder.id}&page=1&page_size=20`
      );
      const json = await res.json();
      setFolderTestCases(json.data);
    } catch (error) {
      setFolderTestCases(null);
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
        await patch(`/api/test-cases/${editingTestCaseId}`, detailsPayload);
        await patch(`/api/test-cases/${editingTestCaseId}`, stepsPayload);

        console.log("Test case updated successfully");
      } else {
        const payload = {
          title: formData.title,
          description: formData.description,
          preconditions: formData.preconditions,
          folder_id: selectedFolder?.id || "",
          owner_id: GlobalOwnerId,
          state: formData.state,
          priority: formData.priority,
          type: formData.typeOfTestCase,
          automation_status: formData.automation_status,
          steps: addStep.map((step, index) => ({
            index: index + 1,
            step: step.step,
            expected: step.expectedResult,
          })),
          tag_ids: ["b6e2853c-a6ed-4957-b508-6a8efb46eb98"],
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

  //edit test case
  const handleEditTestCase = async (testCase) => {
    console.log(testCase.folder_id);
    setFormData({
      title: testCase.title || "",
      description: testCase.description || "",
      preconditions: testCase.preconditions || "",
      owner: testCase.owner?.display_name || "OWNER1",
      state: testCase.state || "ACTIVE",
      priority: testCase.priority || "LOW",
      typeOfTestCase: testCase.type || "FUNCTIONAL",
      automation_status: testCase.automation_status || "NOT_AUTOMATED",
    });

    try {
      const res = await get(`/api/test-cases/${testCase.folder_id}`);
      const json = await res.json();
      const steps = json?.data?.steps || json?.steps || [];

      setAddStep(
        steps.length
          ? steps.map((step, index) => ({
              id: step.id || index + 1,
              step: step.step || "",
              expectedResult: step.expected || "",
              actualResult: step.actual || "",
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

  // 1. Fetch Projects (This is only needed to fill the dropdown list)
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
        const endpoint = `/api/projects/${selectedProjectId}/folders`;

        const foldersRes = await get(endpoint);
        const foldersData = await foldersRes.json();

        setFolderData(foldersData);
      } catch (error) {
        setFolderData([]);
      }
    };

  useEffect(() => {
    fetchFolders();
  }, [selectedProjectId]); // Re-run whenever selectedProjectId changes

  // Call fetch on folder change
  useEffect(() => {
    fetchFolderTestCases(selectedFolder);
  }, [selectedFolder]);

  const renderFolderTree = () => {
    // ... (rest of the renderFolderTree function remains the same)
    // Swamy Changes
    return folderData.map((folder) => (
      <div
        key={folder.id}
        className="flex items-center py-2 px-3 hover:bg-blue-50 cursor-pointer rounded"
        onClick={() => handleSelectedFolder(folder)}
      >
        <Folder className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-sm text-gray-700">{folder.name}</span>
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

        {/* Right column for Test Cases (placeholder) */}
        {/* Swamy Changes */}
        <div className="flex flex-col w-full">
          <div className="w-full flex justify-end p-4">
            <CommonButton
              variant="contained"
              bgColor={"green"}
              onClick={() => onClose()}
            >
              Create
            </CommonButton>
          </div>
          <div className="w-full bg-white rounded-lg shadow-sm border p-4">
            <FolderTestCase
              selectedFolder={selectedFolder}
              folderTestCases={folderTestCases}
              handleEditTestCase={handleEditTestCase}
            />
          </div>
          {/* <CreateTestCase /> */}
        </div>
      </div>

      {/* swamy changes */}
      <Modalpopup
        open={openCreateTestCase}
        onClose={onClose}
        height="700px"
        width="1200px"
        header={<h1>Create Test Case</h1>}
        content={
          <CreateTestCase
            addStep={addStep}
            formData={formData}
            errors={errors}
            handleStepAdd={handleStepAdd}
            handleStepChange={handleStepChange}
            handleRemoveStep={handleRemoveStep}
            handleInputChange={handleInputChange}
          />
        } //inside this we are handling the save functionality right that functionality should work to
        //this modal pop up button component do you got me
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
    </div>
  );
};
