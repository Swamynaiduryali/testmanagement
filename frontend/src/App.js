import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ProjectInsight } from "./Components/ProjectInsights/ProjectInsight";
import { TestCase } from "./Components/TestCases/TestCase";
import { TestRun } from "./Components/TestRuns/TestRun";
import { TestPlan } from "./Components/TestPlans/TestPlan";
import { Report } from "./Components/Reports/Report";
import { CreateTestCase } from "./Components/CreateTestCases/CreateTestCase";

const menuItems = [
  {
    name: "Project Insights",
    icon: "uis:graph-bar",
    path: "/project-insights",
  },
  { name: "Test Cases", icon: "mdi:clipboard-list", path: "/test-cases" },
  { name: "Test Runs", icon: "mdi:play-circle", path: "/test-runs" },
  { name: "Test Plans", icon: "mdi:file-document", path: "/test-plans" },
  { name: "Reports", icon: "mdi:chart-bar", path: "/reports" },
  {
    name: "Create Test Cases",
    icon: "mdi:clipboard-list",
    path: "/create-test-cases",
  },
];

export const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Right Panel with Routes */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/project-insights" element={<ProjectInsight />} />
            <Route path="/test-cases" element={<TestCase />} />
            <Route path="/test-runs" element={<TestRun />} />
            <Route path="/test-plans" element={<TestPlan />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/create-test-cases" element={<CreateTestCase />} />
            <Route path="*" element={<ProjectInsight />} />
            {/* default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-gray-100 border-r transition-all duration-300 flex flex-col`}
    >
      {/* Collapse button */}
      <button onClick={() => setCollapsed(!collapsed)} className="p-2 self-end">
        {collapsed ? (
          <Icon icon="mdi:chevron-right" width="20" />
        ) : (
          <Icon icon="mdi:chevron-left" width="20" />
        )}
      </button>

      {/* Menu */}
      <ul className="flex-1">
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 cursor-pointer p-3 hover:bg-gray-200`}
          >
            <Icon icon={item.icon} width="20" />
            {!collapsed && <span>{item.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
