import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const Profilesum = ({
  show,
  onClose,
  mainprofilesummary,
  mainsetProfilesummary,
  setError,
  setSuccess,
}) => {
  const [profilesummary, setProfilesummary] = useState(
    mainprofilesummary || ""
  );

  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const token = localStorage.getItem("candidate_token");
  if (!token) {
    console.log("No token");
  }
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setProfilesummary(""); // Clear text if pressed again
      setIsGenerated(false);
    } else {
      setProfilesummary(
        "Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience. Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality. Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution."
      );
      setIsGenerated(true);
    }
  };

  if (!show) return null;

  const handelSubmit = async () => {
    console.log("submit");
    console.log(profilesummary);
    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiurl}/api/useraction/profilesummary`,
        { profileSummary: profilesummary },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        mainsetProfilesummary(profilesummary);
      }
      setSuccess("Profile Summary updated successfully");
    } catch (error) {
      console.error("Error uploading data:", error);
      setError("Error uploading data");
    }
    onClose();
  };
  const handleDelete = async () => {
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    try {
      const response = await axios.delete(
        `${apiurl}/api/useraction/delete_profile_summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete education record");
      }
      mainsetProfilesummary("");
      onClose();
      setError("Profile Summary deleted successfully");
    } catch (error) {
      console.error("Error deleting education record:", error);
    }
  };
  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
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
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Profile summary</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "black",
                }}
              >
                Give recruiters a brief overview of the highlights of your
                career, key achievements, and career goals to help recruiters
                know your profile better.
                {mainprofilesummary && (
                  <span
                    style={{ color: "red", cursor: "pointer" }}
                    className="ms-2"
                  >
                    <Trash2 size={20} onClick={handleConfirmDelete} />
                  </span>
                )}
              </p>

              {/* Textarea Input */}
              <div className="mb-3">
                <textarea
                  className="form-control custom-textarea"
                  placeholder="Type here..."
                  value={profilesummary}
                  onChange={(e) => {
                    setProfilesummary(e.target.value);
                    setIsGenerated(false); // Reset when user types
                  }}
                  maxLength={1000}
                  style={{ height: "100px" }}
                />
                <div className="row">
                  <div className="col-sm-6">
                    <button
                      type="button"
                      className="suggestion-btn"
                      onClick={handleGenerateHeadline}
                    >
                      <Sparkles />
                      {isGenerated ? "Clear" : "Help me write"}
                    </button>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted d-block text-end">
                      {1000 - profilesummary.length} character(s) left
                    </small>
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={handelSubmit}
                disabled={profilesummary.trim().length < 1}
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

export default Profilesum;
