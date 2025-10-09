import React, { useState } from 'react';

export const Report = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const actionCards = [
    {
      icon: '📋',
      bgColor: 'bg-blue-100',
      title: 'Create a New Project',
      description: 'Start from a clean slate and add data through CSV import',
      action: () => console.log('Create New Project clicked'),
    },
    {
      icon: '➕',
      bgColor: 'bg-blue-100',
      title: 'Explore the Demo Project',
      description: 'View the demo project to explore features of Test Management',
      action: () => console.log('Explore Demo Project clicked'),
    },
    {
      icon: '⬇',
      bgColor: 'bg-blue-100',
      title: 'Import from TestRail, Zephyr Scale, qTest or Xray',
      description: 'Start migrating data from your existing tool to Test Management',
      action: () => console.log('Import clicked'),
    },
    {
      icon: '✨',
      bgColor: 'bg-blue-600',
      title: 'Generate Test Case with AI',
      description: 'Save hours with AI-powered test case creation. Try it now in the demo project',
      action: () => console.log('Generate Test Case with AI clicked'),
      isHighlight: true,
    },
  ];

  const projects = [
    {
      id: 'PR-2',
      title: 'Test',
      subtitle: 'Test',
      testCases: 0,
      testRuns: 0,
      starred: false,
    },
    {
      id: 'PR-1',
      title: 'Demo Project',
      subtitle: 'This project contains test cases and test runs for the demo project',
      testCases: 100,
      testRuns: 5,
      starred: false,
      hasIcon: true,
    },
  ];

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-gray-800">
              ← 
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => console.log('Quick Import clicked')}
            >
              Quick Import
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => console.log('Create Project clicked')}
            >
              Create Project
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange('all')}
            className={`pb-3 px-1 font-medium border-b-2 transition ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Projects <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-sm">2</span>
          </button>
          <button
            onClick={() => handleTabChange('starred')}
            className={`pb-3 px-1 font-medium border-b-2 transition ${
              activeTab === 'starred'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Starred Projects
          </button>
        </div>

        {/* Welcome Banner */}
        {showWelcome && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Welcome to Test Management</h2>
                <p className="text-gray-600 mt-1">Get started by using one of the actions below</p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionCards.map((card, index) => (
                <button
                  key={index}
                  className={`${card.bgColor} ${
                    card.isHighlight ? 'text-white' : 'text-gray-900'
                  } rounded-lg p-4 flex items-start gap-4 hover:opacity-90 transition text-left`}
                  onClick={card.action}
                >
                  <div className={`text-2xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${
                    card.isHighlight ? 'bg-blue-700' : 'bg-white'
                  }`}>
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{card.title}</h3>
                      <span className="text-xl">→</span>
                    </div>
                    <p className={`text-sm ${card.isHighlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      {card.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search projects by title/ID"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Projects Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 w-24">ID</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">PROJECT TITLE</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">QUICK LINKS</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-300 hover:text-yellow-400">
                        {project.starred ? '★' : '☆'}
                      </button>
                      <span className="text-sm font-medium text-gray-700">{project.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-3">
                      {project.hasIcon && (
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          📁
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{project.title}</div>
                        {project.subtitle && (
                          <div className="text-sm text-gray-500 mt-0.5">{project.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-700 hover:underline">
                        {project.testCases} Test Cases
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-blue-600 hover:text-blue-700 hover:underline">
                        {project.testRuns} Test Runs
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No projects found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};