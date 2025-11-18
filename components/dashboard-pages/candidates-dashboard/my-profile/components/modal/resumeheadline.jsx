import React, { useState } from "react";
import { Sparkles } from "lucide-react"; // AI suggestion icon
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
const ResumeHeadline = ({
  show,
  onClose,
  mainresumeHeadline,
  mainsetResumeHeadline,
  setError,
  setSuccess,
}) => {
  const [resumeHeadline, setResumeHeadline] = useState(
    mainresumeHeadline || ""
  );
  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const token = localStorage.getItem("candidate_token");
  if (!token) {
    console.log("No token");
  }
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  if (!show) return null;

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setResumeHeadline(""); // Clear text if pressed again
      setIsGenerated(false);
    } else {
      setResumeHeadline(
        "Experienced Software Developer skilled in React, Node.js, and system design."
      );
      setIsGenerated(true);
    }
  };

  const handelSubmit = async () => {
    console.log("submit");
    console.log(resumeHeadline);
    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiurl}/api/useraction/resumeheadline`,
        { resumeHeadline: resumeHeadline },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        mainsetResumeHeadline(resumeHeadline);
        setSuccess("Resume Headline updated successfully");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
    onClose();
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
            position: absolute;
            bottom: -15px;
            left: 0;
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

              {/* Textarea Input with AI Button */}
              <div className="mb-3 position-relative">
                <textarea
                  className="form-control custom-textarea"
                  placeholder="Minimum 5 words. Sample headlines: Sales Manager well versed in Excel and Dynamics CRM. Senior-level Interior Designer with expertise in 3D modeling."
                  value={resumeHeadline}
                  onChange={(e) => {
                    setResumeHeadline(e.target.value);
                    setIsGenerated(false); // Reset when user types
                  }}
                  maxLength={250}
                  style={{ height: "100px", paddingBottom: "40px" }}
                />

                {/* "Help me write" AI Suggestion Button */}
                <button
                  className="suggestion-btn"
                  onClick={handleGenerateHeadline}
                >
                  <Sparkles />
                  {isGenerated ? "Clear" : "Help me write"}
                </button>

                <small className="text-muted d-block text-end">
                  {250 - resumeHeadline.length} character(s) left
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
                onClick={handelSubmit}
                disabled={resumeHeadline.trim().split(" ").length < 5}
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

export default ResumeHeadline;
