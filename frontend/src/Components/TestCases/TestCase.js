import React, { useState } from 'react';
import { Search, Filter, Download, Plus, X, ChevronRight, ChevronDown, Info, Table, MoreVertical, Edit, Copy, Pencil, Trash2 } from 'lucide-react';

export const TestCase = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showCreateTestCase, setShowCreateTestCase] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({ Authentication: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Authentication');
  const [showEditTestCase, setShowEditTestCase] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [newTestCaseTitle, setNewTestCaseTitle] = useState('');
  const [newTestCaseFolder, setNewTestCaseFolder] = useState('');
  const [newTestCaseDescription, setNewTestCaseDescription] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPreconditions, setEditedPreconditions] = useState('');
  const [editedOwner, setEditedOwner] = useState('Myself (Lucky Ind)');
  const [editedState, setEditedState] = useState('Active');
  const [editedPriority, setEditedPriority] = useState('Medium');
  const [editedType, setEditedType] = useState('Other');
  const [editedAutomationStatus, setEditedAutomationStatus] = useState('Not Automated');
  const [editedTags, setEditedTags] = useState('');
  const [showFolderMenu, setShowFolderMenu] = useState(null);
  const [parentFolderForSub, setParentFolderForSub] = useState(null);
  const [showMoveFolder, setShowMoveFolder] = useState(false);
  const [showCopyFolder, setShowCopyFolder] = useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [folderToMove, setFolderToMove] = useState(null);
  const [folderToCopy, setFolderToCopy] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [moveToLocation, setMoveToLocation] = useState('specific');
  const [selectedMoveFolder, setSelectedMoveFolder] = useState('');
  const [publicLinkEnabled, setPublicLinkEnabled] = useState(false);
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderDescription, setEditFolderDescription] = useState('');
  const [expandedMoveFolders, setExpandedMoveFolders] = useState({});
  const [sortType, setSortType] = useState('Custom');
  const [showTestCaseDetails, setShowTestCaseDetails] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [showTestMenu, setShowTestMenu] = useState(null);
  const [newSharedStepTitle, setNewSharedStepTitle] = useState('');
const [newSharedStepDescription, setNewSharedStepDescription] = useState('');
const [sharedSteps, setSharedSteps] = useState([]); // New state for shared steps
const [showSharedStepMenu, setShowSharedStepMenu] = useState(null);
const [showCreateForm, setShowCreateForm] = useState(false);

const handleCreateSharedStep = () => {
  if (newSharedStepTitle.trim()) {
    const newId = `SS-${sharedSteps.length + 1}`;
    const newSharedStep = {
      id: newId,
      title: newSharedStepTitle,
      description: newSharedStepDescription || '',
      steps: [{ step: '', result: '' }],
    };
    setSharedSteps([...sharedSteps, newSharedStep]);
    setNewSharedStepTitle('');
    setNewSharedStepDescription('');
    setShowCreateForm(false); // Hide form after creation
  }
};

