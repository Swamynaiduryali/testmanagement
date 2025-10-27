/* ---------- Projects.tsx ---------- */
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { get, post, del, patch } from "../../APICRUD/apiClient";
import { Modalpopup } from "../../CommonComponents/Modalpopup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const BACKEND_API_KEY = process.env.REACT_APP_BACKEND_API_KEY;
if (!BACKEND_API_KEY) {
  throw new Error("Missing API Key!");
}

const PAGE_SIZE = 20;

export const Projects = () => {
  /* ---------- State ---------- */
  const [currentPageData, setCurrentPageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [allProjects, setAllProjects] = useState([]);
  const [globalSearchActive, setGlobalSearchActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMenuFor, setShowMenuFor] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [nameError, setNameError] = useState(""); // NEW: Validation error
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageInput, setPageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);

  const menuRefs = useRef({});
  const navigate = useNavigate();

  /* ---------- Helpers ---------- */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  // NEW: Validate project name
  const validateProjectName = (name) => {
    if (!name.trim()) {
      return "Project name is required";
    }
    if (!/^[a-zA-Z]/.test(name.trim())) {
      return "Project name is not valid";
    }
    return "";
  };

  /* ---------- Fetch ONE page ---------- */
  const fetchPage = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const url = `/api/projects?page=${page}&page_size=${PAGE_SIZE}`;
        const res = await get(url);
        const json = await res.json();

        const raw = json.data || [];
        const backendPage = json.page || page;
        const backendTotal = json.total || 0;
        const backendTotalPages = json.totalPages || 1;

        const sorted = raw
          .filter((p) => !p.deleted_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const startIdx = (backendPage - 1) * PAGE_SIZE;
        const mapped = sorted.map((p, idx) => ({
          id: p.id,
          uniqueId: startIdx + idx + 1,
          title: p.name || "Untitled",
          createdAt: p.created_at ?? null,
        }));

        setCurrentPageData(mapped);
        setFilteredData(mapped);
        setTotalProjects(backendTotal);
        setTotalPages(backendTotalPages);
        setCurrentPage(backendPage);
      } catch (err) {
        console.error("fetchPage error:", err);
        setCurrentPageData([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ---------- Initial load ---------- */
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  /* ---------- Pagination change ---------- */
  useEffect(() => {
    if (!globalSearchActive) fetchPage(currentPage);
  }, [currentPage, fetchPage, globalSearchActive]);

  /* ---------- Cross-page Search Logic ---------- */
  useEffect(() => {
    const handleSearch = async () => {
      const query = searchQuery.trim().toLowerCase();

      if (!query) {
        setFilteredData(currentPageData);
        setGlobalSearchActive(false);
        return;
      }

      if (allProjects.length === 0) {
        try {
          setLoading(true);
          const allData = [];
          let page = 1;
          let keepFetching = true;

          while (keepFetching) {
            const res = await get(`/api/projects?page=${page}&page_size=${PAGE_SIZE}`);
            const json = await res.json();
            const raw = json.data || [];

            if (raw.length === 0) {
              keepFetching = false;
            } else {
              const mapped = raw
                .filter((p) => !p.deleted_at)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((p) => ({
                  id: p.id,
                  title: p.name || "Untitled",
                  createdAt: p.created_at ?? null,
                }));
              allData.push(...mapped);
              page++;
              keepFetching = page <= (json.totalPages || 1);
            }
          }

          setAllProjects(allData);
          const filtered = allData.filter((p) =>
            p.title.toLowerCase().includes(query)
          );
          setFilteredData(filtered);
          setGlobalSearchActive(true);
        } catch (err) {
          console.error("Global search error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        const filtered = allProjects.filter((p) =>
          p.title.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
        setGlobalSearchActive(true);
      }
    };

    handleSearch();
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /* ---------- Refresh after mutation ---------- */
  const refresh = async (pageToShow = 1) => {
    setAllProjects([]);
    setGlobalSearchActive(false);
    await fetchPage(pageToShow);
  };

  /* ---------- CRUD ---------- */
  const handleCreateSubmit = async () => {
    const error = validateProjectName(newProjectName);
    if (error) {
      setNameError(error);
      return;
    }
    setActionLoading(true);
    try {
      await post("/api/projects", { name: newProjectName.trim() });
      setCurrentPage(1);
      await refresh(1);
      closeCreateModal();
    } catch (e) {
      alert("Failed to create project.");
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    const error = validateProjectName(newProjectName);
    if (error || newProjectName.trim() === currentProject.title) {
      setNameError(error);
      return;
    }
    setActionLoading(true);
    try {
      await patch(`/api/projects/${currentProject.id}`, { name: newProjectName.trim() });
      await refresh(currentPage);
      closeEditModal();
    } catch (e) {
      alert("Failed to edit project.");
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await del(`/api/projects/${currentProject.id}`);
      const check = await get(`/api/projects?page=${currentPage}&page_size=${PAGE_SIZE}`);
      const j = await check.json();
      const newTotalPages = j.totalPages || 1;
      const pageToShow = currentPage > newTotalPages ? newTotalPages : currentPage;
      await refresh(pageToShow);
      closeDeleteModal();
    } catch (e) {
      alert("Failed to delete project.");
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------- Pagination helpers ---------- */
  const goPrev = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      const next = currentPage + 1;
      setCurrentPage(next);
    }
  };

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    setPageInput("");
  };

  const handleGoToPage = () => {
    const num = parseInt(pageInput, 10);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      goToPage(num);
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  /* ---------- Modal helpers ---------- */
  const openCreateModal = () => {
    setNewProjectName("");
    setNameError("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewProjectName("");
    setNameError("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setNewProjectName("");
    setCurrentProject(null);
    setNameError("");
  };

  const openEditModal = (proj) => {
    setShowMenuFor(null);
    setCurrentProject(proj);
    setNewProjectName(proj.title);
    setShowEditModal(true);
    setNameError("");
  };

  const openDeleteModal = (proj) => {
    setShowMenuFor(null);
    setCurrentProject(proj);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentProject(null);
  };

  /* ---------- Outside click for menu ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (showMenuFor && menuRefs.current[showMenuFor] && !menuRefs.current[showMenuFor].contains(e.target)) {
        setShowMenuFor(null);
      } 
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenuFor]);

  /* ---------- Navigation ---------- */
  const handleNavigateToTestCases = (proj) => {
    navigate("/test-cases", {
      state: { projectDbId: proj.id, projectTitle: proj.title, page: currentPage, page_size: pageSize, totalProjects },
    });
  };
  
  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setShowMenuFor((prev) => (prev === id ? null : id));
  };

  /* ---------- Pagination UI ---------- */
  const getPaginationButtons = () => {
    const btns = [];
    const max = 5;
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) btns.push(i);
    } else {
      btns.push(1);
      if (currentPage > 3) btns.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) btns.push(i);
      if (currentPage < totalPages - 2) btns.push("...");
      btns.push(totalPages);
    }
    return btns;
  };

  /* ---------- Render ---------- */
  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading projects…</div>;
  }

  const noResults = filteredData.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>

          <div className="flex items-center gap-3">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: 280, backgroundColor: "white" }}
            />

            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-visible">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 w-24">ID</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">PROJECT NAME</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">CREATED AT</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 w-20">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((p, index) => (
                <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{index + 1}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleNavigateToTestCases(p)}
                      className="text-left w-full font-medium text-gray-900 hover:text-blue-600"
                    >
                      {p.title}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{formatDate(p.createdAt)}</td>
                  <td className="py-4 px-6 relative">
                    <button
                      onClick={(e) => toggleMenu(e, p.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      …
                    </button>
                    {showMenuFor === p.id && (
                      <div
                        ref={(el) => (menuRefs.current[p.id] = el)}
                        className="absolute right-4 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                      >
                        <button
                          onClick={() => openEditModal(p)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(p)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-md"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {noResults && (
            <div className="text-center py-12 text-gray-500">
              No projects found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !globalSearchActive && !searchQuery.trim() && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={goPrev}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon fontSize="small" />
              </button>

              <div className="flex gap-1">
                {getPaginationButtons().map((b, i) => (
                  <button
                    key={i}
                    onClick={() => b !== "..." && goToPage(b)}
                    disabled={b === "..."}
                    className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
                      b === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : b === "..."
                        ? "border-gray-300 text-gray-400 cursor-default"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon fontSize="small" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <TextField
                size="small"
                placeholder="Page"
                type="number"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={handlePageInputKeyDown}
                inputProps={{
                  min: 1,
                  max: totalPages,
                  style: { textAlign: "center" },
                }}
                sx={{ width: 70 }}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={handleGoToPage}
                disabled={
                  !pageInput ||
                  isNaN(parseInt(pageInput, 10)) ||
                  parseInt(pageInput, 10) < 1 ||
                  parseInt(pageInput, 10) > totalPages
                }
                sx={{ textTransform: "none" }}
              >
                Go
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modalpopup
        open={showCreateModal}
        onClose={closeCreateModal}
        header="Create Project"
        content={
          <TextField
            fullWidth
            variant="outlined"
            label="Project Name"
            value={newProjectName}
            onChange={(e) => {
              setNewProjectName(e.target.value);
              setNameError(validateProjectName(e.target.value));
            }}
            placeholder="Enter project name"
            disabled={actionLoading}
            error={!!nameError}
            helperText={nameError}
          />
        }
        buttons={[
          <Button key="c1" onClick={closeCreateModal} disabled={actionLoading} color="inherit">
            Cancel
          </Button>,
          <Button
            key="c2"
            onClick={handleCreateSubmit}
            disabled={actionLoading || !!nameError || !newProjectName.trim()}
            variant="contained"
            color="primary"
          >
            {actionLoading ? "Creating…" : "Create"}
          </Button>,
        ]}
        width="400px"
        padding="20px"
      />

      <Modalpopup
        open={showEditModal}
        onClose={closeEditModal}
        header="Edit Project"
        content={
          <TextField
            fullWidth
            variant="outlined"
            label="New Project Name"
            value={newProjectName}
            onChange={(e) => {
              setNewProjectName(e.target.value);
              setNameError(validateProjectName(e.target.value));
            }}
            placeholder="Enter new name"
            disabled={actionLoading}
            error={!!nameError}
            helperText={nameError}
          />
        }
        buttons={[
          <Button key="e1" onClick={closeEditModal} disabled={actionLoading} color="inherit">
            Cancel
          </Button>,
          <Button
            key="e2"
            onClick={handleEditSubmit}
            disabled={actionLoading || !!nameError || !newProjectName.trim() || newProjectName === currentProject?.title}
            variant="contained"
            color="primary"
          >
            {actionLoading ? "Saving…" : "Save"}
          </Button>,
        ]}
        width="400px"
        padding="20px"
      />

      <Modalpopup
        open={showDeleteModal}
        onClose={closeDeleteModal}
        header="Confirm Delete"
        content={
          <Typography variant="body2" color="text.secondary">
            Delete "<span style={{ fontWeight: 600 }}>{currentProject?.title}</span>"? This cannot be undone.
          </Typography>
        }
        buttons={[
          <Button key="d1" onClick={closeDeleteModal} disabled={actionLoading} color="inherit">
            Cancel
          </Button>,
          <Button
            key="d2"
            onClick={handleDeleteConfirm}
            disabled={actionLoading}
            variant="contained"
            sx={{ backgroundColor: "gray", color: "white", "&:hover": { backgroundColor: "red" } }}
          >
            {actionLoading ? "Deleting…" : "Delete"}
          </Button>,
        ]}
        width="460px"
        padding="20px"
      />
    </div>
  );
};