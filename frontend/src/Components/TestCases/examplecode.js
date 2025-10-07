// import React, { useState } from "react";
// // import { ChevronDown, ChevronRight, Search, Filter, MoreVertical, Download, Sparkles, Info, Grid } from 'lucide-react';
// import { Icon } from '@iconify/react';

// // Initial folder structure data
// const foldersInitial = [
//   {
//     name: "Authentication",
//     count: "4(12)",
//     children: [
//       { name: "Login", count: "2(6)", children: [] },
//       { name: "Logout", count: "2(2)", children: [] },
//     ],
//   },
//   {
//     name: "Administration",
//     count: "0(8)",
//     children: [
//       {
//         name: "Role",
//         count: "0(7)",
//         children: [
//           { name: "Admin", count: "4(4)", children: [] },
//           { name: "Owner", count: "2(2)", children: [] },
//           { name: "Product User", count: "1(1)", children: [] },
//           { name: "API Key", count: "1(1)", children: [] },
//         ],
//       },
//     ],
//   },
//   {
//     name: "Configuration",
//     count: "1(12)",
//     children: [
//       { name: "Browsers", count: "5(5)", children: [] },
//       { name: "Devices", count: "6(6)", children: [] },
//     ],
//   },
//   {
//     name: "Users",
//     count: "0(31)",
//     children: [
//       { name: "Profile", count: "6(6)", children: [] },
//       {
//         name: "Account",
//         count: "8(25)",
//         children: [
//           { name: "Privacy", count: "2(2)", children: [] },
//           { name: "Deactivation & Deletion", count: "8(8)", children: [] },
//           { name: "Notifications", count: "4(4)", children: [] },
//           { name: "Language", count: "3(3)", children: [] },
//         ],
//       },
//     ],
//   },
// ];

// // Recursive Folder component for hierarchical display
// function Folder({ folder, level, expandedMap, toggleExpand }) {
//   const hasChildren = folder.children && folder.children.length > 0;
//   const isExpanded = expandedMap[folder.name];

//   return (
//     <div>
//       <div
//         className="flex items-center py-1 cursor-pointer hover:bg-gray-100 select-none"
//         style={{ paddingLeft: `${level * 20}px` }}
//         onClick={() => hasChildren && toggleExpand(folder.name)}
//       >
//         {hasChildren ? (
//           <span className="mr-2 text-gray-500 font-bold select-none">
//             {isExpanded ? "v" : ">"}
//           </span>
//         ) : (
//           <span className="mr-6" />
//         )}
//         <svg
//           className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path d="M4 4h12v2H4V4zm0 4h12v2H4V8zm0 4h12v2H4v-2zm0 4h12v2H4v-2z" />
//         </svg>
//         <span className="flex-1">{folder.name}</span>
//         <span className="text-gray-400 ml-2">{folder.count}</span>
//       </div>
//       {hasChildren && isExpanded && (
//         <div>
//           {folder.children.map((child) => (
//             <Folder
//               key={child.name}
//               folder={child}
//               level={level + 1}
//               expandedMap={expandedMap}
//               toggleExpand={toggleExpand}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// } 

// export const TestCase = () => {
//   // Tab state
//   const [tab, setTab] = useState("Repository");
  
//   // Folder expand/collapse state
//   const [expandedMap, setExpandedMap] = useState({
//     Authentication: true,
//     Administration: true,
//     Role: false,
//     Users: true,
//     Account: false,
//   });

//   // Dynamic folders state (for adding new folders)
//   const [folders, setFolders] = useState(foldersInitial);

//   // Test cases state
//   const [testCases, setTestCases] = useState([
//     { id: "TC-103", title: "testmo", priority: "Medium", owner: "Lucky Ind", tags: "--" },
//     { id: "TC-99", title: "TEtsarvind", priority: "Medium", owner: "Lucky Ind", tags: "--" },
//     {
//       id: "TC-1",
//       title: "Verify that valid user credentials result in successful authentication.",
//       priority: "Medium",
//       owner: "Lucky Ind",
//       tags: "--",
//     },
//     {
//       id: "TC-2",
//       title: "Ensure that the user is redirected to the correct landing page after successful authentication.",
//       priority: "Medium",
//       owner: "Lucky Ind",
//       tags: "--",
//     },
//   ]);

