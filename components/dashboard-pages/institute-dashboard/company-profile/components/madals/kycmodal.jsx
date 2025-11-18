import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const KYCModal = ({ show, onClose }) => {
  const [logoImg, setLogoImg] = useState("");

  const logoHandler = (file) => {
    if (file) {
      setLogoImg(file);
    }
  };

  if (!show) return null; // Prevent rendering when modal is closed

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">KYC</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <p style={{ color: "black" }}>Upload your KYC document</p>

            {/* select box */}
            <div className="mb-3">
              <select
                className="form-select"
                aria-label="Select a document type"
              >
                <option>Select Document Type</option>
                <option value="1">GST Certificate</option>
                <option value="2">CIN Certificate</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="mb-3">
              <div className="">
                <div className="uploadButton">
                  <input
                    className="uploadButton-input"
                    type="file"
                    name="attachments[]"
                    accept="application/pdf"
                    id="upload"
                    required
                    onChange={(e) => logoHandler(e.target.files[0])}
                  />
                  <label
                    className="uploadButton-button ripple-effect"
                    htmlFor="upload"
                  >
                    {logoImg ? logoImg.name : "Browse Document"}
                  </label>
                  <span className="uploadButton-file-name"></span>
                </div>
                <div className="text">
                  Max file size: 1MB. Only PDF files are allowed.
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCModal;
