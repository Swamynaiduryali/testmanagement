import { CommonButton } from "../../CommonComponents/Button";
import { Icon } from "@iconify/react";

export const CreateTestCase = ({
  addStep,
  formData,
  errors,
  handleStepAdd,
  handleStepChange,
  handleRemoveStep,
  handleInputChange,
}) => {
  return (
    <div className="flex rounded-md bg-white p-2 h-screen">
      {/* Left: Main form */}
      <div className="w-full flex-col overflow-y-auto p-4">
        <form>
          {/* Top row: Title */}
          <div className="flex justify-between gap-2 mb-4">
            {/* Title */}
            <div className="flex-1 flex-col">
              <label htmlFor="title">
                Title <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter Test Case Name"
                className={`border-2 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-full`}
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Description and Preconditions */}
          <div className="mb-4">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Write in brief about the test"
              className="w-full border-2 border-gray-300 rounded-md p-2 h-24"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="preconditions">Preconditions</label>
            <textarea
              id="preconditions"
              name="preconditions"
              placeholder="Define any preconditions"
              className="w-full border-2 border-gray-300 rounded-md p-2 h-24"
              value={formData.preconditions}
              onChange={handleInputChange}
            />
          </div>

          {/* Steps & Results */}
          <h3 className="font-bold mb-2">Steps, Expected and Actual Results</h3>
          {addStep.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col gap-2 bg-white shadow-md rounded-md p-3 mb-3"
            >
              {/* Step */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div>
                    <p className="font-bold">{index + 1}</p>
                  </div>
                  {/* Step description */}
                  <div className="w-full flex flex-col">
                    <label htmlFor={`step-${step.id}`}>Step</label>
                    <textarea
                      id={`step-${step.id}`}
                      value={step.step}
                      placeholder="Details of Step"
                      className={`border-2 rounded-md p-2 h-24 ${
                        errors.steps[index]?.step
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onChange={(e) =>
                        handleStepChange(index, "step", e.target.value)
                      }
                    />
                    {errors.steps[index]?.step && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.steps[index].step}
                      </p>
                    )}
                  </div>
                  {/* Expected Result */}
                  <div className="flex flex-col w-full">
                    <label htmlFor={`expectedResult-${step.id}`}>
                      Expected Result
                    </label>
                    <textarea
                      id={`expectedResult-${step.id}`}
                      value={step.expectedResult}
                      placeholder="Expected Result"
                      className={`border-2 rounded-md p-2 h-24 w-full ${
                        errors.steps[index]?.expectedResult
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onChange={(e) =>
                        handleStepChange(
                          index,
                          "expectedResult",
                          e.target.value
                        )
                      }
                    />
                    {errors.steps[index]?.expectedResult && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.steps[index].expectedResult}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <div className="flex justify-end">
                  <CommonButton
                    variant="Contained"
                    bgColor="gray"
                    hoverBgColor="red"
                    textTransform="capitalize"
                    endIcon={<Icon icon="ep:remove" />}
                    onClick={(e) => handleRemoveStep(e, step.id)}
                  >
                    Remove
                  </CommonButton>
                </div>
              </div>
            </div>
          ))}

          {/* Add step button */}
          <div>
            <CommonButton
              startIcon={<Icon icon="material-symbols:add-rounded" />}
              variant="contained"
              onClick={handleStepAdd}
            >
              Add Step
            </CommonButton>
          </div>

          {/* Attachments */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">Attachments</h3>
            <input type="file" />
          </div>
        </form>
      </div>

      {/* Sidebar: Test case metadata */}
      <div className="w-1/3 flex-col overflow-y-auto p-4">
        <h3 className="font-bold mb-4">Test Case Fields</h3>
        {/* Owner */}
        <div className="flex flex-col mb-4">
          <label htmlFor="owner">
            Owner <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="owner"
            name="owner"
            value={formData.owner}
            className="border-2 border-gray-300 rounded-md p-2 w-full"
            onChange={handleInputChange}
          >
            <option value="owner1">Owner1</option>
          </select>
        </div>
        {/* State */}
        <div className="flex flex-col mb-4">
          <label htmlFor="state">
            State <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            className="border-2 border-gray-300 rounded-md p-2 w-full"
            onChange={handleInputChange}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        {/* Priority */}
        <div className="flex flex-col mb-4">
          <label htmlFor="priority">
            Priority <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            className="border-2 border-gray-300 rounded-md p-2 w-full"
            onChange={handleInputChange}
          >
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
        {/* Type of test case */}
        <div className="flex flex-col mb-4">
          <label htmlFor="typeOfTestCase">
            Type Of Test Case <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="typeOfTestCase"
            name="typeOfTestCase"
            value={formData.typeOfTestCase}
            className="border-2 border-gray-300 rounded-md p-2 w-full"
            onChange={handleInputChange}
          >
            <option value="FUNCTIONAL">FUNCTIONAL</option>
            <option value="NON_FUNCTIONAL">NON_FUNCTIONAL</option>
            <option value="REGRESSION">REGRESSION</option>
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="automationstatus">
            Type Of Test Case <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="automationstatus"
            name="automationstatus"
            value={formData.automationstatus}
            className="border-2 border-gray-300 rounded-md p-2 w-full"
            onChange={handleInputChange}
          >
            <option value="NOT_AUTOMATED">NOT_AUTOMATED</option>
            <option value="AUTOMATED">AUTOMATED</option>
          </select>
        </div>
      </div>
    </div>
  );
};