//   // Search functionality
//   const [searchTerm, setSearchTerm] = useState("");
//   const filteredTestCases = testCases.filter(
//     (tc) =>
//       tc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       tc.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Folder modal state
//   const [showFolderModal, setShowFolderModal] = useState(false);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [newFolderDesc, setNewFolderDesc] = useState("");

//   // Test case modal state
//   const [showModal, setShowModal] = useState(false);
//   const [modalForm, setModalForm] = useState({
//     id: "",
//     title: "",
//     priority: "Medium",
//     owner: "",
//     tags: "",
//     description: "",
//     preconditions: "",
//     steps: [{ step: "", result: "" }],
//   });
  
//   const [loading, setLoading] = useState(false);

//   // Toggle folder expand/collapse
//   const toggleExpand = (folderName) => {
//     setExpandedMap((prev) => ({
//       ...prev,
//       [folderName]: !prev[folderName],
//     }));
//   };

//   // Create new folder
//   const handleCreateFolder = () => {
//     if (!newFolderName.trim()) {
//       alert("Folder name is required");
//       return;
//     }
//     setFolders([
//       ...folders,
//       { name: newFolderName.trim(), count: "0(0)", children: [], description: newFolderDesc.trim() },
//     ]);
//     setNewFolderName("");
//     setNewFolderDesc("");
//     setShowFolderModal(false);
//   };

//   // Handle modal form changes
//   const handleModalChange = (e) => {
//     const { name, value } = e.target;
//     setModalForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle test step changes
//   const handleStepChange = (index, field, value) => {
//     const newSteps = [...modalForm.steps];
//     newSteps[index][field] = value;
//     setModalForm((prev) => ({ ...prev, steps: newSteps }));
//   };

//   // Add new test step
//   const addStepRow = () => {
//     setModalForm((prev) => ({
//       ...prev,
//       steps: [...prev.steps, { step: "", result: "" }],
//     }));
//   };

//   // Remove test step
//   const removeStepRow = (index) => {
//     if (modalForm.steps.length > 1) {
//       const newSteps = modalForm.steps.filter((_, i) => i !== index);
//       setModalForm((prev) => ({ ...prev, steps: newSteps }));
//     }
//   };

//   // Smart fill functionality (mock implementation)
//   const smartFill = () => {
//     if (!modalForm.title.trim()) {
//       alert("Please enter a test case title first.");
//       return;
//     }

//     setLoading(true);
//     // Mock AI response
//     setTimeout(() => {
//       setModalForm((prev) => ({
//         ...prev,
//         description: `Test case for verifying: ${prev.title}`,
//         preconditions: "User should have valid credentials and system should be accessible",
//       }));
//       setLoading(false);
//     }, 1500);
//   };

//   // Generate test steps functionality (mock implementation)
//   const generateTestSteps = () => {
//     if (!modalForm.title.trim()) {
//       alert("Please enter a test case title first.");
//       return;
//     }

//     setLoading(true);
//     // Mock AI response
//     setTimeout(() => {
//       const generatedSteps = [
//         { step: "Navigate to the application login page", result: "Login page is displayed correctly" },
//         { step: "Enter valid username and password", result: "Credentials are accepted" },
//         { step: "Click the login button", result: "User is successfully logged in" },
//         { step: "Verify user is redirected to dashboard", result: "Dashboard page loads with user information" },
//       ];
//       setModalForm((prev) => ({ ...prev, steps: generatedSteps }));
//       setLoading(false);
//     }, 2000);
//   };

//   // Create test case
//   const handleCreateTestCase = () => {
//     if (!modalForm.id.trim() || !modalForm.title.trim()) {
//       alert("Please fill in Test Case ID and Title");
//       return;
//     }

