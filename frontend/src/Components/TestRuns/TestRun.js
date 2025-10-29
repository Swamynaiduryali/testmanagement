import React, { useState } from "react";
import { get, post } from "../../APICRUD/apiClient";

export const TestRun = () => {
  const TEST_CASE_ID = "d7e6d758-b9fc-473d-896d-40bb55736546";
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📁 Selected:", file.name);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading...");

    try {
      // Build JSON payload (not FormData)
      const payload = {
        filename: selectedFile.name,
        mime_type: selectedFile.type,
        size_bytes: selectedFile.size,
        url: `https://storage.example.com/screenshots/${selectedFile.name}`,
      };

      const response = await post(
        `/api/test-cases/${TEST_CASE_ID}/attachments`,
        payload
      );

      console.log("✅ Upload successful:", response);
      setUploadStatus("✅ Uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setUploadStatus(`❌ Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFetchAttachments = async () => {
    try {
      const response = await get(`/api/test-cases/${TEST_CASE_ID}/attachments`);
      console.log("📦 Attachments:", response);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📂 Test Case Attachments</h2>

      <input type="file" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          backgroundColor: uploading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <button
        onClick={handleFetchAttachments}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Fetch Attachments
      </button>

      {uploadStatus && (
        <p style={{ marginTop: "15px", fontWeight: "bold" }}>{uploadStatus}</p>
      )}
    </div>
  );
};
