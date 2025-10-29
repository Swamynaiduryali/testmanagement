import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  TextField,
  MenuItem,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import { get } from "../../APICRUD/apiClient";

export const TestPlan = ({ selectedProjectId, onTagsChange }) => {
  const [tags, setTags] = useState([]); // ✅ [{ id, name }]
  const [selectedTags, setSelectedTags] = useState([]); // ✅ [{ id, name }]
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectId, setProjectId] = useState(selectedProjectId || null);

  // ✅ Get projectId
  useEffect(() => {
    if (selectedProjectId) setProjectId(selectedProjectId);
    else {
      const stored = localStorage.getItem("projectId");
      if (stored) setProjectId(stored);
    }
  }, [selectedProjectId]);

  // ✅ Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        setError(null);
        const endpoint = `/api/projects/${projectId}/tags`;
        console.log("🔄 Fetching from endpoint:", endpoint);

        const response = await get(endpoint);
        let data = response;

        // Handle different response shapes
        if (response && response.body) data = await response.json();
        else if (response && typeof response.text === "function") {
          const text = await response.text();
          data = JSON.parse(text);
        }

        let tagsArray = [];
        if (Array.isArray(data)) tagsArray = data;
        else if (data?.data) tagsArray = data.data;
        else if (data?.tags) tagsArray = data.tags;
        else if (data?.result) tagsArray = data.result;
        else if (data?.content) tagsArray = data.content;
        else {
          console.error("❌ Unexpected format:", data);
          setError("Invalid response format");
          return;
        }

        // ✅ Expecting each tag like { id, name }
        const validTags = tagsArray
          .filter((t) => t && (t.id || t.name))
          .map((t) => ({
            id: t.id, // ✅ keep the original backend ID only
            name: t.name || t.title || t.label || "",
          }));

        setTags(validTags);
      } catch (err) {
        console.error("❌ Error fetching tags:", err);
        setError(err.message || "Failed to fetch tags");
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, [projectId]);

  // ✅ Add tag manually (for new entry)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const newTag = {
        id: crypto.randomUUID(), // local-only new tag id
        name: inputValue.trim(),
      };
      const updatedTags = [...selectedTags, newTag];
      setSelectedTags(updatedTags);
      onTagsChange?.(updatedTags.map((t) => t.id)); // ✅ Pass IDs only
      setInputValue("");
      setShowDropdown(false);
      e.preventDefault();
    }
  };

  // ✅ Select/deselect existing tag
  const handleSelectTag = (tagObj) => {
    // ✅ Ensure the real backend id is stored
    const selectedTag = {
      id: tagObj.id,
      name: tagObj.name,
    };

    const already = selectedTags.find((t) => t.id === selectedTag.id);
    const updated = already
      ? selectedTags.filter((t) => t.id !== selectedTag.id)
      : [...selectedTags, selectedTag];

    setSelectedTags(updated);
    onTagsChange?.(updated.map((t) => t.id)); // ✅ Pass only IDs (e.g. ["uuid1", "uuid2"])
  };

  // ✅ Remove tag
  const handleDelete = (id) => {
    const updated = selectedTags.filter((t) => t.id !== id);
    setSelectedTags(updated);
    onTagsChange?.(updated.map((t) => t.id)); // ✅ Pass IDs only
  };

  // ✅ Filter dropdown suggestions
  const filteredTags = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((s) => s.id === t.id)
  );

  return (
    <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
      <Box sx={{ width: "260px", mt: 2 }}>
        <h3 style={{ fontWeight: "600", fontSize: "15px", marginBottom: "8px" }}>
          Tags
        </h3>

        {error && (
          <Box
            sx={{
              color: "#d32f2f",
              fontSize: "12px",
              mb: 1,
              p: 1,
              backgroundColor: "#ffebee",
              borderRadius: "4px",
            }}
          >
            ❌ {error}
          </Box>
        )}

        <Box
          sx={{
            position: "relative",
            border: "1px solid #c4c4c4",
            borderRadius: "6px",
            padding: "4px 6px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            minHeight: "40px",
            backgroundColor: "#fff",
            "&:focus-within": {
              borderColor: "#1976d2",
              boxShadow: "0 0 0 1px #1976d2",
            },
          }}
        >
          {selectedTags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              onDelete={() => handleDelete(tag.id)}
              size="small"
              sx={{
                m: "2px",
                backgroundColor: "#1976d2",
                color: "#fff",
                fontSize: "12px",
              }}
            />
          ))}

          <TextField
            variant="standard"
            placeholder={
              selectedTags.length === 0 ? "Type or select a tag..." : ""
            }
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            sx={{
              flex: 1,
              "& .MuiInputBase-root": { border: "none" },
              "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                display: "none",
              },
              "& input": {
                padding: "6px",
                fontSize: "14px",
                outline: "none",
              },
            }}
          />

          {showDropdown && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                border: "1px solid #c4c4c4",
                borderRadius: "4px",
                backgroundColor: "#fff",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                mt: "2px",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <MenuItem
                    key={tag.id}
                    onClick={() => handleSelectTag(tag)}
                    sx={{
                      fontSize: "14px",
                      padding: "8px 12px",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    {tag.name}
                  </MenuItem>
                ))
              ) : inputValue ? (
                <MenuItem disabled sx={{ fontSize: "13px", opacity: 0.7 }}>
                  Press Enter to add "{inputValue}"
                </MenuItem>
              ) : (
                <MenuItem disabled sx={{ fontSize: "13px", opacity: 0.7 }}>
                  No tags available
                </MenuItem>
              )}
            </Box>
          )}
        </Box>

        {selectedTags.length > 0 && (
          <Box sx={{ fontSize: "12px", color: "#666", mt: 1 }}>
            Selected IDs: [{selectedTags.map((t) => `"${t.id}"`).join(", ")}]
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};
