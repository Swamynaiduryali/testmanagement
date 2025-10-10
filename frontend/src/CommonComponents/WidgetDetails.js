import { useState } from "react";
import { Icon } from "@iconify/react";
import { ActiveTestRunsChart } from "../Components/ProjectInsights/ActiveTestRuns";

const allFilters = [
  "Test Run Owners",
  "Test run tags",
  "Test Run Types",
  "Unique Test Run Name",
  "Branch",
  "Test Case Status",
  "CI runs only",
];

// --- FiltersPanel Component (Unchanged) ---
const FiltersPanel = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectFilter, setSelectFilter] = useState([]);

  const addFilter = (f) => {
    if (!selectFilter.includes(f)) {
      setSelectFilter((prev) => [...prev, f]);
    }
    setIsFilterOpen(false);
  };

  const removeFilter = (f) => {
    setSelectFilter((prev) => prev.filter((item) => item !== f));
  };

  const clearAll = () => {
    setSelectFilter([]);
    setIsFilterOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <h1 className="text-sm font-semibold">Filters</h1>
        <button
          onClick={clearAll}
          disabled={!selectFilter.length}
          className="px-2 py-1 text-gray-600 border rounded-md
             disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear all
        </button>
      </div>

      <div>
        {selectFilter.map((f) => {
          return (
            <div key={f}>
              <h1>{f}</h1>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center justify-between focus-within:border-blue-400 border-2 rounded-md p-1 flex-1">
                  <input type="text" className="focus:outline-none" />
                  <Icon icon="fluent-mdl2:scroll-up-down" />
                </div>
                <div
                  className="border border-gray-400 p-2 rounded-md"
                  onClick={() => removeFilter(f)}
                >
                  <Icon icon="ic:outline-delete" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative inline-block z-50">
        <button
          className="text-xs px-4 py-1 border border-gray-500 rounded-md flex items-center justify-between gap-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="text-gray-500 font-semibold">Add filter</span>
          {isFilterOpen ? (
            <Icon icon="ep:arrow-up" />
          ) : (
            <Icon icon="ep:arrow-down" />
          )}
        </button>
        {isFilterOpen && (
          <div>
            <div className="border border-gray-400 shadow-md rounded-md w-max absolute top-full z-50">
              <div className="border-b p-1">
                <div className="p-1 flex items-center gap-2 border-2 rounded-md border-gray-300 focus-within:border-blue-300">
                  <Icon icon="material-symbols:search-rounded" />
                  <input
                    type="text"
                    className="focus:outline-none flex-1 "
                    placeholder="search filter"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>
              </div>

              <ul>
                {allFilters
                  .filter((f) =>
                    f.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map((filter) => {
                    const isSelected = selectFilter.includes(filter);
                    return (
                      <li
                        key={filter}
                        className={`flex items-center justify-between p-1 gap-2 cursor-pointer ${
                          isSelected ? "" : "hover:bg-gray-200"
                        }`}
                        onClick={() => addFilter(filter)}
                      >
                        <span>{filter}</span>
                        {isSelected && (
                          <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                            Added
                          </span>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- WidgetDetails Component (Main Component) ---
export const WidgetDetails = ({ initialData, formTitle, setFormTitle }) => {
  const [isDescription, setIsDescription] = useState(false);
  const [storeDescription, setStoreDescription] = useState("");

  const originalTitle = initialData.title;
  let empty = formTitle.trim() === "";
  let error = "";

  if (empty) {
    error = "Widget Name is Mandatory";
  }

  const isDefaultTitle =
    formTitle.trim().toLowerCase() === originalTitle.toLowerCase();

  if (isDefaultTitle && !initialData.id) {
    error = "Widget name already exists.";
  }

  return (
    <div className="flex bg-gray-100">
      {/* Left side: Widget Details and Filters */}
      <div className="w-max min-w-72 border-r border-gray-400 bg-white p-3 flex flex-col gap-2">
        <h1 className="text-sm font-semibold mb-1">Widget Details</h1>
        <div>
          <label htmlFor="widgetName" className="text-[13px] text-gray-500">
            Widget name<span style={{ color: "red" }}>*</span>
          </label>
          <div
            className={`border-2
          rounded-md text-xs p-2 flex items-center justify-between ${
            error ? "border-red-500" : "border-blue-400"
          }`}
          >
            <input
              type="text"
              id="widgetName"
              className={`focus:outline-none flex-1`}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            {error && (
              <Icon
                icon="carbon:warning-filled"
                className="text-red-500 ml-2"
              />
            )}
          </div>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}

        {!isDescription ? (
          <div
            className="flex items-center px-2 py-1 rounded-full border border-gray-500 w-44 gap-2 shadow-md hover:bg-gray-100 cursor-pointer"
            onClick={() => setIsDescription(!isDescription)}
          >
            <Icon icon="fluent:notepad-32-filled" />
            <button>Add a description</button>
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
              className={`border-2 border-gray-200 rounded-md p-2 bg-white shadow-md focus:outline-none text-xs
                 ${
                   storeDescription
                     ? "focus:border-blue-400"
                     : "focus:border-gray-400"
                 }`}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              placeholder="Widget description"
            />
            {storeDescription.length > 200 ? (
              <p className="text-red-400 text-xs">
                Widget description cannot have more than 200 characters.
              </p>
            ) : (
              <p className="text-xs">max {storeDescription.length} / 200</p>
            )}
          </div>
        )}

        <div className="mt-3 gap-1 flex flex-col">
          <FiltersPanel />
        </div>
      </div>

      {/* Right side: Chart Area */}
      <div className="flex-1 px-4 py-6">
        <div className="bg-white shadow rounded-lg p-4 flex">
          <div className="flex flex-col">
            <ActiveTestRunsChart widgetTitle={formTitle} />
          </div>
        </div>
      </div>
    </div>
  );
};
