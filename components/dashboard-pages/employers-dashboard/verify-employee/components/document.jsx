import React, { useState } from "react";

const DocumentUpload = ({
  label,
  name,
  fileId,
  onFileChange,
  valuename,
  numbername,
  onfieldChange,
}) => {
  const [documentData, setDocumentData] = useState({
    docName: "",
    docNumber: "",
    file: null,
    filePreview: null,
  });
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setDocumentData({
        ...documentData,
        file,
        filePreview: fileURL,
      });

      if (onFileChange) {
        onFileChange(name, file);
      }
    }
  };
  return (
    <div className="row">
      {/* Heading */}
      {/* Name Input */}
      <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
        <label>{label} Name</label>
        <input
          type="text"
          name={`${name}name`}
          placeholder={`Enter Name on ${label}`}
          className="form-control"
          value={valuename}
          onChange={onfieldChange}
        />
      </div>

      {/* Document Number Input */}
      <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
        <label>{label} Number</label>
        <input
          type="text"
          name={`${name}number`}
          placeholder={`Enter ${label} Number`}
          className="form-control"
          value={numbername}
          onChange={onfieldChange}
        />
      </div>

      {/* File Upload */}
      <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
        <label htmlFor={fileId}>Upload {label}</label>
        <div className="uploadButton d-flex align-items-center">
          <input
            className="uploadButton-input"
            type="file"
            name="file"
            accept="image/*,application/pdf"
            id={fileId}
            onChange={handleFileSelect}
          />
          <label
            className="uploadButton-button ripple-effect"
            htmlFor={fileId}
            style={{ width: "100%", height: "40px", cursor: "pointer" }}
          >
            {documentData.file ? (
              <span
                onClick={() => window.open(documentData.filePreview, "_blank")}
              >
                {documentData.file.name}
              </span>
            ) : (
              `Browse ${label}`
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
