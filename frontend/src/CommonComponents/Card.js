import { Icon } from "@iconify/react";

export const Card = ({ name, icon, number, tag, chart }) => {
  return (
    <div className="flex flex-col bg-white p-4 rounded-md flex-1 shadow hover:shadow-md transition gap-2">
      {/* Header */}
      <div className="flex justify-between items-center gap-6">
        <span className="font-semibold text-md">{name}</span>
        <Icon icon={icon} width="24" />
      </div>
      {/* Number */}
      <h1 className="text-lg font-bold">{number}</h1>
    </div>
  );
};
