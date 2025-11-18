"use client";

import { useState } from "react";

const KycBox = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [verifiedDocs, setVerifiedDocs] = useState({});
  const [loadingDocs, setLoadingDocs] = useState({});
  const [existingDocs, setExistingDocs] = useState({
    pan: { number: "ABCDE1234F", name: "ABC Company", verified: true },
  });

  const handleFileUpload = (event, docType) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docType]: event.target.files[0]?.name || "",
    }));
  };

  const handleVerify = async (docType, apiLink) => {
    if (!uploadedFiles[docType]) return;

    setLoadingDocs((prev) => ({ ...prev, [docType]: true }));

    try {
      const response = await fetch(apiLink, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document: uploadedFiles[docType] }),
      });

      if (response.ok) {
        setVerifiedDocs((prev) => ({ ...prev, [docType]: true }));
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [docType]: false }));
    }
  };

  const documents = [
    {
      id: "cin",
      title: "CIN",
      fields: ["CIN Number", "Name on CIN"],
      api_link: "https://demo.com/api/pan",
    },
    {
      id: "gst",
      title: "GST",
      fields: ["GST Number", "Name on GST"],
      api_link: "https://demo.com/api/aadhaar",
    },
    {
      id: "pan",
      title: "PAN Card",
      fields: ["PAN Number", "Name on PAN Card"],
      api_link: "https://demo.com/api/dl",
    },
  ];

  return (
    <div className="ls-widget">
      <div className="tabs-box">
        <div className="widget-content">
          <form className="default-form">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="row"
                style={{ padding: "25px 0", borderBottom: "1px solid #ddd" }}
              >
                <h3 className="text-center pb-2">{doc.title}</h3>

                {/* Show Existing Data If Present */}
                {existingDocs[doc.id]?.verified ? (
                  <div className="form-group col-lg-6 col-md-12">
                    <p style={{ marginBottom: "5px" }}>
                      <strong>{doc.fields[0]}:</strong>{" "}
                      {existingDocs[doc.id].number}
                    </p>
                    <p style={{ marginBottom: "5px" }}>
                      <strong>{doc.fields[1]}:</strong>{" "}
                      {existingDocs[doc.id].name}
                    </p>
                    <p className="text-success" style={{ marginBottom: "0px" }}>
                      <strong>Status:</strong> Verified ✅
                    </p>
                  </div>
                ) : (
                  <>
                    {doc.fields.map((field, index) => (
                      <div
                        className="form-group col-lg-4 col-md-12"
                        key={index}
                      >
                        <label htmlFor={`${doc.id}-${index}`}>{field}</label>
                        <input
                          type="text"
                          id={`${doc.id}-${index}`}
                          name={`${doc.id}-${field.replace(/\s+/g, "")}`}
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    ))}

                    {/* File Upload & Verify Button */}
                    <div className="form-group col-lg-4 col-md-12">
                      <label htmlFor={`upload-${doc.id}`}>
                        Upload {doc.title}
                      </label>
                      <div className="uploadButton d-flex align-items-center">
                        <input
                          className="uploadButton-input"
                          type="file"
                          name={`${doc.id}-attachment`}
                          accept="image/*"
                          id={`upload-${doc.id}`}
                          required
                          onChange={(e) => handleFileUpload(e, doc.id)}
                        />
                        <label
                          className="uploadButton-button ripple-effect"
                          htmlFor={`upload-${doc.id}`}
                        >
                          {uploadedFiles[doc.id] || `Browse ${doc.title}..`}
                        </label>
                        <button
                          type="button"
                          className={`theme-btn btn-style-two ml-2 ${
                            verifiedDocs[doc.id] ? "btn-success" : "btn-primary"
                          }`}
                          onClick={() => handleVerify(doc.id, doc.api_link)}
                          disabled={
                            !uploadedFiles[doc.id] || loadingDocs[doc.id]
                          }
                          style={{
                            marginLeft: "10px",
                            backgroundColor: verifiedDocs[doc.id]
                              ? "#28a745"
                              : "#007bff",
                            color: "#fff",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "5px",
                            cursor: verifiedDocs[doc.id]
                              ? "default"
                              : "pointer",
                          }}
                        >
                          {loadingDocs[doc.id]
                            ? "Verifying..."
                            : verifiedDocs[doc.id]
                              ? "Verified ✅"
                              : "Verify"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Save All Button (Centered) */}
            <div
              className="form-group d-flex justify-content-center"
              style={{ paddingTop: "20px" }}
            >
              <button type="submit" className="theme-btn btn-style-one">
                Save All
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KycBox;
