import React, { useState } from "react";
import { Icon } from "@iconify/react";

// This component will wrap any chart (like ActiveTestRunsChart)
// and provide the common dashboard UI/actions.
export const DashboardWidget = ({
  title,
  children,
  onEdit,
  onDelete,
  onClone,
  onExport,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col m-4">
      {/* Widget Header and Actions */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* 3-Dot Options Menu */}
        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon icon="ph:dots-three-vertical-bold" width="20" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              {/* Edit Button */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  onEdit();
                  setIsMenuOpen(false);
                }}
              >
                <Icon
                  icon="material-symbols:edit-sharp"
                  className="inline mr-2"
                />
                Edit
              </button>

              {/* Clone Button */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  onClone();
                  setIsMenuOpen(false);
                }}
              >
                <Icon icon="ph:copy" className="inline mr-2" />
                Clone
              </button>

              {/* Export Button */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  onExport();
                  setIsMenuOpen(false);
                }}
              >
                <Icon icon="mdi:file-excel-box" className="inline mr-2" />
                Export as CSV
              </button>

              {/* Delete Button */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white"
                onClick={() => {
                  onDelete();
                  setIsMenuOpen(false);
                }}
              >
                <Icon icon="ic:outline-delete" className="inline mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content (The Chart goes here) */}
      {children}
    </div>
  );
};
