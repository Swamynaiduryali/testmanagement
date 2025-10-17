import React, { useState, useEffect } from "react";
import { get } from "../../APICRUD/apiClient";

export const FolderTestCase = ({ selectedFolder }) => {
  const [folderTestCases, setFolderTestCases] = useState(null);

  // Get the ID/Project ID, or use a safe default if the folder hasn't been selected yet
  const id = selectedFolder?.id;
  const project_id = selectedFolder?.project_id;
  const name = selectedFolder?.name;

  // ✅ 2. useEffect is now safe and runs when dependencies change
  useEffect(() => {
    const fetchFolderTestCases = async () => {
      // Check inside the effect if we have valid IDs before fetching
      if (!id || !project_id) {
        setFolderTestCases(null); // Clear state if IDs are missing
        return;
      }

      try {
        const folderTestCasesRes = await get(
          `/api/projects/${project_id}/test-cases?folder_id=${id}&page=1&page_size=20`
        );
        const folderTestCasesJson = await folderTestCasesRes.json();
        const folderTestCasesData = folderTestCasesJson.data;
        setFolderTestCases(folderTestCasesData);
      } catch (error) {
        setFolderTestCases(null);
        throw new Error("Test Case Fetch Error:", error);
      }
    };
    fetchFolderTestCases();
  }, [id, project_id]);

  if (!selectedFolder) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please select a folder from the left to view its test cases.
      </div>
    );
  }

  const hasTestCases = folderTestCases?.length > 0;

  return (
    <div>
      <h1 className="text-xl font-bold">{name}</h1>
      <p>Total Test Cases: {folderTestCases?.length || 0}</p>
      {!hasTestCases ? (
        <div className="text-gray-500">No Test Cases exist in this folder.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Automation Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {folderTestCases.map((testCase) => (
                <tr key={testCase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {testCase.key}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {testCase.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testCase.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testCase.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testCase.automation_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testCase.owner?.display_name || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
