import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";
const ProfileModal = ({ show, onClose }) => {
  if (!show) return null;

  const [description, setDescription] = useState("");
  const [isGenerated, setIsGenerated] = useState(false); // Track button presses

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setDescription(""); // Clear text if pressed again
      setIsGenerated(false);
    } else {
      setDescription(
        "Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience. Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality. Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution.",
      );
      setIsGenerated(true);
    }
  };

  return (
    <>
      <style>
        {`
  .custom-textarea::placeholder {
    color: #c7c5c5!important;
    font-size: 15px !important;
  
  }
      .suggestion-btn {
            
            bottom: -0px;
            left: 10;
            display: flex;
            align-items: center;
            gap: 5px;
            background-color: #e8f0fe;
            color: #1a73e8;
            border-radius: 20px;
            padding: 6px 12px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }

          .suggestion-btn:hover {
            background-color: #d2e3fc;
          }

          .suggestion-btn svg {
            width: 16px;
            height: 16px;
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
              <h5 className="modal-title">Online profiles</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <p style={{ color: "black" }}>
                Add link to online professional profiles (e.g. LinkedIn, etc.)
              </p>

              {/* Social profile */}
              <div className="mb-3">
                <label className="form-label">
                  <b>Social profile</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Social profile name"
                />
              </div>
              {/* URL */}
              <div className="mb-3">
                <label className="form-label">
                  <b>URL</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Your Social profile URL"
                />
              </div>
              {/* Description */}
              <div className="mb-3">
                <label className="form-label">
                  <b>Description</b>
                </label>
                <textarea
                  className="form-control custom-textarea"
                  placeholder="Type here ..."
                  rows="3"
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsGenerated(false); // Reset when user types
                  }}
                ></textarea>
                <button
                  type="button"
                  className="suggestion-btn"
                  onClick={handleGenerateHeadline}
                >
                  <Sparkles />
                  {isGenerated ? "Clear" : "Help me write"}
                </button>
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
    </>
  );
};

export default ProfileModal;
