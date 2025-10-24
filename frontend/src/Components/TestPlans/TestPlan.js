/* ---------- TestPlan.js ---------- */
import React, { useState, useEffect } from "react";
import { get, post, del } from "../../APICRUD/apiClient";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

export const TestPlan = () => {
  const projectId = "f7c45efb-f5b9-4d90-9ff2-c204b37233b3"; // Hardcoded project ID
  
  const [allTags, setAllTags] = useState([]); // All available tags from API
  const [selectedTags, setSelectedTags] = useState([]); // Selected tags
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);

  // Fetch tags from API
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await get(`/api/projects/${projectId}/tags`);
      const json = await res.json();
      const tags = json.data || [];
      setAllTags(tags);
    } catch (err) {
      console.error("fetchTags error:", err);
      setAllTags([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new tag
  const handleCreateTag = async () => {
    if (!newTagInput.trim()) return;
    setCreatingTag(true);
    try {
      await post(`/api/projects/${projectId}/tags`, { name: newTagInput });
      setNewTagInput("");
      setShowCreateTag(false);
      await fetchTags();
    } catch (err) {
      alert("Failed to create tag");
      console.error(err);
    } finally {
      setCreatingTag(false);
    }
  };

  // Filter tags - exclude already selected ones and match input
  const filteredTags = allTags.filter(
    tag => 
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.find(selected => selected.id === tag.id)
  );

  // Add tag to selected
  const addTag = (tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  // Remove tag from selected
  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  // Delete tag from API
  const handleDeleteTag = async (tagId) => {
    if (!window.confirm("Delete this tag?")) return;
    try {
      await del(`/api/projects/${projectId}/tags/${tagId}`);
      setAllTags(allTags.filter(tag => tag.id !== tagId));
      setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    } catch (err) {
      alert("Failed to delete tag");
      console.error(err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".tag-input-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!projectId) {
    return <div className="text-red-500">Project ID is required</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md font-sans">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Test Plan - Tags</h2>

      {/* Tags Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Tags
          </label>
          <button
            onClick={() => setShowCreateTag(!showCreateTag)}
            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            {showCreateTag ? "Cancel" : "+ Create Tag"}
          </button>
        </div>

        {/* Create New Tag Section */}
        {showCreateTag && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex gap-2">
              <TextField
                size="small"
                variant="outlined"
                label="New Tag Name"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="e.g., sprint1, security"
                disabled={creatingTag}
                fullWidth
                onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
              />
              <Button
                onClick={handleCreateTag}
                disabled={creatingTag || !newTagInput.trim()}
                variant="contained"
                color="success"
                sx={{ whiteSpace: "nowrap" }}
              >
                {creatingTag ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        )}

        {/* Tag Input with Dropdown */}
        <div className="relative tag-input-container">
          <div
            className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 min-h-[44px] cursor-pointer bg-white"
            onClick={() => setIsOpen(true)}
          >
            {loading ? (
              <span className="text-gray-500 text-sm">Loading tags...</span>
            ) : selectedTags.length === 0 ? (
              <span className="text-gray-500 text-sm">Select tags...</span>
            ) : (
              selectedTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag.id);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))
            )}

            {!loading && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={selectedTags.length === 0 ? "Search tags..." : ""}
                className="flex-1 min-w-[120px] px-1 py-1 outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {/* Dropdown */}
          {isOpen && !loading && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredTags.length > 0 ? (
                filteredTags.map(tag => (
                  <div
                    key={tag.id}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 flex justify-between items-center group"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(tag);
                    }}
                  >
                    <span>{tag.name}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteTag(tag.id);
                      }}
                      className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity"
                      title="Delete tag"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  {inputValue ? "No matching tags" : "No tags available. Create one!"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Show Selected Tags */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Tags:</h3>
        {selectedTags.length === 0 ? (
          <p className="text-sm text-gray-500">No tags selected</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span
                key={tag.id}
                className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* All Available Tags Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">All Available Tags ({allTags.length}):</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : allTags.length === 0 ? (
          <p className="text-sm text-gray-500">No tags yet. Create one to get started!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 group"
              >
                <span className="text-gray-700">{tag.name}</span>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                  title="Delete tag"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};