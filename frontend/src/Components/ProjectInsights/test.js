import { useState } from "react";
import { Icon } from "@iconify/react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

// --- Mock Data ---

const allFilters = [
  "Test Run Owners",
  "Test run tags",
  "Test Run Types",
  "Unique Test Run Name",
  "Branch",
  "Test Case Status",
  "CI runs only",
];

const testData = [
  { name: "Passed", value: 238, color: "#22c55e" }, // green
  { name: "Untested", value: 85, color: "#a3e635" }, // lime
  { name: "Failed", value: 100, color: "#ef4444" }, // red
  { name: "Skipped", value: 35, color: "#9ca3af" }, // gray
  { name: "Retest", value: 20, color: "#facc15" }, // yellow
  { name: "Blocked", value: 12, color: "#3b82f6" }, // blue
];

// --- Custom Chart Components ---

/**
 * Custom tooltip component for the PieChart.
 * Displays the status, count, and percentage on hover.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = testData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(2);

    return (
      <div className="bg-gray-800 text-white p-2 rounded-md text-xs font-semibold shadow-lg">
        <p>
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: data.color }}
          ></span>
          {`${data.name}: ${data.value} (${percentage}%)`}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Custom legend component for the PieChart.
 * Displays the status, count, and percentage in a list format.
 */
const CustomLegend = () => {
  const total = testData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="ml-4">
      {testData.map((entry, index) => {
        const percentage = ((entry.value / total) * 100).toFixed(2);
        return (
          <p key={`legend-${index}`} className="flex items-center text-sm mb-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-gray-700 font-medium mr-6">{entry.name}</span>
            <span className="ml-auto text-gray-600">
              {entry.value}
              <span className="ml-1 text-xs text-gray-500">
                ({percentage}%)
              </span>
            </span>
          </p>
        );
      })}
    </div>
  );
};

/**
 * Content to display in the center of the doughnut chart.
 * Shows the total number of test cases.
 */
const CenterContent = ({ total }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
    <p className="text-2xl font-bold">{total}</p>
    <p className="text-xs text-gray-500">Total Test Cases</p>
  </div>
);

