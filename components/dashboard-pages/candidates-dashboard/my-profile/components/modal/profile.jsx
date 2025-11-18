import React, { useState } from "react";

const Profile = () => {
  const [headline, setHeadline] = useState("");

  if (!show) return null;

  return (
    <>
      <style>
        {`
  .custom-textarea::placeholder {
    color: #c7c5c5!important;
    font-size: 15px !important;
  
  }
`}
      </style>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Resume Headline</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <p style={{ color: "black" }}>
                It is the first thing recruiters notice in your profile. Write a
                concise headline introducing yourself to employers. (Minimum 5
                words)
              </p>

              {/* Textarea Input */}
              <div className="mb-3">
                <textarea
                  className="form-control custom-textarea"
                  placeholder="Minimum 5 words. Sample headlines: Sales Manager well versed in Excel and Dynamics CRM. Senior-level Interior Designer with expertise in 3D modeling."
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={250}
                  style={{ height: "100px" }}
                />
                <small className="text-muted d-block text-end">
                  {250 - headline.length} character(s) left
                </small>
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
              <button
                type="button"
                className="btn btn-primary"
                disabled={headline.trim().split(" ").length < 5}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
