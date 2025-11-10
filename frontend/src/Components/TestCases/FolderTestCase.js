import { CommonButton } from "../../CommonComponents/Button";
import { PositionedMenu } from "../../CommonComponents/PositionedMenu";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Define filter options
const TEST_CASE_TYPES = [
  { value: "FUNCTIONAL", label: "Functional" },
  { value: "REGRESSION", label: "Regression" },
  { value: "SMOKE", label: "Smoke" },
  { value: "INTEGRATION", label: "Integration" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES = [
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const STATES = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

const FilterDropdown = ({ options, selectedValue, onSelect, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition"
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] max-h-60 overflow-auto">
          <button
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
              !selectedValue ? "bg-blue-50 text-blue-600 font-medium" : ""
            }`}
          >
            All
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                selectedValue === option.value
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTestCase = ({
  selectedFolder,
  folderTestCases,
  handleEditTestCase,
  handleDeleteTestCase,
  handleCreateClick,
  handleSearch,
  filters,
  handleFilterChange,
  handleViewTestCase,
}) => {
  if (!selectedFolder) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please select a folder from the left to view its test cases.
      </div>
    );
  }

  const name = selectedFolder.name;
  const activeFilters = [];

  if (filters.type) activeFilters.push(`Type: ${filters.type}`);
  if (filters.priority) activeFilters.push(`Priority: ${filters.priority}`);
  if (filters.state) activeFilters.push(`State: ${filters.state}`);
  if (filters.searchTerm) activeFilters.push(`Search: "${filters.searchTerm}"`);

  let emptyMessage = "";

  if (folderTestCases?.length === 0 && activeFilters.length === 0) {
    emptyMessage = "No test cases exist in this folder.";
  } else if (activeFilters.length > 0 && folderTestCases?.length === 0) {
    emptyMessage = `No test cases match the selected filters (${activeFilters.join(
      ", "
    )}).`;
  } else if (filters.searchTerm && folderTestCases?.length === 0) {
    emptyMessage = `No test cases match your search criteria (${filters.searchTerm}).`;
  } else {
    emptyMessage = "No test cases to display.";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {/* Left side: Heading */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold">{name}</h1>
        </div>

        {/* Right side: Search + Create Button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border-2 rounded-md p-1 w-48 h-[40px]"
            placeholder="Search by Title"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <CommonButton
            variant="contained"
            bgColor="green"
            onClick={handleCreateClick}
          >
            Create
          </CommonButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FilterDropdown
                  options={TEST_CASE_TYPES}
                  selectedValue={filters.type}
                  onSelect={(value) => handleFilterChange("type", value)}
                  label="Type"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FilterDropdown
                  options={PRIORITIES}
                  selectedValue={filters.priority}
                  onSelect={(value) => handleFilterChange("priority", value)}
                  label="Priority"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FilterDropdown
                  options={STATES}
                  selectedValue={filters.state}
                  onSelect={(value) => handleFilterChange("state", value)}
                  label="State"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {folderTestCases && folderTestCases.length > 0 ? (
              folderTestCases.map((testCase) => (
                <tr key={testCase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {testCase.key}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {testCase.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testCase.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testCase.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testCase.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testCase.owner?.display_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <PositionedMenu
                      actions={[
                        {
                          label: "View",
                          icon: "mdi:eye-outline", // Using a common eye icon
                          onClick: () => handleViewTestCase(testCase),
                        },
                        {
                          label: "Edit",
                          icon: "mdi:pencil-outline",
                          onClick: () => handleEditTestCase(testCase),
                        },
                        {
                          label: "Delete",
                          icon: "mdi:trash-outline",
                          onClick: () =>
                            handleDeleteTestCase(
                              testCase.id,
                              testCase.project_id
                            ),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
