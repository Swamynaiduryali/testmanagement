import { Modalpopup } from "../../CommonComponents/Modalpopup";
import { Icon } from "@iconify/react";
import { useState } from "react";

export const OverTabCreateView = ({
  open,
  handleCancel,
  handleDone,
  handleClose,
}) => {
  const [isPublic, setIsPublic] = useState(false);
  const toggleSwitch = () => {
    setIsPublic(!isPublic);
  };

  const Header = () => {
    return (
      <div>
        <h1>Create Dashboard View</h1>
        <p className="text-sm text-gray-500">
          These saved views will be visible across all projects
        </p>
      </div>
    );
  };

  const Content = () => {
    const [viewName, setViewName] = useState("Untitled View Name");

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="viewName" className="text-sm">
            Dashboard View Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            id="viewName"
            placeholder="Enter dashboard view name"
            className="text-sm border-gray-300 rounded-sm border-2 p-1 focus:outline-none focus:ring-blue-500 
            focus:ring-1"
          />
          <p className="text-sm text-gray-500">
            New view will be saved in ‘Dashboard Views dropdown
          </p>
        </div>

        <div className="flex justify-between">
          <div>
            <h4>Public Dashboard View</h4>
            <p className="text-gray-400">
              Allow this view to be visible to all users in Test Management
            </p>
          </div>

          <div>
            <div
              onClick={toggleSwitch}
              className={`w-12 h-6  rounded-full flex items-center 
            p-1 cursor-pointer transform transition-colors duration-300
            ${isPublic ? "bg-blue-600" : "bg-gray-300"}
            `}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform 
                transition-transform duration-300 will-change-transform
                ${isPublic ? "translate-x-6" : "translate-x-0"}
                `}
              />
            </div>
          </div>
        </div>
        {!isPublic && (
          <div className="flex p-4 bg-yellow-50 rounded-md gap-2 transition-all duration-300">
            <Icon
              icon={"material-symbols-light:warning"}
              width="24"
              className="text-orange-300"
            />
            <p className="text-sm text-orange-300">
              Changing a dashboard view from public to a private will make it
              inaccessible for other users.
            </p>
          </div>
        )}
      </div>
    );
  };

  const Buttons = ({ handleCancel, handleDone }) => {
    return (
      <div>
        <div className="flex gap-2">
          <button
            className="p-1 h-8 w-16 border-gray-400 border-2 text-sm rounded-md text-gray-500 text-center"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 h-8 w-16 text-white text-sm rounded-md p-1 text-center "
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    );
  };
  return (
    <Modalpopup
      open={open}
      onClose={handleClose}
      header={<Header />}
      content={<Content />}
      buttons={<Buttons handleCancel={handleCancel} handleDone={handleDone} />}
      width="35%"
    />
  );
};
