import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";
/* this is demo */
const PatentModal = ({ show, onClose }) => {
  if (!show) return null;
  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  ); // Last 50 years
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [fromYear, setFromYear] = useState("");
  const [fromMonth, setFromMonth] = useState("");

  const [description, setDescription] = useState("");
  const [isGenerated, setIsGenerated] = useState(false); // Track button presses

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setDescription(""); // Clear text if pressed again
      setIsGenerated(false);
    } else {
      setDescription(
        "Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience. Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality. Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution."
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
              <h5 className="modal-title">Patent</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <p style={{ color: "black" }}>
                Add details of patents you have filed{" "}
              </p>

              {/* Social profile */}
              <div className="mb-3">
                <label className="form-label">
                  <b>Patent title</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Patent title"
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
              {/* Patent office */}
              <div className="mb-3">
                <label className="form-label">
                  <b>Patent office</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Patent office"
                />
              </div>
              {/* Status*/}
              <div className="mb-3">
                <label className="form-label">
                  <b>
                    Status
                    <br />
                  </b>
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="status"
                    id="inlineRadio1"
                    value="Active"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    Patent issued
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="status"
                    id="inlineRadio2"
                    value="Inactive"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    Patent pending
                  </label>
                </div>
              </div>

              {/*Application number*/}
              <div className="mb-3">
                <label className="form-label">
                  <b>Application number</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Application number"
                />
              </div>

              <div className="mb-3 row">
                <label className="form-label">
                  <b>Issue date</b>
                </label>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={fromYear}
                    onChange={(e) => setFromYear(e.target.value)}
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={fromMonth}
                    onChange={(e) => setFromMonth(e.target.value)}
                  >
                    <option value="">Select month</option>
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">
                  <b>Description</b>
                </label>
                <textarea
                  className="form-control custom-textarea"
                  placeholder="Type here ..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsGenerated(false); // Reset when user types
                  }}
                  rows="3"
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

export default PatentModal;