//     if (testCases.some((tc) => tc.id === modalForm.id.trim())) {
//       alert("Test Case ID already exists");
//       return;
//     }

//     const newTestCase = {
//       id: modalForm.id,
//       title: modalForm.title,
//       priority: modalForm.priority,
//       owner: modalForm.owner || "Unassigned",
//       tags: modalForm.tags || "--",
//     };

//     setTestCases((prev) => [...prev, newTestCase]);

//     // Reset form and close modal
//     setModalForm({
//       id: "",
//       title: "",
//       priority: "Medium",
//       owner: "",
//       tags: "",
//       description: "",
//       preconditions: "",
//       steps: [{ step: "", result: "" }],
//     });
//     setShowModal(false);
//   };

//   return (
//     <div className="flex flex-col h-screen font-sans bg-white">
//       {/* Header */}
//       <div className="flex items-center justify-between border-b px-8 py-6">
//         <span className="text-2xl font-bold">Test Cases</span>
//         <div className="flex gap-3">
//           <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
//                         <Icon icon="mdi:download" width="20" />
//                       </button>
//           <button
//             onClick={() => setShowModal(true)}
//             className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
//           >
//             Create Test Case
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b px-8 text-sm font-medium text-gray-500">
//         {["Repository", "Shared Steps", "Datasets"].map((t) => (
//           <div
//             key={t}
//             className={`mr-6 cursor-pointer py-3 ${
//               tab === t ? "border-b-2 border-blue-600 text-blue-600" : ""
//             }`}
//             onClick={() => setTab(t)}
//           >
//             {t}
//           </div>
//         ))}
//       </div>

//       {/* Main Content */}
//       {tab === "Repository" && (
//         <div className="flex flex-1 overflow-hidden px-8">
//           {/* Left sidebar */}
//           <div className="w-72 border-r flex flex-col h-full">
//             <div className="flex items-center justify-between px-2 text-sm font-semibold text-gray-700 mt-4 mb-2">
//               <span>Folders</span>
//               <button
//                 onClick={() => setShowFolderModal(true)}
//                 className="p-1 border rounded hover:bg-gray-100"
//                 title="Create Folder"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="text-xs text-gray-400 font-light mb-4 pl-2">
//               Sort by: Custom ({folders.length})
//             </div>
//             <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-1">
//               {folders.map((folder) => (
//                 <Folder
//                   key={folder.name}
//                   folder={folder}
//                   level={1}
//                   expandedMap={expandedMap}
//                   toggleExpand={toggleExpand}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Middle section - Test Cases */}
//           <div className="flex-1 flex flex-col p-6 overflow-hidden">
//             <div className="flex justify-between items-center mb-4 text-sm text-gray-700">
//               <div>
//                 <span className="font-semibold mr-1">Authentication</span>
//                 <span className="cursor-help" title="Information">
//                   ℹ
//                 </span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <input
//                   type="text"
//                   placeholder="Search by Test Case ID or Title"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="border border-gray-300 rounded px-3 py-1 w-64 outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                <button
//                   className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100 transition-shadow shadow-sm"
//                   title="Filter"
//                 >
//                   <Icon icon="mdi:filter" width="20" height="20" className="text-gray-700" />
//                 </button>
//               </div>
//             </div>
            
//            <div className="flex-1 border rounded-md overflow-auto max-h-[400px]">

//               <table className="min-w-full table-fixed text-sm border-collapse">


