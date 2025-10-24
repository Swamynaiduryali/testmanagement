import { CommonButton } from "../../CommonComponents/Button";
import { PositionedMenu } from "../../CommonComponents/PositionedMenu";

export const FolderTestCase = ({
  selectedFolder,
  folderTestCases,
  handleEditTestCase,
  handleDeleteTestCase,
  handleCreateClick,
}) => {
  if (!selectedFolder) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please select a folder from the left to view its test cases.
      </div>
    );
  }

  const name = selectedFolder.name;
  const hasTestCases = folderTestCases?.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {/* Left side: Heading */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold">{name}</h1>
        </div>

        {/* Right side: Search + Create Button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border-2 rounded-md p-1 w-48"
            placeholder="Search"
          />
          <CommonButton
            variant="contained"
            bgColor="green"
            onClick={handleCreateClick}
          >
            Create
          </CommonButton>
        </div>
      </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <PositionedMenu
                      actions={[
                        {
                          label: "Edit",
                          icon: "mdi:pencil-outline",
                          onClick: () => handleEditTestCase(testCase),
                        },
                        {
                          label: "Delete",
                          icon: "mdi:trash-outline",
                          onClick: () =>
                            handleDeleteTestCase(
                              testCase.id,
                              testCase.project_id
                            ),
                        },
                      ]}
                    />
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
