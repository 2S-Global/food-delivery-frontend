"use client";

import { add } from "date-fns";
import { useState } from "react";

const KycBox = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [verifiedDocs, setVerifiedDocs] = useState({});
  const [loadingDocs, setLoadingDocs] = useState({});
  const [existingDocs, setExistingDocs] = useState({
    pan: { number: "", name: "", verified: false },
    aadhaar: { number: "", name: "", verified: false },
    driving: { number: "", name: "", verified: false },
    epic: { number: "", name: "", verified: false },
    passport: { number: "", name: "", verified: false },
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
      id: "pan",
      title: "Pan Card",
      fields: ["Pan Card Number", "Name on Pan Card"],
    },
    {
      id: "aadhaar",
      title: "Aadhaar Card",
      fields: ["Aadhaar Number", "Name on Aadhaar"],
    },
    {
      id: "driving",
      title: "Driving License",
      fields: ["License Number", "Name on License"],
    },
    {
      id: "epic",
      title: "EPIC Card",
      fields: ["EPIC Number", "Name on EPIC"],
    },
    {
      id: "passport",
      title: "Passport",
      fields: ["Passport Number", "Name on Passport"],
    },
  ];

  const addToVerificationCart = (docType, name, number) => {
    console.log("test ", docType + " " + name + " " + number);
  };
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
                  <div className="row">
                    {doc.fields.map((field, index) => {
                      const inputId = `${doc.id}-${index}`;
                      const inputName = `${doc.id}-${field.replace(/\s+/g, "")}`;

                      return (
                        <div
                          className="form-group col-lg-6 col-md-6"
                          key={inputId}
                        >
                          <label htmlFor={inputId}>{field}</label>
                          <input
                            type="text"
                            id={inputId}
                            name={inputName}
                            className="form-control"
                            placeholder={`Enter ${field}`}
                          />
                        </div>
                      );
                    })}

                    {/* Verify Button */}
                    <div className="form-group   align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={() =>
                          addToVerificationCart(doc.id, name, number)
                        }
                      >
                        Add To Verification Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default KycBox;