//                 <thead className="border-b bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th className="w-10 p-2">
//                       <input type="checkbox" />
//                     </th>
//                     <th className="w-24 p-2 text-left">ID</th>
//                     <th className="flex-1 p-2 text-left">TITLE</th>
//                     <th className="w-32 p-2 text-left">PRIORITY</th>
//                     <th className="w-36 p-2 text-left">OWNER</th>
//                     <th className="w-24 p-2 text-left">TAGS</th>
//                     <th className="w-10 p-2"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTestCases.map((tc) => (
//                     <tr
//                       key={tc.id}
//                       className="border-b hover:bg-gray-50 cursor-pointer"
//                     >
//                       <td className="p-2">
//                         <input type="checkbox" />
//                       </td>
//                       <td className="p-2">{tc.id}</td>
//                       <td className="p-2 font-semibold">{tc.title}</td>
//                       <td className="p-2 text-blue-500">{tc.priority}</td>
//                       <td className="p-2">{tc.owner}</td>
//                       <td className="p-2">{tc.tags}</td>
//                       <td className="p-2">
//                         <button className="text-gray-400 hover:text-gray-600">
//                           ⋮
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   {filteredTestCases.length === 0 && (
//                     <tr>
//                       <td colSpan="7" className="p-4 text-center text-gray-400">
//                         No test cases found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Other tabs content */}
//       {tab === "Shared Steps" && (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="w-full max-w-xl mx-auto bg-white border rounded-lg py-16 flex flex-col items-center">
//             <div className="flex items-center justify-center mb-4">
//               <span className="text-4xl text-gray-400">ⓘ</span>
//             </div>
//             <div className="text-lg font-semibold text-gray-700 mb-1">
//               No Shared Steps Available
//             </div>
//             <div className="text-gray-600 text-sm text-center mb-7">
//               Create a shared step by clicking below and save time by reusing it
//               across multiple test cases & runs.
//             </div>
//             <button className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">
//               Create Shared Step
//             </button>
//           </div>
//         </div>
//       )}

//       {tab === "Datasets" && (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="w-full max-w-xl mx-auto bg-white border rounded-lg py-16 flex flex-col items-center">
//             <div className="flex items-center justify-center mb-4">
//               <svg width={38} height={38} fill="none" stroke="green" strokeWidth={2} viewBox="0 0 24 24">
//                 <rect x="2" y="6" width="20" height="12" rx="2" stroke="green" strokeWidth={2} fill="none" />
//                 <line x1="2" y1="10" x2="22" y2="10" stroke="green" strokeWidth={2} />
//                 <line x1="2" y1="14" x2="22" y2="14" stroke="green" strokeWidth={2} />
//               </svg>
//             </div>
//             <div className="text-lg font-semibold text-gray-700 mb-1">
//               Unlock Datasets with a pro plan
//             </div>
//             <div className="text-gray-600 text-sm text-center mb-8">
//               Upgrade now to simplify repetitive test creation and maximize
//               coverage with reusable test data.
//             </div>
//             <div className="flex gap-4">
//               <button className="px-6 py-2 bg-white border border-gray-400 rounded text-gray-700 font-semibold hover:bg-gray-100">
//                 Learn More
//               </button>
//               <button className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700">
//                 Upgrade Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Folder Creation Modal */}
//       {showFolderModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
//             <div className="text-xl font-bold mb-4 flex justify-between items-center">
//               <span>Create Folder</span>
//               <button
//                 onClick={() => setShowFolderModal(false)}
//                 className="text-gray-600 hover:text-gray-800"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mb-3">
//               <label className="block font-medium mb-2">
//                 Folder name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 value={newFolderName}
//                 onChange={(e) => setNewFolderName(e.target.value)}
//                 className="border w-full p-2 rounded mb-1"
//                 placeholder="Enter folder name"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block font-medium mb-2">Description</label>
//               <textarea
//                 value={newFolderDesc}
//                 onChange={(e) => setNewFolderDesc(e.target.value)}
//                 className="border w-full p-2 rounded"
//                 placeholder="Enter folder description/notes"
//                 rows={3}
//               />
//             </div>
//             <div className="flex justify-end space-x-3 mt-4">
//               <button
//                 onClick={() => setShowFolderModal(false)}
//                 className="px-4 py-2 rounded border hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCreateFolder}
//                 className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Create Folder
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Test Case Creation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-auto">
//           <div className="bg-white rounded-lg p-6 max-w-5xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-semibold">Create Test Case</h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-500 hover:text-gray-800 text-2xl"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Left column - Main form */}
//               <div className="lg:col-span-2 space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Test Case ID <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     name="id"
//                     type="text"
//                     value={modalForm.id}
//                     onChange={handleModalChange}
//                     className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                     disabled={loading}
//                     placeholder="e.g., TC-001"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     name="title"
//                     type="text"
//                     value={modalForm.title}
//                     onChange={handleModalChange}
//                     className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                     disabled={loading}
//                     placeholder="Brief description of what you're testing"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     rows={3}
//                     value={modalForm.description}
//                     onChange={handleModalChange}
//                     className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                     disabled={loading}
//                     placeholder="Detailed description of the test case"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Preconditions
//                   </label>
//                   <textarea
//                     name="preconditions"
//                     rows={3}
//                     value={modalForm.preconditions}
//                     onChange={handleModalChange}
//                     className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                     disabled={loading}
//                     placeholder="What needs to be set up before running this test"
//                   />
//                 </div>

//                 <div className="flex space-x-2">
//                   <button
//                     onClick={smartFill}
//                     className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
//                     disabled={loading}
//                   >
//                     {loading ? "Loading..." : "Smart Fill"}
//                   </button>
//                   <button
//                     onClick={generateTestSteps}
//                     className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//                     disabled={loading}
//                   >
//                     {loading ? "Generating..." : "Generate Steps"}
//                   </button>
//                 </div>

//                 {/* Test Steps */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-800 mb-3">
//                     Test Steps and Expected Results
//                   </h3>
//                   <div className="space-y-4">
//                     {modalForm.steps.map((step, idx) => (
//                       <div key={idx} className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">
//                             Step {idx + 1}
//                           </label>
//                           <textarea
//                             rows={2}
//                             className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                             placeholder="Describe the action to take"
//                             value={step.step}
//                             onChange={(e) => handleStepChange(idx, "step", e.target.value)}
//                             disabled={loading}
//                           />
//                         </div>
//                         <div>
//                           <div className="flex justify-between items-center mb-1">
//                             <label className="block text-xs font-medium text-gray-600">
//                               Expected Result
//                             </label>
//                             {modalForm.steps.length > 1 && (
//                               <button
//                                 onClick={() => removeStepRow(idx)}
//                                 className="text-red-500 hover:text-red-700 text-sm"
//                                 disabled={loading}
//                               >
//                                 Remove
//                               </button>
//                             )}
//                           </div>
//                           <textarea
//                             rows={2}
//                             className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                             placeholder="What should happen"
//                             value={step.result}
//                             onChange={(e) => handleStepChange(idx, "result", e.target.value)}
//                             disabled={loading}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     onClick={addStepRow}
//                     className="mt-2 text-sm text-blue-600 hover:underline"
//                     disabled={loading}
//                   >
//                     + Add Another Step
//                   </button>
//                 </div>
//               </div>

//               {/* Right column - Metadata */}
//               <div className="space-y-6 p-4 border rounded-md bg-gray-50">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Priority
//                   </label>
//                   <select
//                     name="priority"
//                     value={modalForm.priority}
//                     onChange={handleModalChange}
//                     disabled={loading}
//                     className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                   >
//                     <option>Low</option>
//                     <option>Medium</option>
//                     <option>High</option>
//                     <option>Critical</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Owner
//                   </label>
//                   <input
//                     name="owner"
//                     type="text"
//                     value={modalForm.owner}
//                     onChange={handleModalChange}
//                     disabled={loading}
//                     className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                     placeholder="Test case owner"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Tags
//                   </label>
//                   <input
//                     name="tags"
//                     type="text"
//                     value={modalForm.tags}
//                     onChange={handleModalChange}
//                     disabled={loading}
//                     className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
//                     placeholder="Comma-separated tags"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Modal Actions */}
//             <div className="mt-6 flex justify-end space-x-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCreateTestCase}
//                 className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
//                 disabled={loading}
//               >
//                 {loading ? "Creating..." : "Save Test Case"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

