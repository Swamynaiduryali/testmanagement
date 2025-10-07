import { useState } from "react";
import { Icon } from "@iconify/react";
import { AntiSwitch } from "../../CommonComponents/SwitchMUI";

export const ShareLink = () => {
  const [shareLinkTab, setActiveShareLinkTab] = useState("Share dashboard");
  const shareLinkTabs = ["Share dashboard", "Share via public link"];
  const [link] = useState("https://test-management.browserstack.com/project");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(link);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div
      className="flex flex-col absolute top-full right-0 border border-gray-300
             gap-3 bg-white rounded-md shadow-md mt-1 w-96"
    >
      <div className="flex gap-2 px-2">
        {shareLinkTabs.map((tab) => {
          return (
            <div>
              <div
                key={tab}
                className={`px-2 py-2 font-medim text-md border-b-2 transition-colors duration-200
                  ${
                    shareLinkTab === tab
                      ? `border-blue-600 text-blue-600`
                      : `border-transparent hover:border-gray-400 text-gray-700`
                  }`}
                onClick={() => {
                  setActiveShareLinkTab(tab);
                }}
              >
                {tab}
              </div>
            </div>
          );
        })}
      </div>

      {shareLinkTab === "Share dashboard" && (
        <div className="flex flex-col gap-2 p-3">
          <div className="flex border rounded-md overflow-hidden w-full">
            <input
              type="text"
              value={link}
              readOnly
              className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
            >
              <Icon icon="ic:baseline-content-copy" width="15" />
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
          <div className="text-md text-gray-500">
            <p className="text-xs">
              Only accessible to your users onboarded on Test Management
            </p>
          </div>
        </div>
      )}

      {shareLinkTab === "Share via public link" && (
        <div className="flex flex-col">
          <div className="flex items-center p-2 gap-5">
            <div>
              <h4 className="font-semibold">Enable public link</h4>
              <p className="text-xs">
                Anyone on the internet with the public link can view this.
              </p>
            </div>
            <div>
              <AntiSwitch
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </div>
          </div>

          {isPublic && (
            <div className="p-1">
              <div className="flex border rounded-md overflow-hidden w-full">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 outline-none"
                />
                <button
                  onClick={handleShareCopy}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
                >
                  <Icon icon="ic:baseline-content-copy" width="15" />
                  {shareCopied ? "Copied!" : "Copy link"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
