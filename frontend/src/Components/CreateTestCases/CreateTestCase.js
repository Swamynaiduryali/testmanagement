import React, { useState, useEffect } from "react";

const CreateTestCaseComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [configActiveTab, setConfigActiveTab] = useState("testCaseFields");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("create");
  const [isCreatingField, setIsCreatingField] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isEditingField, setIsEditingField] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [newField, setNewField] = useState({ name: "", type: "String", placeholder: "" });
  const [editField, setEditField] = useState({ id: null, name: "", values: [], projects: "", defaultValue: "" });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projectSearch, setProjectSearch] = useState("");
  const [applyToFuture, setApplyToFuture] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    preconditions: "",
    owner: "Myself (Lucky Ind)",
    state: "Active",
    priority: "Medium",
    typeOfTestCase: "Acceptance",
    automationStatus: "Not Automated",
    tags: "",
    template: "Test Case Steps",
  });

  const [steps, setSteps] = useState([{ id: 1, step: "", result: "" }]);
  const [createAnother, setCreateAnother] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [testCaseFields, setTestCaseFields] = useState([
    {
      id: 1,
      name: "Priority",
      values: ["High", "Medium", "Low", "Critical"],
      projects: "All Projects",
      type: "System",
      defaultValue: "Medium",
    },
    {
      id: 2,
      name: "Type",
      values: [
        "Acceptance",
        "Accessibility",
        "Compatibility",
        "Destructive",
        "Functional",
        "Other",
        "Performance",
        "Regression",
        "Security",
        "Smoke & Sanity",
        "Usability",
      ],
      projects: "All Projects",
      type: "System",
      defaultValue: "Acceptance",
    },
    {
      id: 3,
      name: "State",
      values: ["Active", "Draft", "In Review"],
      projects: "All Projects",
      type: "System",
      defaultValue: "Active",
    },
  ]);

  const projects = [
    { id: "P001", title: "Project Alpha" },
    { id: "P002", title: "Beta Project" },
    { id: "P003", title: "Gamma Initiative" },
    { id: "P004", title: "Delta Task" },
    // Add more projects as needed for testing
  ];

  const priorityOptions = [
    { value: "Critical", label: "! Critical" },
    { value: "High", label: "^ High" },
    { value: "Medium", label: "- Medium" },
    { value: "Low", label: "v Low" },
  ];

  const testCaseTypes = [
    "Acceptance",
    "Accessibility",
    "Compatibility",
    "Destructive",
    "Functional",
    "Other",
    "Performance",
    "Regression",
    "Security",
    "Smoke & Sanity",
    "Usability",
  ];

  const stateOptions = [
    { value: "Active", label: "+ Active" },
    { value: "Draft", label: "# Draft" },
    { value: "In Review", label: "@ In Review" },
    { value: "Outdated", label: "x Outdated" },
    { value: "Rejected", label: "- Rejected" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (id, field, value) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps((prev) => [...prev, { id: newId, step: "", result: "" }]);
  };

  const removeStep = (id) => {
    if (steps.length > 1) {
      setSteps((prev) => prev.filter((step) => step.id !== id));
    }
  };

  const addSharedStep = () => {
    console.log("Add shared step clicked");
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      preconditions: "",
      owner: "Myself (Lucky Ind)",
      state: "Active",
      priority: testCaseFields.find((f) => f.name === "Priority")?.defaultValue || "Medium",
      typeOfTestCase: testCaseFields.find((f) => f.name === "Type")?.defaultValue || "Acceptance",
      automationStatus: "Not Automated",
      tags: "",
      template: "Test Case Steps",
    });
    setSteps([{ id: 1, step: "", result: "" }]);
    setUploadedFiles([]);
    setCreateAnother(false);
  };

  const hideForm = () => {
    setIsVisible(false);
    setCurrentView("create");
    resetForm();
  };

  const handleCreate = () => {
    if (
      !formData.title ||
      !formData.owner ||
      !formData.state ||
      !formData.priority ||
      !formData.typeOfTestCase ||
      !formData.automationStatus
    ) {
      alert("⚠️ Please fill all required fields");
      return;
    }
    console.log("✅ Creating test case:", { formData, steps, uploadedFiles });
    if (createAnother) {
      resetForm();
    } else {
      hideForm();
    }
  };

  useEffect(() => {
    const findAndAttachListener = () => {
      const buttons = document.querySelectorAll("button");
      const createButton = Array.from(buttons).find((el) =>
        el.textContent && el.textContent.trim().toLowerCase().includes("create test")
      );

      if (createButton) {
        console.log("Found button:", createButton.textContent);
        const handleClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsVisible(true);
          if (!isVisible) {
            resetForm();
          }
        };

        createButton.addEventListener("click", handleClick);
        return () => createButton.removeEventListener("click", handleClick);
      } else {
        console.log("No 'Create Test' button found in the DOM.");
      }
    };

    const cleanup = findAndAttachListener();
    return cleanup;
  }, [isVisible]);

  const handleNewFieldChange = (e) => {
    const { name, value } = e.target;
    setNewField((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditField((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddValue = () => {
    if (editField.newValue && !editField.values.includes(editField.newValue)) {
      setEditField((prev) => ({
        ...prev,
        values: [...prev.values, prev.newValue],
        newValue: "",
      }));
    }
  };

  const handleDefaultChange = (e) => {
    setEditField((prev) => ({ ...prev, defaultValue: e.target.value }));
  };

  const saveNewField = () => {
    if (newField.name) {
      const newId = testCaseFields.length > 0 ? Math.max(...testCaseFields.map((f) => f.id)) + 1 : 1;
      setTestCaseFields((prev) => [
        ...prev,
        {
          id: newId,
          name: newField.name,
          values: [],
          projects: "All Projects",
          type: newField.type,
          defaultValue: "",
          placeholder: newField.placeholder,
        },
      ]);
      setNewField({ name: "", type: "String", placeholder: "" });
      setIsCreatingField(false);
    } else {
      alert("Please fill the Name field.");
    }
  };

  const saveEditedField = () => {
    if (editField.name && editField.values.length > 0) {
      setTestCaseFields((prev) =>
        prev.map((field) =>
          field.id === editField.id
            ? {
                ...field,
                name: editField.name,
                values: editField.values,
                projects: editField.projects,
                defaultValue: editField.defaultValue,
              }
            : field
        )
      );
      if (editField.name === "Priority") {
        setFormData((prev) => ({ ...prev, priority: editField.defaultValue }));
      } else if (editField.name === "Type") {
        setFormData((prev) => ({ ...prev, typeOfTestCase: editField.defaultValue }));
      }
      setIsEditingField(false);
    } else {
      alert("Please fill both Title and Values fields.");
    }
  };

  const toggleMenu = (id) => {
    setIsMenuOpen(isMenuOpen === id ? null : id);
  };

  const toggleEditMenu = () => {
    setEditMenuOpen(!editMenuOpen);
  };

  const handleEditClick = (field) => {
    setEditField({
      id: field.id,
      name: field.name,
      values: field.values,
      projects: field.projects,
      defaultValue: field.defaultValue,
      newValue: "",
    });
    setIsEditingField(true);
    setIsMenuOpen(null);
  };

  const handleConfigureClick = (field) => {
    console.log("Configure Fields clicked for:", field.name);
    setIsMenuOpen(null);
  };

  const handleProjectsClick = (value) => {
    const field = testCaseFields.find((f) => f.id === editField.id);
    if (field) {
      setSelectedValue(value);
      setSelectedProjects(field.projects === "All Projects" ? projects.map(p => p.id) : []);
      setIsProjectModalOpen(true);
    }
  };

  const handleProjectSelection = (projectId) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProjects(projects.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    setSelectedProjects([]);
  };

  const handleUpdateProjects = () => {
    if (selectedProjects.length === 0 && !applyToFuture) {
      alert("Please select at least one project or enable 'Apply to All Future Projects'.");
      return;
    }
    const field = testCaseFields.find((f) => f.id === editField.id);
    if (field && selectedValue) {
      setTestCaseFields((prev) =>
        prev.map((f) =>
          f.id === field.id
            ? {
                ...f,
                values: f.values.map((v) =>
                  v === selectedValue ? (selectedProjects.length > 0 ? selectedProjects.join(", ") : "0 Projects") : v
                ),
                projects: selectedProjects.length > 0 ? selectedProjects.join(", ") : "0 Projects",
              }
            : f
        )
      );
      setIsProjectModalOpen(false);
      alert("Project assignments updated successfully!");
    }
  };

  const filteredFields = testCaseFields.filter(
    (field) =>
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.values.join(",").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.id.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.title.toLowerCase().includes(projectSearch.toLowerCase())
  );

  if (!isVisible) {
    return (
      <button
        onClick={() => {
          setIsVisible(true);
          resetForm();
          setCurrentView("create");
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Open Create Test Case
      </button>
    );
  }

  if (currentView === "configure") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView("create")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back To All Fields
              </button>
              <h2 className="text-xl font-semibold text-gray-800">Test Case Field Configuration</h2>
            </div>
            <button onClick={hideForm} className="text-gray-600 hover:text-gray-800">
              ✖
            </button>
          </div>

          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setConfigActiveTab("testCaseFields")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  configActiveTab === "testCaseFields"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                [F] Test Case Fields
              </button>
              <button
                onClick={() => setConfigActiveTab("testResultFields")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  configActiveTab === "testResultFields"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                [C] Test Result Fields
              </button>
            </nav>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {!isCreatingField && !isEditingField && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-96">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                      type="text"
                      placeholder="Search field by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setIsCreatingField(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    + Create Field
                  </button>
                </div>
                <div className="bg-white rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-6">FIELDS</th>
                        <th className="text-left py-3 px-6">PROJECTS</th>
                        <th className="text-left py-3 px-6">TYPE</th>
                        <th className="text-right py-3 px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFields.length > 0 ? (
                        filteredFields.map((field) => (
                          <tr key={field.id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">{field.name}</div>
                                <div className="text-sm text-gray-500 mt-1">{field.values.join(", ")}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {field.projects === "All Projects" ? (
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleProjectsClick(field.values[0]);
                                  }}
                                  className="text-blue-500 hover:text-blue-700 underline"
                                >
                                  All Projects
                                </a>
                              ) : (
                                field.projects
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  field.type === "System" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                }`}
                              >
                                {field.type}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="relative">
                                <button onClick={() => toggleMenu(field.id)} className="text-gray-500 hover:text-gray-700">
                                  ⋮
                                </button>
                                {isMenuOpen === field.id && (
                                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                                    <button
                                      onClick={() => handleConfigureClick(field)}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Configure Fields
                                    </button>
                                    <button
                                      onClick={() => handleEditClick(field)}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-4 text-center text-gray-500">
                            No fields match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {isCreatingField && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Create Field</h2>
                    <button
                      onClick={() => setIsCreatingField(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ✖
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Type →</label>
                      <select
                        name="type"
                        value={newField.type}
                        onChange={handleNewFieldChange}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="String">String</option>
                        <option value="Number">Number</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Date">Date</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Field Name* <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={newField.name}
                        onChange={handleNewFieldChange}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter field name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Placeholder Text</label>
                      <input
                        type="text"
                        name="placeholder"
                        value={newField.placeholder}
                        onChange={handleNewFieldChange}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter placeholder text (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Link Dataset to Project</label>
                      <div className="flex items-center gap-2">
                        <span>📁 0 Projects</span>
                        <a href="#" className="text-blue-500 hover:text-blue-700 underline">
                          [Link]
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setIsCreatingField(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNewField}
                      className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                        !newField.name ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!newField.name}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isEditingField && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Field</h2>
                    <div className="relative">
                      <button onClick={toggleEditMenu} className="text-gray-500 hover:text-gray-700">
                        ⋮
                      </button>
                      {editMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                          <button
                            onClick={() => setEditMenuOpen(false)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Title</label>
                      <div className="flex flex-col">
                        {editField.values.map((value) => (
                          <div key={value} className="flex items-center py-1">
                            {value}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Projects</label>
                      <div className="flex flex-col">
                        {editField.values.map((value) => (
                          <div key={value} className="flex items-center py-1">
                            <span
                              className="cursor-pointer text-blue-500 hover:text-blue-700"
                              onClick={() => handleProjectsClick(value)}
                            >
                              {editField.projects === "All Projects" ? "All Projects" : "0 Projects"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Default</label>
                      <div className="flex flex-col gap-2">
                        {editField.values.map((value) => (
                          <div key={value} className="flex items-center py-1">
                            <input
                              type="radio"
                              name="defaultValue"
                              value={value}
                              checked={editField.defaultValue === value}
                              onChange={handleDefaultChange}
                              className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm mb-1">Enter Value Name</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="newValue"
                          value={editField.newValue || ""}
                          onChange={handleEditFieldChange}
                          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new value"
                        />
                        <button
                          onClick={handleAddValue}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsEditingField(false);
                        setEditMenuOpen(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEditedField}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isProjectModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-labelledby="project-modal-title">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 id="project-modal-title" className="text-xl font-semibold text-gray-800">Value</h2>
                    <button onClick={() => setIsProjectModalOpen(false)} className="text-gray-600 hover:text-gray-800" aria-label="Close">
                      ✖
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Value</label>
                    <input
                      type="text"
                      value={selectedValue || ""}
                      readOnly
                      className="w-full border rounded-md p-2 bg-gray-200 text-gray-700"
                      aria-readonly="true"
                    />
                  </div>
                  <div className="mb-4 text-sm text-gray-600">Selected Projects: {selectedProjects.length} Projects</div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={applyToFuture}
                        onChange={(e) => setApplyToFuture(e.target.checked)}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                        id="apply-future"
                        aria-labelledby="apply-future-label"
                      />
                      <label htmlFor="apply-future" id="apply-future-label" className="text-sm">
                        Apply to All Future Projects
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This option allows you to use this value to all future projects</p>
                  </div>
                  <div className="mb-4 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                      type="text"
                      placeholder="Search projects by title/ID"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                      aria-label="Search projects"
                    />
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-2 px-4">ID</th>
                          <th className="text-left py-2 px-4">TITLE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((project) => (
                          <tr
                            key={project.id}
                            className={`border-b hover:bg-gray-50 ${selectedProjects.includes(project.id) ? "bg-gray-100" : ""}`}
                          >
                            <td className="py-2 px-4">
                              <input
                                type="checkbox"
                                checked={selectedProjects.includes(project.id)}
                                onChange={() => handleProjectSelection(project.id)}
                                className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                                aria-label={`Select project ${project.title}`}
                              />
                            </td>
                            <td className="py-2 px-4">{project.id}</td>
                            <td className="py-2 px-4">{project.title}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredProjects.length === 0 && (
                      <div className="text-center text-gray-500 py-4">No projects match your search.</div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setIsProjectModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProjects}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      aria-label="Update"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={() => setCurrentView("create")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create Test Case</h2>
          <button onClick={hideForm} className="text-gray-600 hover:text-gray-800">
            ✖
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter test case name"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-48">
                <label className="block text-sm mb-1">Template</label>
                <select
                  value={formData.template}
                  onChange={(e) => handleInputChange("template", e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option>Test Case Steps</option>
                  <option>Basic Template</option>
                  <option>Advanced Template</option>
                  <option>Custom Template</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Description</label>
              <textarea
                rows={4}
                placeholder="Write in brief about the test"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Preconditions</label>
              <textarea
                rows={4}
                placeholder="Define any preconditions"
                value={formData.preconditions}
                onChange={(e) => handleInputChange("preconditions", e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Steps and Results</h3>
              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-2 mb-2">
                  <div className="flex items-center gap-1 w-10">
                    <span className="text-gray-500">||</span>
                    <span className="text-sm font-medium">
                      {steps.findIndex((s) => s.id === step.id) + 1}
                    </span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Step</label>
                      <textarea
                        rows={3}
                        placeholder="Details of the step"
                        value={step.step}
                        onChange={(e) => handleStepChange(step.id, "step", e.target.value)}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Result</label>
                      <textarea
                        rows={3}
                        placeholder="Expected Result"
                        value={step.result}
                        onChange={(e) => handleStepChange(step.id, "result", e.target.value)}
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(step.id)}
                      className="mt-6 p-2 text-red-500 hover:text-red-700"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={addStep}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  + Add Step
                </button>
                <button
                  onClick={addSharedStep}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  ➤ Add Shared Step
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Attachments</h3>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="file-upload"
                  accept="*/*"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  ⬆ Upload Files
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">Max. file size: 50 MB | Max. files: 10</p>
              {uploadedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={createAnother}
                onChange={(e) => setCreateAnother(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500"
              />
              <label className="text-sm">Create another</label>
            </div>
          </div>

          <div className="w-80 bg-gray-50 p-6 border-l overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Test Case Fields</h3>
              <button
                onClick={() => setCurrentView("configure")}
                className="text-blue-500 hover:text-blue-700"
              >
                ⚙ Configure
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Owner <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.owner}
                onChange={(e) => handleInputChange("owner", e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option>Myself (Lucky Ind)</option>
                <option>Other User</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select priority</option>
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Type of Test Case <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.typeOfTestCase}
                onChange={(e) => handleInputChange("typeOfTestCase", e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {testCaseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Automation Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.automationStatus}
                onChange={(e) => handleInputChange("automationStatus", e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option>Not Automated</option>
                <option>Automated</option>
                <option>To be Automated</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Tags</label>
              <input
                type="text"
                placeholder="Add tags and hit +"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <p className="text-sm mb-2">Setup your requirement management tool</p>
              <div className="grid grid-cols-2 gap-2">
                {["Jira", "Azure", "Asana", "Linear", "ClickUp", "DevRev"].map((tool) => (
                  <button
                    key={tool}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200"
                  >
                    <span className="w-5 h-5 bg-gray-300 rounded flex items-center justify-center text-xs font-bold">
                      {tool[0]}
                    </span>
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={hideForm}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export { CreateTestCaseComponent as CreateTestCase };
export default CreateTestCaseComponent;