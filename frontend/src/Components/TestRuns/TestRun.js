import React, { useState } from "react";
import { get, post } from "../../APICRUD/apiClient";

export const TestRun = () => {
  const TEST_CASE_ID = "d7e6d758-b9fc-473d-896d-40bb55736546";
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [attachments, setAttachments] = useState([]); // ✅ store fetched files

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading...");

    try {
      // Just sending metadata JSON
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
      const res = await get(`/api/test-cases/${TEST_CASE_ID}/attachments`);
      const data = await res.json ? await res.json() : res;
      console.log("📦 Attachments:", data);
      setAttachments(data);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  };

  const handleViewFile = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank"); // ✅ Opens file directly in new tab
    } else {
      alert("No URL found for this file.");
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

      {/* ✅ List files */}
      {attachments.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>📄 Files:</h3>
          <ul>
            {attachments.map((file) => (
              <li key={file.id} style={{ marginBottom: "10px" }}>
                <strong>{file.filename}</strong> — {file.mime_type}
                <button
                  onClick={() => handleViewFile(file.url)}
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#6f42c1",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  View File
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};