// --- FiltersPanel Component ---
const FiltersPanel = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectFilter, setSelectFilter] = useState([
    "Test Run Owners",
    "Unique Test Run Name",
  ]);

  const addFilter = (f) => {
    // Only add if not already selected
    if (!selectFilter.includes(f)) {
      setSelectFilter((prev) => [...prev, f]);
    }
    // Closes the dropdown after selecting, regardless of state before
    setIsFilterOpen(false);
    setSearchFilter(""); // Clear search
  };

  const removeFilter = (f) => {
    setSelectFilter((prev) => prev.filter((item) => item !== f));
  };

  const clearAll = () => {
    setSelectFilter([]);
    setIsFilterOpen(false);
  };

  const filteredAvailableFilters = allFilters.filter((f) =>
    f.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-3">
        <h1 className="font-semibold">Filters</h1>
        <button
          onClick={clearAll}
          disabled={!selectFilter.length}
          className="text-gray-500 text-sm hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear all
        </button>
      </div>

      {/* Selected Filters List */}
      <div className="flex flex-col gap-3">
        {selectFilter.map((f) => {
          return (
            <div key={f}>
              <h1 className="text-sm font-medium mb-1">{f}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-400 rounded-md p-1 flex-1 relative h-9">
                  {/* Special input decoration for 'Unique Test Run Name' */}
                  {f === "Unique Test Run Name" && (
                    <div className="flex items-center border-r pr-2 mr-2">
                      <Icon
                        icon="ic:outline-sort"
                        className="text-gray-600 w-5 h-5"
                      />
                      <Icon
                        icon="fluent-mdl2:scroll-up-down"
                        className="text-gray-600 w-3 h-3"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    className="focus:outline-none flex-1 text-sm pl-1 bg-white"
                  />
                  {/* General scroll/dropdown icon for all inputs (placeholder for dropdown) */}
                  <Icon
                    icon="fluent-mdl2:scroll-up-down"
                    className="text-gray-500 absolute right-1.5 top-1/2 -translate-y-1/2"
                  />
                </div>
                {/* Remove Filter Button */}
                <button
                  className="border border-gray-400 rounded-md hover:bg-gray-100 h-9 w-9 flex items-center justify-center"
                  onClick={() => removeFilter(f)}
                >
                  <Icon icon="ic:outline-delete" className="text-gray-600 w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Filter Button and Import Link */}
      <div className="flex items-center gap-4 mt-4 mb-4">
        <div className="relative inline-block z-10">
          <button
            className="text-sm px-4 py-1 border border-gray-500 rounded-md flex items-center justify-between gap-1 hover:bg-gray-50"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span className="text-gray-700 font-medium">Add filter</span>
            {isFilterOpen ? (
              <Icon icon="ep:arrow-up" className="text-gray-700 w-3 h-3" />
            ) : (
              <Icon icon="ep:arrow-down" className="text-gray-700 w-3 h-3" />
            )}
          </button>
          {isFilterOpen && (
            <div className="border border-gray-400 shadow-xl rounded-md w-64 absolute top-full mt-2 left-0 bg-white z-20">
              <div className="p-2">
                {/* Search Bar */}
                <div className="flex items-center border border-gray-400 rounded-md focus-within:border-blue-500">
                  <Icon
                    icon="material-symbols:search-rounded"
                    className="text-gray-500 ml-2"
                  />
                  <input
                    type="text"
                    className="focus:outline-none flex-1 text-sm py-2 px-1"
                    placeholder="search filter"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter List */}
              <ul className="text-sm p-1 border-t border-gray-200 pt-1 max-h-48 overflow-y-auto">
                {filteredAvailableFilters.length > 0 ? (
                  filteredAvailableFilters.map((filter) => {
                    const isSelected = selectFilter.includes(filter);
                    return (
                      <li
                        key={filter}
                        className={`flex items-center justify-between p-1 cursor-pointer rounded-sm ${
                          isSelected ? "bg-gray-100 cursor-default" : "hover:bg-gray-100"
                        }`}
                        onClick={() => !isSelected && addFilter(filter)} // Only allow click if not selected
                      >
                        <span>{filter}</span>
                        {isSelected && (
                          <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                            Added
                          </span>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="p-2 text-gray-500 text-center">No filters found.</li>
                )}
              </ul>
            </div>
          )}
        </div>
        {/* Import from other widgets link */}
        <button className="text-blue-600 text-sm hover:underline font-medium">
          Import from other widgets
        </button>
      </div>
    </div>
  );
};

// --- WidgetDetails Component (Main Component) ---
export const WidgetDetails = () => {
  const [widgetName, setWidgetName] = useState("Default Widget Name");
  const [isDescription, setIsDescription] = useState(false);
  const [storeDescription, setStoreDescription] = useState("");

  // Widget Name Validation Logic
  const isDuplicate =
    widgetName.trim().toLowerCase() === "default widget name".toLowerCase();
  const isEmpty = widgetName.trim() === "";
  let error = "";
  if (isEmpty) {
    error = "Widget Name is Mandatory";
  } else if (isDuplicate) {
    error = "Widget name already exists.";
  }

  // Description Validation Logic
  const isDescriptionTooLong = storeDescription.length > 200;

  // Calculate total for the chart
  const totalTestCases = testData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left side: Fixed width (w-80) and handles its own vertical scroll */}
      <div className="w-80 h-screen border-r border-gray-400 bg-white p-3 flex flex-col gap-2 overflow-y-auto">
        <h1 className="text-sm font-semibold mb-1">Widget Details</h1>

        {/* Widget Name Input */}
        <div>
          <label htmlFor="widgetName" className="text-[13px] text-gray-500">
            Widget name<span style={{ color: "red" }}>*</span>
          </label>
          <div
            className={`border-2 rounded-md text-xs p-2 flex items-center justify-between ${
              error ? "border-red-500" : "border-blue-400"
            }`}
          >
            <input
              type="text"
              id="widgetName"
              className={`focus:outline-none flex-1`}
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
            />
            {error && (
              <Icon
                icon="carbon:warning-filled"
                className="text-red-500 ml-2 w-4 h-4"
              />
            )}
          </div>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}

        {/* Widget Description Area */}
        {!isDescription ? (
          <div
            className="flex items-center px-2 py-1 rounded-full border border-gray-500 w-44 gap-2 shadow-md hover:bg-gray-100 cursor-pointer"
            onClick={() => setIsDescription(true)}
          >
            <Icon icon="fluent:notepad-32-filled" className="w-4 h-4"/>
            <button className="text-sm">Add a description</button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label
              className="text-sm text-gray-500"
              htmlFor="widgetDescription"
            >
              Widget description
            </label>
            <textarea
              id="widgetDescription"
              rows={4}
              className={`border-2 border-gray-200 rounded-md p-2 bg-white shadow-md focus:outline-none text-xs ${
                storeDescription.length > 0 ? "focus:border-blue-400" : "focus:border-gray-400"
              } ${isDescriptionTooLong ? "border-red-500 focus:border-red-500" : ""}`}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              placeholder="Widget description"
            />
            {isDescriptionTooLong ? (
              <p className="text-red-400 text-xs">
                Widget description cannot have more than 200 characters.
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                max {storeDescription.length} / 200
              </p>
            )}
          </div>
        )}

        {/* Filters Panel */}
        <div className="mt-3 gap-1 flex flex-col">
          <FiltersPanel />
        </div>
      </div>

      {/* Right side: Chart Area. Fills remaining space and handles its own scroll. */}
      <div className="flex-1 h-screen bg-gray-100 px-4 py-6 overflow-y-auto">
        <div className="bg-white shadow rounded-lg p-4 flex">
          <div className="flex flex-col flex-1">
            <h2 className="text-lg font-semibold mb-2">Active Test Runs</h2>
            <div className="flex items-center justify-start">
              <div className="relative">
                <PieChart width={250} height={250}>
                  <Pie
                    data={testData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    // Prevent text/label overlap, as it's a doughnut chart with center content
                    labelLine={false}
                    label={false}
                  >
                    {testData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
                <CenterContent total={totalTestCases} />
              </div>

              <div className="flex-1">
                <CustomLegend />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
