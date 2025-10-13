import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Card } from "../../CommonComponents/Card";
import { OverTabCreateView } from "./OverTabCreateView";
import CalenderMUI from "../../CommonComponents/CalenderMUI";
import { Graph } from "./Graph";
import { ActiveTestRunsChart } from "./ActiveTestRuns";
import { DashboardWidget } from "./Dashboard";

export const Overviewtab = () => {
  //viewselection
  const [isOpen, setIsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("Default Dashboard View");
  //modalpop up
  const [open, setOpen] = useState(false);
  //days
  const [nday, setDay] = useState("30D");
  //range
  const [range, setRange] = useState([null, null]);
  //calendar
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  //graph
  const [isGraph, setIsGraph] = useState(false);
  // active widgets state to hold saved widgets connection to graph component
  const [activeWidgets, setActiveWidgets] = useState([]);
  //Edit kind of things
  const [widgetToEdit, setWidgetToEdit] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    handleClose();
  };
  const handleDone = () => {
    handleClose();
  };

  const handleViewSelect = (viewName) => {
    setSelectedView(viewName);
    setIsOpen(false);
  };

  const handleDay = (day) => {
    if (day === "Custom") {
      toggleCalender();
    }
    setDay(day);
  };

  const toggleCalender = () => {
    setIsCalenderOpen(!isCalenderOpen);
  };

  const handleGraph = () => {
    setIsGraph((prev) => !prev);
  };

  const handleWidgetSave = (widgetDetails) => {
    const newWidgetData = {
      title: widgetDetails.title,
      type: widgetDetails.widgetType,
    };

    if (widgetToEdit) {
      console.log("Editing widget:", widgetToEdit);
      setActiveWidgets((prev) =>
        prev.map((widget) =>
          widget.id === widgetToEdit.id
            ? {
                ...widget,
                ...newWidgetData,
              }
            : widget
        )
      );
      setWidgetToEdit(null);
    } else {
      setActiveWidgets((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...newWidgetData,
        },
      ]);
    }
    handleGraph();
  };

  // Overviewtab.js

  const handleDelete = (id) => {
    setActiveWidgets((prev) => prev.filter((widget) => widget.id !== id));
  };

  const handleClone = (widget) => {
    setActiveWidgets((prev) => [
      ...prev,
      {
        ...widget,
        id: Date.now(), // Give it a new unique ID
        title: `Clone of ${widget.title}`, // Change the title
      },
    ]);
  };

  const handleEdit = (widget) => {
    setWidgetToEdit(widget);
    setIsGraph(true);
  };

  const days = ["1D", "7D", "30D", "3M", "6M", "1Y", "2Y", "AllTime", "Custom"];
  const insightCards = [
    {
      title: "Automation Coverage",
      value: "33.3%",
      icon: "ph:dots-three-vertical-bold",
    },
    {
      title: "Automated Test Cases",
      value: "2",
      icon: "ph:dots-three-vertical-bold",
    },
    {
      title: "Manual Test Cases",
      value: "4",
      icon: "ph:dots-three-vertical-bold",
    },
    {
      title: "Total Test Cases",
      value: "6",
      icon: "ph:dots-three-vertical-bold",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="m-4 flex justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <button
              className="flex items-center justify-between px-2 py-1 bg-white border border-gray-300 
                         rounded-md focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-offset-1"
              onClick={() => toggleDropdown()}
            >
              <span>{selectedView}</span>
              <Icon icon="mynaui:chevron-up-down" width="20" />
            </button>

            {isOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-max bg-white border border-gray-200 
                           rounded-lg shadow-lg"
              >
                {/* Dropdown Item 1: Default Dashboard View */}
                <div
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 justify-between"
                  onClick={() => handleViewSelect("Default Dashboard View")}
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="uis:graph-bar" width="20" />
                    <span className="font-semibold text-gray-900 white-space-nowrap">
                      Default Dashboard View
                    </span>
                  </div>
                  {selectedView === "Default Dashboard View" && (
                    <Icon
                      icon="ph:check-bold"
                      width="20"
                      className="text-blue-400"
                    />
                  )}
                </div>

                {/* Dropdown Item 2: Automation Trends */}
                <div
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 justify-between"
                  onClick={() => handleViewSelect("Automation Trends")}
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:code" width="20" className="text-gray-500" />
                    <span className="text-gray-700">Automation Trends</span>
                  </div>
                  {selectedView === "Automation Trends" && (
                    <Icon
                      icon="ph:check-bold"
                      width="20"
                      className="text-blue-400"
                    />
                  )}
                </div>

                {/* Dropdown Item 3: Create View */}
                <div
                  className="flex items-center px-4 py-2 cursor-pointer gap-2 text-blue-600 hover:bg-gray-100 border-t"
                  onClick={handleClickOpen} // Just call the state-changing function here
                >
                  <Icon icon="ph:plus" width="20" />
                  <span className="whitespace-nowrap">Create View</span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div>
              {days.map((day, index) => {
                // if day is "Custom" and we have selected range, show formatted range
                const isCustom = day === "Custom";
                const label =
                  isCustom && range[0] && range[1]
                    ? `${range[0].format("DD/MM/YYYY")} - ${range[1].format(
                        "DD/MM/YYYY"
                      )}`
                    : day;

                return (
                  <button
                    key={day}
                    className={`px-2 py-1 border border-gray-300 hover:bg-gray-200 ${
                      index === 0
                        ? "rounded-tl-md rounded-bl-md"
                        : "rounded-none"
                    }
      ${
        index === days.length - 1
          ? "rounded-tr-md rounded-br-md"
          : "rounded-none"
      }
      ${nday === day ? "bg-blue-300" : "bg-white"}`}
                    onClick={() => handleDay(day)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {nday === "Custom" && (
              <div className="absolute top-full right-0 mt-2 text-gray-700 bg-white">
                {isCalenderOpen && (
                  <CalenderMUI value={range} onChange={setRange} width="45px" />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <div>
            <button
              className="flex items-center justify-between border border-gray-300 rounded-md px-2 py-1 bg-white"
              onClick={handleGraph}
            >
              <Icon icon="mdi:widget-box-plus-outline" width="23" />
            </button>
          </div>
          <div>
            <button className="flex items-center justify-between border border-gray-300 rounded-md px-2 py-1 bg-white">
              <Icon icon="material-symbols:edit-sharp" width="23" />
            </button>
          </div>
          <div>
            <button className="flex items-center justify-between border border-gray-300 rounded-md px-2 py-1 bg-white">
              <Icon icon="mdi:filter" width="20" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {isGraph && (
        <Graph
          open={isGraph}
          onClose={() => {
            handleGraph();
            setWidgetToEdit(null);
          }}
          onSave={handleWidgetSave}
          editWidgetData={widgetToEdit}
        />
      )}

      <div className="m-4 flex gap-2">
        {insightCards.map(({ title, value, icon }) => {
          return <Card key={title} name={title} icon={icon} number={value} />;
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {activeWidgets.map((widget) => {
          // Wrap all charts in the DashboardWidget component
          return (
            <DashboardWidget
              key={widget.id}
              title={widget.title}
              onEdit={() => handleEdit(widget)}
              onDelete={() => handleDelete(widget.id)}
              onClone={() => handleClone(widget)}
              onExport={() => alert(`Exporting ${widget.title}...`)}
            >
              {/* Render the appropriate chart inside the wrapper */}
              {widget.type === "ActiveTestRuns" ||
              widget.type === "ClosedTestRuns" ? (
                <ActiveTestRunsChart />
              ) : (
                <div>Unknown Widget Type: {widget.type}</div>
              )}
            </DashboardWidget>
          );
        })}
      </div>

      {open && (
        <OverTabCreateView
          open={open}
          onClose={handleClose}
          handleCancel={handleCancel}
          handleClose={handleClose}
          handleDone={handleDone}
        />
      )}
    </div>
  );
};
