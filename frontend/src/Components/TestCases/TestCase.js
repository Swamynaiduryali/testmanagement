import React, { useState } from 'react';
import { Search, Filter, Download, Plus, X, ChevronRight, ChevronDown, Info, Table, MoreVertical, Edit } from 'lucide-react';

export const TestCase = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showCreateTestCase, setShowCreateTestCase] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({ Authentication: true });
  const [selectedTestCases, setSelectedTestCases] = useState([]);
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

  const [testCases, setTestCases] = useState([
    { id: 'TC-103', title: 'testmo', folder: 'Authentication' },
    { id: 'TC-99', title: 'TEstsarvind', folder: 'Authentication' },
    { id: 'TC-1', title: 'Verify that valid user credentials result in successful authentication.', folder: 'Authentication' },
    { id: 'TC-2', title: 'Ensure that the user is redirected to the correct landing page after successful authenticati...', folder: 'Authentication' }
  ]);

  const [folders, setFolders] = useState([
    { name: 'Authentication', count: 4, subCount: 12, subfolders: [
      { name: 'Login', count: 2, subCount: 6 },
      { name: 'Logout', count: 2, subCount: 2 }
    ]},
    { name: 'Administration', count: 0, subCount: 8, subfolders: [
      { name: 'Role', count: 0, subCount: 7 },
      { name: 'API Key', count: 1, subCount: 1 }
    ]},
    { name: 'Configuration', count: 1, subCount: 12, subfolders: [
      { name: 'Browsers', count: 5, subCount: 5 },
      { name: 'Devices', count: 6, subCount: 6 }
    ]},
    { name: 'Users', count: 0, subCount: 31 },
    { name: 'Usability', count: 17, subCount: 17 },
    { name: 'Performance', count: 14, subCount: 14 },
    { name: 'Security', count: 6, subCount: 6 }
  ]);

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      // Add new folder to the folders array
      const newFolder = {
        name: folderName,
        count: 0,
        subCount: 0
      };
      
      setFolders([...folders, newFolder]);
      setFolderName('');
      setFolderDescription('');
      setShowCreateFolder(false);
      setSelectedFolder(folderName); // Select the newly created folder
    }
  };

  const handleImportFile = () => {
    alert('Import functionality would be implemented here');
  };

  const handleCreateTestCase = () => {
    if (newTestCaseTitle.trim()) {
      // Generate new test case ID
      const newId = `TC-${testCases.length + 1}`;
      const folderToUse = newTestCaseFolder || selectedFolder;
      
      const newTestCase = {
        id: newId,
        title: newTestCaseTitle,
        folder: folderToUse
      };
      
      // Add new test case to the array
      setTestCases([...testCases, newTestCase]);
      
      // Update folder count
      setFolders(folders.map(folder => {
        if (folder.name === folderToUse) {
          return {
            ...folder,
            count: folder.count + 1,
            subCount: folder.subCount + 1
          };
        }
        return folder;
      }));
      
      // Reset form and close modal
      setNewTestCaseTitle('');
      setNewTestCaseFolder('');
      setNewTestCaseDescription('');
      setShowCreateTestCase(false);
      setSelectedFolder(folderToUse); // Switch to the folder containing the new test case
    }
  };

  const handleFolderClick = (folderName) => {
    setSelectedFolder(folderName);
  };

  const handleEditTestCase = (testCase) => {
    setEditingTestCase(testCase);
    setEditedTitle(testCase.title);
    setEditedDescription('');
    setEditedPreconditions('');
    setEditedOwner('Myself (Lucky Ind)');
    setEditedState('Active');
    setEditedPriority('Medium');
    setEditedType('Other');
    setEditedAutomationStatus('Not Automated');
    setEditedTags('');
    setShowEditTestCase(true);
  };

  const handleUpdateTestCase = () => {
    if (editedTitle.trim()) {
      // Update the test case in the state
      setTestCases(testCases.map(tc => 
        tc.id === editingTestCase.id 
          ? { ...tc, title: editedTitle }
          : tc
      ));
      
      // Close modal and reset
      setShowEditTestCase(false);
      setEditingTestCase(null);
    }
  };

  const getFilteredTestCases = () => {
    return testCases.filter(tc => tc.folder === selectedFolder);
  };

  const getFolderEmptyState = () => {
    const folder = folders.find(f => f.name === selectedFolder);
    if (!folder) return null;
    
    return folder.count === 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Test Cases</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowImport(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => setShowCreateTestCase(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Create Test Case
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <span className="text-xl">✨</span>
              Generate with AI
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-6">
          <button
            onClick={() => setActiveTab('repository')}
            className={`pb-3 font-medium ${
              activeTab === 'repository'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Repository
          </button>
          <button
            onClick={() => setActiveTab('shared-steps')}
            className={`pb-3 font-medium ${
              activeTab === 'shared-steps'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Shared Steps
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`pb-3 font-medium ${
              activeTab === 'datasets'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Datasets
          </button>
        </div>
      </div>

      {/* Repository View */}
      {activeTab === 'repository' && (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-96 bg-white border-r border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-700">Folders</h2>
                <button 
                  onClick={() => setShowCreateFolder(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
              <span>Sort by: Custom</span>
              <span className="text-gray-400">(100)</span>
            </div>

            {/* Folder Tree */}
            <div className="space-y-1">
              {folders.map((folder, idx) => (
                <div key={idx}>
                  <div 
                    className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer ${
                      selectedFolder === folder.name ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div 
                      className="flex items-center gap-2 flex-1" 
                      onClick={() => {
                        toggleFolder(folder.name);
                        handleFolderClick(folder.name);
                      }}
                    >
                      {folder.subfolders ? (
                        expandedFolders[folder.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      ) : (
                        <div className="w-4" />
                      )}
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm font-medium">{folder.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{folder.count}({folder.subCount})</span>
                  </div>
                  
                  {folder.subfolders && expandedFolders[folder.name] && (
                    <div className="ml-6 space-y-1 mt-1">
                      {folder.subfolders.map((subfolder, subIdx) => (
                        <div 
                          key={subIdx} 
                          className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer ${
                            selectedFolder === subfolder.name ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleFolderClick(subfolder.name)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4" />
                            <div className="w-4 h-4 bg-blue-400 rounded"></div>
                            <span className="text-sm">{subfolder.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{subfolder.count}({subfolder.subCount})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Search and Filter Bar */}
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
              <button 
                onClick={() => setShowFilter(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} />
              </button>
            </div>

            {/* Test Cases Header */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{selectedFolder}</h3>
                  <Info size={16} className="text-gray-400" />
                </div>
              </div>

              {/* Empty State or Test Cases List */}
              {getFolderEmptyState() ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Add Test Cases</h3>
                  <p className="text-gray-600 mb-6">You can create test cases by entering details below</p>
                  
                  {/* AI Input at Empty State */}
                  <div className="w-full max-w-3xl bg-white rounded-lg border-2 border-blue-500 p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>AI steps</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Enter test case title and press ⏎ to generate test case deta"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <span>✨</span>
                        Create
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <span>✨</span>
                      Generate with AI
                    </button>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Quick Import
                    </button>
                    <button 
                      onClick={() => setShowImport(true)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Download size={20} />
                      Import Test Cases
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                    <div className="col-span-1">
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="col-span-2">ID</div>
                    <div className="col-span-8">TITLE</div>
                    <div className="col-span-1">P</div>
                  </div>

                  {/* Test Cases List */}
                  {getFilteredTestCases().map((testCase) => (
                    <div key={testCase.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 items-center">
                      <div className="col-span-1">
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="col-span-2 text-sm font-medium">{testCase.id}</div>
                      <div className="col-span-8 text-sm text-blue-600 hover:underline cursor-pointer">
                        {testCase.title}
                      </div>
                      <div className="col-span-1 flex items-center gap-2">
                        <button 
                          onClick={() => handleEditTestCase(testCase)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit size={16} className="text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* AI Input Bar */}
            <div className="mt-6 bg-white rounded-lg border border-gray-300 p-4">
              <div className="flex items-center gap-3">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>AI steps</option>
                </select>
                <input
                  type="text"
                  placeholder="Enter test case title and press ⏎ to generate test case details using AI"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <span>✨</span>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Steps View */}
      {activeTab === 'shared-steps' && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
              <Info size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Shared Steps Available</h3>
            <p className="text-gray-600 mb-6">
              Create a shared step by clicking below and save time by reusing it across multiple test cases & runs.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Shared Step
            </button>
          </div>
        </div>
      )}

      {/* Datasets View */}
      {activeTab === 'datasets' && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <Table size={32} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unlock Datasets with a pro plan</h3>
            <p className="text-gray-600 mb-6">
              Upgrade now to simplify repetitive test creation and maximize coverage with reusable test data.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Learn More
              </button>
              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Folder</h2>
              <button onClick={() => setShowCreateFolder(false)}>
                <X size={24} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Folder name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <span>📁</span>
                <span>/</span>
              </div>
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
              <button
                onClick={() => setShowCreateFolder(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Filter Test Cases</h2>
              <button onClick={() => setShowFilter(false)}>
                <X size={24} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Folder</label>
                <button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-500 flex items-center gap-2">
                  <span>📁</span>
                  <span>0 folder selected</span>
                </button>
              </div>

              <div>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Match all filters</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg">≠</button>
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Select Options</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg">≠</button>
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Select Options</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Automation Status</label>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg">≠</button>
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Select Options</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type Of Test Case</label>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg">≠</button>
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Select Options</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg">≠</button>
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Select Options</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowFilter(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-5xl m-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>Test Cases</span>
                <ChevronRight size={16} />
                <span className="font-medium">Import</span>
              </div>
              <h2 className="text-2xl font-bold">Import Test Cases</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Banner */}
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

              {/* AI Generation Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Let AI do the heavy lifting instead</h3>
                    <p className="text-gray-600">
                      Save time by generating test cases directly from a requirement document or a simple prompt using AI
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <span>🔗</span>
                        Try Now
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <img src="/api/placeholder/300/200" alt="AI Demo" className="rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Upload .csv or .feature file</h3>
                  <button 
                    onClick={handleImportFile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Proceed
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <p className="text-gray-600 mb-4">Upload File:</p>
                  <input
                    type="file"
                    accept=".csv,.feature"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    Choose File
                  </label>
                  <p className="text-sm text-gray-500 mt-2">or drag and drop file here</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
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

      {/* Create Test Case Modal */}
      {showCreateTestCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      {/* Edit Test Case Modal */}
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
                {/* Left Column - Main Content */}
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

                {/* Right Column - Test Case Fields */}
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
    </div>
  );
};

