import React, { useState, useEffect } from "react";
import { get, post, del } from "../../APICRUD/apiClient";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

export const TestPlan = () => {
  const projectId = "f7c45efb-f5b9-4d90-9ff2-c204b37233b3";
  
  // Dummy initial values
  const dummyTags = [
    { id: "dummy-1", name: "Smoke Test" },
    { id: "dummy-2", name: "Regression Test" },
    { id: "dummy-3", name: "Integration Test" },
    { id: "dummy-4", name: "Performance Test" },
    { id: "dummy-5", name: "Security Test" }
  ];
  
  const [allTags, setAllTags] = useState(dummyTags);
  const [selectedTag, setSelectedTag] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch tags from API on mount
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await get(`/api/projects/${projectId}/tags`);
      const json = await res.json();
      const tags = json.data || [];
      // Merge with dummy tags if API returns empty
      setAllTags(tags.length > 0 ? tags : dummyTags);
    } catch (err) {
      console.error("fetchTags error:", err);
      // Keep dummy tags on error
      setAllTags(dummyTags);
    } finally {
      setLoading(false);
    }
  };

  // Filter tags based on input
  const filteredTags = allTags.filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Select tag from dropdown
  const selectTag = (tag) => {
    setSelectedTag(tag);
    setInputValue(tag.name);
    setIsOpen(false);
  };

  // Create/Save tag to database
  const handleCreateTag = async () => {
    if (!inputValue.trim()) {
      alert("Please enter a tag name");
      return;
    }

    setCreating(true);
    try {
      const res = await post(`/api/projects/${projectId}/tags`, { 
        name: inputValue.trim() 
      });
      const json = await res.json();
      
      alert("Tag created successfully!");
      
      // Refresh tags from API
      await fetchTags();
      
      // Clear selection
      setInputValue("");
      setSelectedTag(null);
    } catch (err) {
      alert("Failed to create tag");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // Delete tag from API
  const handleDeleteTag = async (tagId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this tag?")) return;
    
    try {
      await del(`/api/projects/${projectId}/tags/${tagId}`);
      setAllTags(allTags.filter(tag => tag.id !== tagId));
      
      // Clear selection if deleted tag was selected
      if (selectedTag?.id === tagId) {
        setSelectedTag(null);
        setInputValue("");
      }
    } catch (err) {
      alert("Failed to delete tag");
      console.error(err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".tag-dropdown-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md font-sans">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Test Plan - Tags</h2>

      {/* Editable Dropdown */}
      <div className="space-y-4">
        <div className="relative tag-dropdown-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
              setSelectedTag(null);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Type or select a tag..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            disabled={loading}
          />

          {/* Dropdown List */}
          {isOpen && !loading && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredTags.length > 0 ? (
                filteredTags.map(tag => (
                  <div
                    key={tag.id}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-50 flex justify-between items-center group"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectTag(tag);
                    }}
                  >
                    <span className="text-sm">{tag.name}</span>
                    <button
                      onClick={(e) => handleDeleteTag(tag.id, e)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity"
                      title="Delete tag"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  {inputValue ? `No matching tags. Click "Create" to add "${inputValue}"` : "No tags available"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateTag}
          disabled={creating || !inputValue.trim()}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          {creating ? "Creating..." : "Create"}
        </Button>
      </div>

      {/* Selected Tag Display */}
      {selectedTag && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-600">Selected Tag:</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">{selectedTag.name}</p>
        </div>
      )}
    </div>
  );
};