const handleDeleteSharedStep = (id) => {
  if (window.confirm('Are you sure you want to delete this shared step permanently?')) {
    setSharedSteps(sharedSteps.filter(ss => ss.id !== id));
    setShowSharedStepMenu(null);
  }
};

  // Initialize folders with createdAt for sorting
  const [folders, setFolders] = useState([
    {
      name: 'Authentication',
      count: 4,
      subCount: 12,
      createdAt: '2024-01-01',
      subfolders: [
        { name: 'Login', count: 2, subCount: 6, createdAt: '2024-01-02', subfolders: [
          { name: 'Password', count: 4, subCount: 4, createdAt: '2024-01-03' }
        ]},
        { name: 'Logout', count: 2, subCount: 2, createdAt: '2024-01-04' }
      ]
    },
    {
      name: 'Administration',
      count: 0,
      subCount: 8,
      createdAt: '2024-02-01',
      subfolders: [
        { name: 'Role', count: 0, subCount: 7, createdAt: '2024-02-02', subfolders: [
          { name: 'Admin', count: 4, subCount: 4, createdAt: '2024-02-03' },
          { name: 'Owner', count: 2, subCount: 2, createdAt: '2024-02-04' },
          { name: 'Product User', count: 1, subCount: 1, createdAt: '2024-02-05' }
        ]},
        { name: 'API Key', count: 1, subCount: 1, createdAt: '2024-02-06' }
      ]
    },
    {
      name: 'Configuration',
      count: 1,
      subCount: 12,
      createdAt: '2024-03-01',
      subfolders: [
        { name: 'Browsers', count: 5, subCount: 5, createdAt: '2024-03-02' },
        { name: 'Devices', count: 6, subCount: 6, createdAt: '2024-03-03' }
      ]
    },
    { name: 'Users', count: 0, subCount: 31, createdAt: '2024-04-01' },
    { name: 'Usability', count: 17, subCount: 17, createdAt: '2024-05-01' },
    { name: 'Performance', count: 14, subCount: 14, createdAt: '2024-06-01' },
    { name: 'Security', count: 6, subCount: 6, createdAt: '2024-07-01' }
  ]);

  const [testCases, setTestCases] = useState([
    { id: 'TC-103', title: 'testmo', folder: 'Authentication', priority: 'Medium', owner: 'Lucky Ind', tags: '', description: '', preconditions: '', steps: [{ step: '', result: '' }] },
    { id: 'TC-99', title: 'TEstsarvind', folder: 'Authentication', priority: 'Medium', owner: 'Lucky Ind', tags: '', description: '', preconditions: '', steps: [{ step: '', result: '' }] },
    { id: 'TC-1', title: 'Verify that valid user credentials result in successful authentication.', folder: 'Authentication', priority: 'Low', owner: 'Lucky Ind', tags: 'sprint1, +1', description: '', preconditions: '', steps: [{ step: '', result: '' }] },
    { id: 'TC-2', title: 'Ensure that the user is redirected to the correct landing page after successful authentication', folder: 'Authentication', priority: 'Medium', owner: 'Lucky Ind', tags: 'sprint1, +1', description: '', preconditions: '', steps: [{ step: '', result: '' }] }
  ]);

  // Function to sort folders
  const sortFolders = (type, folderList) => {
    let sorted = [...folderList];

    switch (type) {
      case 'A-Z':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Z-A':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'Oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'Custom':
      default:
        // Do nothing — keep user-defined order
        sorted = folderList;
        break;
    }

    // Sort subfolders recursively
    return sorted.map(folder => {
      if (folder.subfolders) {
        return { ...folder, subfolders: sortFolders(type, folder.subfolders) };
      }
      return folder;
    });
  };

  // Handle sorting change
  const handleSortChange = (type) => {
    setSortType(type);
    setFolders(sortFolders(type, folders));
  };

  // Handle drag start and drop
  const handleDragStart = (e, index, parentPath = []) => {
    e.dataTransfer.setData('folderIndex', JSON.stringify({ index, parentPath }));
  };

  const handleDrop = (e, dropIndex, parentPath = []) => {
    if (sortType !== 'Custom') return;

    const data = JSON.parse(e.dataTransfer.getData('folderIndex'));
    const { index: dragIndex, parentPath: dragParentPath } = data;

    // Handle drag and drop within the same folder level
    if (JSON.stringify(parentPath) === JSON.stringify(dragParentPath)) {
      const updatedFolders = [...folders];
      const [movedItem] = updatedFolders.splice(dragIndex, 1);
      updatedFolders.splice(dropIndex, 0, movedItem);
      setFolders(updatedFolders);
    }
    // Add logic for dragging between different folder levels if needed
  };

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const toggleMoveFolder = (folderName) => {
    setExpandedMoveFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      const newFolder = { name: folderName, count: 0, subCount: 0, createdAt: new Date().toISOString() };
      if (parentFolderForSub) {
        const addSubfolder = (folderList) => {
          return folderList.map(f => {
            if (f.name === parentFolderForSub) {
              return { ...f, subfolders: [...(f.subfolders || []), newFolder] };
            }
            if (f.subfolders) {
              return { ...f, subfolders: addSubfolder(f.subfolders) };
            }
            return f;
          });
        };
        setFolders(addSubfolder(folders));
        setExpandedFolders(prev => ({ ...prev, [parentFolderForSub]: true }));
      } else {
        setFolders([...folders, newFolder]);
      }
      setFolderName('');
      setFolderDescription('');
      setShowCreateFolder(false);
      setParentFolderForSub(null);
      setSelectedFolder(folderName);
    }
  };

  const handleMoveFolder = () => {
    if (moveToLocation === 'root') {
      alert(`Moving ${folderToMove} to root level`);
    } else if (selectedMoveFolder) {
      alert(`Moving ${folderToMove} to ${selectedMoveFolder}`);
    }
    setShowMoveFolder(false);
    setFolderToMove(null);
    setSelectedMoveFolder('');
    setMoveToLocation('specific');
  };

  const handleCopyFolder = () => {
    if (selectedMoveFolder) {
      const findFolder = (folderList, name) => {
        for (const f of folderList) {
          if (f.name === name) return f;
          if (f.subfolders) {
            const found = findFolder(f.subfolders, name);
            if (found) return found;
          }
        }
        return null;
      };

      const folderData = findFolder(folders, folderToCopy);
      if (folderData) {
        const copiedFolder = { 
          ...folderData,
          name: `${folderData.name} (Copy)`,
          createdAt: new Date().toISOString()
        };

        const addToFolder = (folderList) => {
          return folderList.map(f => {
            if (f.name === selectedMoveFolder) {
              return { ...f, subfolders: [...(f.subfolders || []), copiedFolder] };
            }
            if (f.subfolders) {
              return { ...f, subfolders: addToFolder(f.subfolders) };
            }
            return f;
          });
        };

        setFolders(addToFolder(folders));
        setExpandedFolders(prev => ({ ...prev, [selectedMoveFolder]: true }));
      }
    }
    setShowCopyFolder(false);
    setFolderToCopy(null);
    setSelectedMoveFolder('');
  };

  const handleEditFolderSubmit = () => {
    if (editFolderName.trim()) {
      const updateFolderName = (folderList) => {
        return folderList.map(f => {
          if (f.name === folderToEdit) {
            return { ...f, name: editFolderName };
          }
          if (f.subfolders) {
            return { ...f, subfolders: updateFolderName(f.subfolders) };
          }
          return f;
        });
      };

      setFolders(updateFolderName(folders));
      if (selectedFolder === folderToEdit) setSelectedFolder(editFolderName);
      setShowEditFolder(false);
      setFolderToEdit(null);
      setEditFolderName('');
      setEditFolderDescription('');
    }
  };

  const handleImportFile = () => {
    alert('Import functionality would be implemented here');
  };

  const handleCreateTestCase = () => {
    if (newTestCaseTitle.trim()) {
      const newId = `TC-${testCases.length + 1}`;
      const folderToUse = newTestCaseFolder || selectedFolder;
      const newTestCase = { 
        id: newId, 
        title: newTestCaseTitle, 
        folder: folderToUse,
        priority: 'Medium',
        owner: 'Lucky Ind',
        tags: '',
        description: newTestCaseDescription,
        preconditions: '',
        steps: [{ step: '', result: '' }]
      };
      setTestCases([...testCases, newTestCase]);
      
      const updateFolderCount = (folderList, delta) => {
        return folderList.map(f => {
          if (f.name === folderToUse) {
            return { ...f, count: f.count + delta, subCount: f.subCount + delta };
          }
          if (f.subfolders) {
            return { ...f, subfolders: updateFolderCount(f.subfolders, delta) };
          }
          return f;
        });
      };

      setFolders(updateFolderCount(folders, 1));
      setNewTestCaseTitle('');
      setNewTestCaseFolder('');
      setNewTestCaseDescription('');
      setShowCreateTestCase(false);
      setSelectedFolder(folderToUse);
    }
  };

  const handleFolderClick = (folderName) => {
    setSelectedFolder(folderName);
  };

  const handleEditTestCase = (testCase) => {
    setEditingTestCase(testCase);
    setEditedTitle(testCase.title);
    setEditedDescription(testCase.description || '');
    setEditedPreconditions(testCase.preconditions || '');
    setEditedOwner(testCase.owner);
    setEditedState(testCase.state || 'Active');
    setEditedPriority(testCase.priority);
    setEditedType(testCase.type || 'Other');
    setEditedAutomationStatus(testCase.automationStatus || 'Not Automated');
    setEditedTags(testCase.tags);
    setShowEditTestCase(true);
    if (showTestCaseDetails) setShowTestCaseDetails(false);
  };

  const handleUpdateTestCase = () => {
    if (editedTitle.trim()) {
      const updatedTestCase = {
        ...editingTestCase,
        title: editedTitle,
        description: editedDescription,
        preconditions: editedPreconditions,
        owner: editedOwner,
        state: editedState,
        priority: editedPriority,
        type: editedType,
        automationStatus: editedAutomationStatus,
        tags: editedTags,
      };
      setTestCases(testCases.map(tc => tc.id === editingTestCase.id ? updatedTestCase : tc));
      setShowEditTestCase(false);
      setEditingTestCase(null);
      if (selectedTestCase && selectedTestCase.id === updatedTestCase.id) {
        setSelectedTestCase(updatedTestCase);
      }
    }
  };

  const handleDeleteTestCase = (id) => {
    if (window.confirm('Are you sure you want to delete this test case permanently?')) {
      const deletedTestCase = testCases.find(tc => tc.id === id);
      if (deletedTestCase) {
        setTestCases(testCases.filter(tc => tc.id !== id));
        const updateFolderCount = (folderList, delta) => {
          return folderList.map(f => {
            if (f.name === deletedTestCase.folder) {
              return { ...f, count: f.count + delta, subCount: f.subCount + delta };
            }
            if (f.subfolders) {
              return { ...f, subfolders: updateFolderCount(f.subfolders, delta) };
            }
            return f;
          });
        };
        setFolders(updateFolderCount(folders, -1));
      }
      setShowTestMenu(null);
      if (selectedTestCase && selectedTestCase.id === id) {
        setShowTestCaseDetails(false);
        setSelectedTestCase(null);
      }
    }
  };

  const handleAddSubFolder = (parentName) => {
    setParentFolderForSub(parentName);
    setShowCreateFolder(true);
    setShowFolderMenu(null);
  };

  const getFilteredTestCases = () => testCases.filter(tc => tc.folder === selectedFolder);

  const getFolderEmptyState = () => {
    const findFolder = (folderList, name) => {
      for (const f of folderList) {
        if (f.name === name) return f;
        if (f.subfolders) {
          const found = findFolder(f.subfolders, name);
          if (found) return found;
        }
      }
      return null;
    };
    const folder = findFolder(folders, selectedFolder);
    return folder ? folder.count === 0 : false;
  };

  const handleExpandAll = () => {
    const allExpanded = {};
    const expandAll = (folderList) => {
      folderList.forEach(f => {
        if (f.subfolders) {
          allExpanded[f.name] = true;
          expandAll(f.subfolders);
        }
      });
    };
    expandAll(folders);
    setExpandedFolders(allExpanded);
    setShowFolderMenu(null);
  };

  const handleCollapseAll = () => {
    setExpandedFolders({});
    setShowFolderMenu(null);
  };

  const handleDeleteFolder = (folderName) => {
    if (window.confirm(`Are you sure you want to delete the folder "${folderName}"?`)) {
      const removeFolder = (folderList) => {
        return folderList.filter(f => f.name !== folderName).map(f => {
          if (f.subfolders) {
            return { ...f, subfolders: removeFolder(f.subfolders) };
          }
          return f;
        });
      };
      setFolders(removeFolder(folders));
      if (selectedFolder === folderName) setSelectedFolder(folders[0]?.name || '');
    }
    setShowFolderMenu(null);
  };

  const handleViewTestCase = (testCase) => {
    setSelectedTestCase(testCase);
    setShowTestCaseDetails(true);
  };

  const handleNextTestCase = () => {
    const filtered = getFilteredTestCases();
    const index = filtered.findIndex(tc => tc.id === selectedTestCase.id);
    if (index < filtered.length - 1) {
      setSelectedTestCase(filtered[index + 1]);
    }
  };

  const handlePreviousTestCase = () => {
    const filtered = getFilteredTestCases();
    const index = filtered.findIndex(tc => tc.id === selectedTestCase.id);
    if (index > 0) {
      setSelectedTestCase(filtered[index - 1]);
    }
  };

  const renderFolderTree = (folderList, level = 0, parentPath = []) => {
    return folderList.map((folder, idx) => (
      <div
        key={`${parentPath.join('-')}-${folder.name}-${idx}`}
        draggable={sortType === 'Custom'}
        onDragStart={(e) => handleDragStart(e, idx, parentPath)}
        onDrop={(e) => handleDrop(e, idx, parentPath)}
        onDragOver={(e) => sortType === 'Custom' && e.preventDefault()}
      >
        <div
          className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group ${selectedFolder === folder.name ? 'bg-blue-50' : ''}`}
          style={{ marginLeft: `${level * 24}px`, cursor: sortType === 'Custom' ? 'grab' : 'pointer' }}
        >
          <div className="flex items-center gap-2 flex-1" onClick={() => { toggleFolder(folder.name); handleFolderClick(folder.name); }}>
            {folder.subfolders ? (expandedFolders[folder.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div className="w-4" />}
            <div className={`w-4 h-4 rounded ${level === 0 ? 'bg-blue-500' : level === 1 ? 'bg-blue-400' : 'bg-blue-300'}`}></div>
            <span className="text-sm font-medium">{folder.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{folder.count}({folder.subCount})</span>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFolderMenu(showFolderMenu === folder.name ? null : folder.name);
                }}
                className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={16} className="text-gray-600" />
              </button>
              {showFolderMenu === folder.name && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowFolderMenu(null)}></div>
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button onClick={handleExpandAll} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Expand All</button>
                    <button onClick={handleCollapseAll} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Collapse All</button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setNewTestCaseFolder(folder.name);
                        setShowCreateTestCase(true);
                        setShowFolderMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Create Test Case
                    </button>
                    <button
                      onClick={() => handleAddSubFolder(folder.name)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Add Sub Folder
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setFolderToCopy(folder.name);
                        setShowCopyFolder(true);
                        setShowFolderMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Copy Folder
                    </button>
                    <button
                      onClick={() => {
                        setFolderToMove(folder.name);
                        setShowMoveFolder(true);
                        setShowFolderMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Move Folder
                    </button>
                    <button
                      onClick={() => {
                        setFolderToEdit(folder.name);
                        setEditFolderName(folder.name);
                        setShowEditFolder(true);
                        setShowFolderMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Edit Folder
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://test-management.com/folder/${folder.name}`);
                        alert('Folder URL copied!');
                        setShowFolderMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Copy Folder URL
                    </button>
                    <button
                      onClick={() => {
                        setShowShareLink(true);
                        setShowFolderMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Share via public link
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => handleDeleteFolder(folder.name)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {folder.subfolders && expandedFolders[folder.name] && renderFolderTree(folder.subfolders, level + 1, [...parentPath, idx])}
      </div>
    ));
  };

  const renderMoveFolderTree = (folderList, level = 0, currentFolderToMove = null) => {
    return folderList.filter(f => f.name !== currentFolderToMove).map((folder, idx) => (
      <div key={idx}>
        <div 
          className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer ${selectedMoveFolder === folder.name ? 'bg-blue-50' : ''}`}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => setSelectedMoveFolder(folder.name)}
        >
          <div className="flex items-center gap-2 flex-1">
            {folder.subfolders && folder.subfolders.length > 0 ? (
              <button onClick={(e) => { e.stopPropagation(); toggleMoveFolder(folder.name); }}>
                {expandedMoveFolders[folder.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : <div className="w-4" />}
            <div className={`w-4 h-4 rounded ${level === 0 ? 'bg-blue-500' : level === 1 ? 'bg-blue-400' : 'bg-blue-300'}`}></div>
            <span className="text-sm">{folder.name}</span>
          </div>
          <span className="text-sm text-gray-500">{folder.count}({folder.subCount})</span>
        </div>
        {folder.subfolders && expandedMoveFolders[folder.name] && renderMoveFolderTree(folder.subfolders, level + 1, currentFolderToMove)}
      </div>
    ));
  };

  const renderTestCaseDetailsModal = () => {
    if (!selectedTestCase) return null;

    const filtered = getFilteredTestCases();
    const index = filtered.findIndex(tc => tc.id === selectedTestCase.id);
    const hasPrevious = index > 0;
    const hasNext = index < filtered.length - 1;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">TEST CASE DETAILS</h2>
            <button onClick={() => setShowTestCaseDetails(false)}>
              <X size={24} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="gap-6 p-6">
              
              <div className="col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">{selectedTestCase.id} (i) | 1 version</span>
                    <h3 className="text-xl font-semibold">{selectedTestCase.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditTestCase(selectedTestCase)} className="p-1 hover:bg-gray-200 rounded">
                      <Pencil size={16} className="text-gray-500" /> Edit
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                <button className="w-full py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2">
                  <span>✨</span> Automate using BrowserStack AI
                </button>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <p className="p-3 bg-white border border-gray-300 rounded-lg min-h-[100px]">{selectedTestCase.description || '--'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preconditions</label>
                  <p className="p-3 bg-white border border-gray-300 rounded-lg min-h-[100px]">{selectedTestCase.preconditions || '--'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <X size={16} /> All Steps & Results:
                  </h3>
                  <div className="space-y-4">
                    {selectedTestCase.steps.map((step, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2"><ChevronDown size={16} /> Step {idx + 1}</h4>
                        <p className="mt-2">{step.step || '--'}</p>
                        <h5 className="mt-4 font-medium">Result:</h5>
                        <p>{step.result || '--'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-4 space-y-4">
                <div>
                  
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Template</label>
                  <p>Test Case Steps</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Owner</label>
                  <p>{selectedTestCase.owner}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <p className="text-blue-600 flex items-center gap-1"><input type="checkbox" checked className="rounded" readOnly /> Active</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <p className="text-blue-600">— Medium</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type of Test Case</label>
                  <p>{selectedTestCase.type || 'Other'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Automation Status</label>
                  <p>{selectedTestCase.automationStatus || 'Not Automated'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <p>{selectedTestCase.tags || '--'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Requirements</label>
                  <button className="text-blue-600">Add Requirements</button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attachments</label>
                  <p>--</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Created by</label>
                  <p>Lucky Ind Sep 22, 2025 | 04:05:17 PM (IST)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Results</label>
                  <hr className="border-blue-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Defects</label>
                  <hr className="border-blue-600" />
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-2"><Info size={32} className="text-gray-500" /></div>
                  <h3 className="text-lg font-semibold mb-2">No Results</h3>
                  <p className="text-gray-600">Once you start linking this test case in a test run, historical result will appear here</p>
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-between p-6 border-t border-gray-200">
            <button
              onClick={handlePreviousTestCase}
              disabled={!hasPrevious}
              className={`px-6 py-2 rounded-lg ${hasPrevious ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Previous ↑
            </button>
            <button
              onClick={handleNextTestCase}
              disabled={!hasNext}
              className={`px-6 py-2 rounded-lg ${hasNext ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Next ↓
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Test Cases</h1>
          <div className="flex gap-3">
            <button onClick={() => setShowImport(true)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download size={20} />
            </button>
            <button onClick={() => setShowCreateTestCase(true)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Create Test Case
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <span className="text-xl">✨</span>
              Generate with AI
            </button>
          </div>
        </div>
        <div className="flex gap-8 mt-6">
          {['repository', 'shared-steps', 'datasets'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {tab === 'repository' ? 'Repository' : tab === 'shared-steps' ? 'Shared Steps' : 'Datasets'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'repository' && (
        <div className="flex">
          <div className="w-96 bg-white border-r border-gray-200 p-4 h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-700">Folders</h2>
                <button onClick={() => { setParentFolderForSub(null); setShowCreateFolder(true); }} className="p-1 hover:bg-gray-100 rounded">
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
              <span>Sort by:</span>
              <select value={sortType} onChange={(e) => handleSortChange(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1">
                <option value="Custom">Custom</option>
                <option value="A-Z">A–Z (Name)</option>
                <option value="Z-A">Z–A (Name)</option>
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
              <span className="text-gray-400">({folders.length})</span>
            </div>
            <div className="space-y-1">
              {renderFolderTree(folders)}
            </div>
          </div>

          <div className="flex-1 p-6" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by Test Case ID or Title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button onClick={() => setShowFilter(true)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{selectedFolder}</h3>
                  <Info size={16} className="text-gray-400" />
                </div>
              </div>

              {getFolderEmptyState() ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Add Test Cases</h3>
                  <p className="text-gray-600 mb-6">You can create test cases by entering details below</p>
                  <div className="w-full max-w-3xl bg-white rounded-lg border-2 border-blue-500 p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option>AI steps</option></select>
                      <input
                        type="text"
                        placeholder="Enter test case title and press enter"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><span>✨</span>Create</button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"><span>✨</span>Generate with AI</button>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      Quick Import
                    </button>
                    <button onClick={() => setShowImport(true)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"><Download size={20} />Import Test Cases</button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full inline-block align-middle" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                      <div className="col-span-1"><input type="checkbox" className="rounded" /></div>
                      <div className="col-span-1">ID</div>
                      <div className="col-span-4">TITLE</div>
                      <div className="col-span-2">PRIORITY</div>
                      <div className="col-span-2">OWNER</div>
                      <div className="col-span-1">TAGS</div>
                      <div className="col-span-1"></div>
                    </div>
                    {getFilteredTestCases().map((testCase) => (
                      <div key={testCase.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 items-center">
                        <div className="col-span-1"><input type="checkbox" className="rounded" /></div>
                        <div className="col-span-1 text-sm font-medium">{testCase.id}</div>
                        <div className="col-span-4 text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => handleViewTestCase(testCase)}>{testCase.title}</div>
                        <div className="col-span-2 text-sm flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${testCase.priority === 'Low' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                          {testCase.priority}
                        </div>
                        <div className="col-span-2 text-sm">{testCase.owner}</div>
                        <div className="col-span-1 text-sm">{testCase.tags || '--'}</div>
                        <div className="col-span-1 flex items-center gap-2">
                          <button onClick={() => handleEditTestCase(testCase)} className="p-1 hover:bg-gray-200 rounded"><Edit size={16} className="text-gray-500" /></button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowTestMenu(showTestMenu === testCase.id ? null : testCase.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <MoreVertical size={16} className="text-gray-500" />
                            </button>
                            {showTestMenu === testCase.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50" style={{ top: '100%' }}>
                                <button
                                  onClick={() => {
                                    handleEditTestCase(testCase);
                                    setShowTestMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Pencil size={16} /> Edit Test Case
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteTestCase(testCase.id);
                                    setShowTestMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                                >
                                  <Trash2 size={16} /> Delete Permanently
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white rounded-lg border border-gray-300 p-4">
              <div className="flex items-center gap-3">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option>AI steps</option></select>
                <input
                  type="text"
                  placeholder="Enter test case title and press enter to generate test case details using AI"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><span>✨</span>Create</button>
              </div>
            </div>
          </div>
          </div>
      )}

{activeTab === 'shared-steps' && (
  <div className="flex-1 p-6" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold">Shared Steps</h3>
      </div>
      {sharedSteps.length === 0 && !showCreateForm && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Add Shared Steps</h3>
          <p className="text-gray-600 mb-6">You can create shared steps by clicking below</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Shared Step
          </button>
        </div>
      )}
      {sharedSteps.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="col-span-1">ID</div>
              <div className="col-span-6">TITLE</div>
              <div className="col-span-4">DESCRIPTION</div>
              <div className="col-span-1"></div>
            </div>
            {sharedSteps.map((sharedStep) => (
              <div key={sharedStep.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 items-center">
                <div className="col-span-1 text-sm font-medium">{sharedStep.id}</div>
                <div className="col-span-6 text-sm text-blue-600 hover:underline cursor-pointer">{sharedStep.title}</div>
                <div className="col-span-4 text-sm">{sharedStep.description || '--'}</div>
                <div className="col-span-1 flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSharedStepMenu(showSharedStepMenu === sharedStep.id ? null : sharedStep.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                    {showSharedStepMenu === sharedStep.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50" style={{ top: '100%' }}>
                        <button
                          onClick={() => {
                            alert(`Edit ${sharedStep.title} (not implemented yet)`);
                            setShowSharedStepMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Pencil size={16} /> Edit Shared Step
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteSharedStep(sharedStep.id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 size={16} /> Delete Permanently
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showCreateForm && (
        <div className="mt-6 bg-white rounded-lg border border-gray-300 p-4">
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>AI steps</option>
            </select>
            <input
              type="text"
              placeholder="Enter shared step title and press enter"
              value={newSharedStepTitle}
              onChange={(e) => setNewSharedStepTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateSharedStep}
              disabled={!newSharedStepTitle.trim()}
              className={`px-4 py-2 rounded-lg ${
                newSharedStepTitle.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>✨</span>Create
            </button>
          </div>
          <textarea
            placeholder="Enter shared step description (optional)"
            rows={2}
            value={newSharedStepDescription}
            onChange={(e) => setNewSharedStepDescription(e.target.value)}
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>  
  </div>
)}

      {activeTab === 'datasets' && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4"><Table size={32} className="text-teal-600" /></div>
            <h3 className="text-xl font-semibold mb-2">Unlock Datasets with a pro plan</h3>
            <p className="text-gray-600 mb-6">Upgrade now to simplify repetitive test creation and maximize coverage with reusable test data.</p>
            <div className="flex gap-3 justify-center">
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Learn More</button>
              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Upgrade Now</button>
            </div>
          </div>
        </div>
      )}

      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Folder</h2>
              <button onClick={() => setShowCreateFolder(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Folder name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500"><span>📁</span><span>/</span></div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Enter folder description/notes"
                value={folderDescription}
                onChange={(e) => setFolderDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCreateFolder(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateFolder} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Folder</button>
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Filter Test Cases</h2>
              <button onClick={() => setShowFilter(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Folder</label>
                <button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-500 flex items-center gap-2"><span>📁</span><span>0 folder selected</span></button>
              </div>
              <div><select className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option>Match all filters</option></select></div>
              {['State', 'Priority', 'Automation Status', 'Type Of Test Case', 'Tags'].map((label) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 border border-gray-300 rounded-lg">≠</button>
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"><option>Select Options</option></select>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button onClick={() => setShowFilter(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</button>
            </div>
          </div>
        </div>
      )}

      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-5xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>Test Cases</span>
                <ChevronRight size={16} />
                <span className="font-medium">Import</span>
              </div>
              <h2 className="text-2xl font-bold">Import Test Cases</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">
                      Import test cases in both .feature and .csv formats
                    </h3>
                    <p className="text-sm text-blue-700">
                      Easily import both BDD test cases using feature file(s) and traditional test cases into your repository using CSV.
                    </p>
                    <div className="flex gap-3 mt-3">
                      <button className="text-sm text-blue-700 font-medium hover:underline">
                        Read Documentation
                      </button>
                      <button className="text-sm text-blue-700 font-medium hover:underline">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Let AI do the heavy lifting instead</h3>
                    <p className="text-gray-600">
                      Save time by generating test cases directly from a requirement document or a simple prompt using AI
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <span className="text-xl">🔗</span>
                        Try Now
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-80 h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-gray-200">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">✨</div>
                      <p className="text-sm text-gray-600">AI-Generated Test Cases</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Upload .csv or .feature file</h3>
                  <button 
                    onClick={handleImportFile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Proceed
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Upload File:</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Download size={32} className="text-gray-400" />
                      </div>
                      <input
                        type="file"
                        accept=".csv,.feature"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium mb-2"
                      >
                        Upload a file
                      </label>
                      <p className="text-sm text-gray-500">
                        CSV and feature file formats allowed (up to 10 MB)
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    You can also download a{' '}
                    <a href="#" className="text-blue-600 hover:underline">sample.csv</a>
                    {' '}or{' '}
                    <a href="#" className="text-blue-600 hover:underline">sample.feature</a>
                    {' '}with instructions.
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <label className="block text-sm font-medium">Folder Location</label>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-blue-500 rounded flex-shrink-0"></div>
                    <span className="font-medium">{selectedFolder}</span>
                    <div className="ml-auto flex gap-2">
                      <button className="text-sm text-blue-600 hover:underline font-medium">
                        Change Folder
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-sm text-blue-600 hover:underline font-medium">
                        Upload to Root Level
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Update folder location where you want to import the test cases.
                  </p>
                </div>

                <div className="flex items-center justify-center py-4 border-t border-b border-gray-200 mb-6">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <span>Show Less Fields</span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Import inline images</h4>
                      <p className="text-sm text-gray-600">
                        Only enable this if your CSV has public URL for images. This may increase your overall import time.
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">CSV Separator</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Comma(,)</option>
                        <option>Semicolon(;)</option>
                        <option>Tab</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">First Row</label>
                      <input
                        type="number"
                        value="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">File Encoding</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>UTF-8</option>
                        <option>UTF-16</option>
                        <option>ISO-8859-1</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowImport(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateTestCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Test Case</h2>
              <button onClick={() => {
                setShowCreateTestCase(false);
                setNewTestCaseTitle('');
                setNewTestCaseFolder('');
                setNewTestCaseDescription('');
              }}>
                <X size={24} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Test Case Title *</label>
                <input
                  type="text"
                  placeholder="Enter test case title"
                  value={newTestCaseTitle}
                  onChange={(e) => setNewTestCaseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Folder</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newTestCaseFolder}
                  onChange={(e) => setNewTestCaseFolder(e.target.value)}
                >
                  <option value="">Select Folder (Default: {selectedFolder})</option>
                  {folders.map((folder, idx) => (
                    <option key={idx} value={folder.name}>{folder.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Enter test case description"
                  rows={4}
                  value={newTestCaseDescription}
                  onChange={(e) => setNewTestCaseDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateTestCase(false);
                  setNewTestCaseTitle('');
                  setNewTestCaseFolder('');
                  setNewTestCaseDescription('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTestCase}
                disabled={!newTestCaseTitle.trim()}
                className={`px-4 py-2 rounded-lg ${
                  newTestCaseTitle.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditTestCase && editingTestCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Edit Test Case</h2>
              <button onClick={() => {
                setShowEditTestCase(false);
                setEditingTestCase(null);
              }}>
                <X size={24} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-12 gap-6 p-6">
                <div className="col-span-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                        <span>✨</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <span>📁</span>
                      <span>{editingTestCase.folder}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Template</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Test Case Steps</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      placeholder="Write in brief about the test"
                      rows={6}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preconditions</label>
                    <textarea
                      placeholder="Define any preconditions about the test"
                      rows={6}
                      value={editedPreconditions}
                      onChange={(e) => setEditedPreconditions(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Steps and Results</h3>
                    <div className="border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="col-span-1 text-sm font-medium">#</div>
                        <div className="col-span-1 text-sm font-medium">1</div>
                        <div className="col-span-5 text-sm font-medium">Step</div>
                        <div className="col-span-5 text-sm font-medium">Result</div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-1 flex items-center justify-center">
                            <div className="flex flex-col gap-1">
                              <button className="text-gray-400 hover:text-gray-600">⋮⋮</button>
                            </div>
                          </div>
                          <div className="col-span-1 flex items-center text-sm text-gray-600">1</div>
                          <div className="col-span-5">
                            <input
                              type="text"
                              placeholder="Enter step description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-5">
                            <input
                              type="text"
                              placeholder="Enter expected result"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-4 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Test Case Fields</h3>
                    <button className="text-blue-600 text-sm flex items-center gap-1">
                      <span>⚙</span>
                      Configure
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Owner <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={editedOwner}
                      onChange={(e) => setEditedOwner(e.target.value)}
                    >
                      <option>Myself (Lucky Ind)</option>
                      <option>Team Member 1</option>
                      <option>Team Member 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={editedState}
                      onChange={(e) => setEditedState(e.target.value)}
                    >
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Deprecated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={editedPriority}
                      onChange={(e) => setEditedPriority(e.target.value)}
                    >
                      <option>Medium</option>
                      <option>High</option>
                      <option>Low</option>
                      <option>Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Type of Test Case <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={editedType}
                      onChange={(e) => setEditedType(e.target.value)}
                    >
                      <option>Other</option>
                      <option>Functional</option>
                      <option>Performance</option>
                      <option>Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Automation Status <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={editedAutomationStatus}
                      onChange={(e) => setEditedAutomationStatus(e.target.value)}
                    >
                      <option>Not Automated</option>
                      <option>Automated</option>
                      <option>Planned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags <Info size={14} className="inline ml-1 text-gray-400" />
                    </label>
                    <input
                      type="text"
                      placeholder="Add tags and hit ⏎"
                      value={editedTags}
                      onChange={(e) => setEditedTags(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full text-left text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2">
                      <span>Setup your requirement management tool</span>
                      <Info size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditTestCase(false);
                  setEditingTestCase(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTestCase}
                disabled={!editedTitle.trim()}
                className={`px-6 py-2 rounded-lg ${
                  editedTitle.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showTestCaseDetails && renderTestCaseDetailsModal()}
    </div>
  ); 
};