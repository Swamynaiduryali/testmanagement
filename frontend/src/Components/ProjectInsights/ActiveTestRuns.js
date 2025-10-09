import { PieChart, Pie, Cell, Tooltip } from "recharts";

// --- Data (Should ideally be passed as props in a real app) ---
// Kept local for simplicity, but in a real app, this data would come from API calls
// based on filters selected in WidgetDetails.
const testData = [
  { name: "Passed", value: 238, color: "#22c55e" }, // green
  { name: "Untested", value: 85, color: "#a3e635" }, // lime
  { name: "Failed", value: 100, color: "#ef4444" }, // red
  { name: "Skipped", value: 35, color: "#9ca3af" }, // gray
  { name: "Retest", value: 20, color: "#facc15" }, // yellow
  { name: "Blocked", value: 12, color: "#3b82f6" }, // blue
];
// const totalTestCases = testData.reduce((sum, item) => sum + item.value, 0);

// Custom Tooltip Component (copied from your original code)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = testData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(2);

    return (
      <div className="bg-gray-800 text-white p-2 rounded-md text-xs font-semibold shadow-lg">
        <p>
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: data.color }}
          ></span>
          {`${data.name}: ${data.value} (${percentage}%)`}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Legend Component (copied from your original code)
const CustomLegend = () => {
  const total = testData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="ml-4">
      {testData.map((entry, index) => {
        const percentage = ((entry.value / total) * 100).toFixed(2);
        return (
          <p key={`legend-${index}`} className="flex items-center text-sm mb-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-gray-700 font-medium mr-6">{entry.name}</span>
            <span className="ml-auto text-gray-600">
              {entry.value}
              <span className="ml-1 text-xs text-gray-500">
                ({percentage}%)
              </span>
            </span>
          </p>
        );
      })}
    </div>
  );
};

// Custom Center Content Component (copied from your original code)
const CenterContent = ({ total }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
    <p className="text-2xl font-bold">{total}</p>
    <p className="text-xs text-gray-500">Total Test Cases</p>
  </div>
);

// --- The new reusable component ---
export const ActiveTestRunsChart = ({ widgetTitle }) => {
  const totalTestCases = testData.reduce((sum, item) => sum + item.value, 0);
  return (
    <>
      <h2 className="text-lg font-semibold mb-2">{widgetTitle}</h2>
      <div className="flex py-16">
        {/* Chart Wrapper: Using relative positioning for the center content */}
        <div className="relative">
          <PieChart width={250} height={250}>
            <Pie
              data={testData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={100}
            >
              {testData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/* Custom Tooltip */}
            <Tooltip content={<CustomTooltip />} />
          </PieChart>

          {/* Total count in the center */}
          <CenterContent total={totalTestCases} />
        </div>

        {/* Custom Legend to display data breakdown */}
        <div className="mt-14 flex-1">
          <CustomLegend />
        </div>
      </div>
    </>
  );
};
