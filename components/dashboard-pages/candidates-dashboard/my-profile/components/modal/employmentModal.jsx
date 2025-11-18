/*  */

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";

const EmploymentModal = ({ show, onClose }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerated, setIsGenerated] = useState(false); // Track button presses

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setDescription(""); // Clear text if pressed again
      setIsGenerated(false);
    } else {
      setDescription(
        "Experienced Software Developer with expertise in designing, developing, and deploying scalable web applications. Proficient in React.js, Node.js, and modern backend technologies. Skilled in API development, system architecture, and database management. Adept at problem-solving, collaborating with cross-functional teams, and optimizing application performance for a seamless user experience.",
      );

      setIsGenerated(true);
    }
  };

  const allskills = [
    "Project Management",
    "Team Leadership",
    "Technical Skills",
    "Leadership",
    "Public Speaking",
    "Networking",
    "Marketing",
    "Sales",
    "Product Management",
    "UX/UI Design",
    "Data Analysis",
    "Web Development",
    "Software Engineering",
  ];

  const suggestedSkills = [
    "Startup",
    "Web Designing",
    "Mobile Development",
    "Computer Science",
  ];

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSelectSuggested = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleSave = () => {
    if (skills.length === 0) {
      setError("Please specify at least one Key Skill.");
    } else {
      console.log("Saved Skills:", skills);
      onClose();
    }
  };

  if (!show) return null;

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
            <div className="modal-header">
              <h5 className="modal-title">Employment</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <p style={{ color: "black" }}>
                Details like job title, company name, etc, help employers
                understand your work
              </p>

              {/* Skills List */}
              <div className="mb-3">
                {skills.map((skill, index) => (
                  <span key={index} className="badge bg-secondary me-2 p-2">
                    {skill}{" "}
                    <button
                      className="btn btn-sm btn-light ms-2"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <form>
                <div className="mb-3">
                  <label className="form-label">
                    Is this your current employment?
                  </label>

                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currentEmployment"
                        id="currentYes"
                        value="yes"
                      />
                      <label className="form-check-label" htmlFor="currentYes">
                        Yes
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currentEmployment"
                        id="currentNo"
                        value="no"
                      />
                      <label className="form-check-label" htmlFor="currentNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Employment type</label>

                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currentEmployment"
                        id="currentYes"
                        value="yes"
                      />
                      <label className="form-check-label" htmlFor="currentYes">
                        Full Time
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currentEmployment"
                        id="currentNo"
                        value="no"
                      />
                      <label className="form-check-label" htmlFor="currentNo">
                        Part Time
                      </label>
                    </div>
                  </div>
                </div>

                {/* total Experience year and month drop down */}
                <div className="mb-3">
                  <label className="form-label">Total Experience</label>

                  <div className="d-flex gap-3">
                    {/* Years Dropdown */}
                    <select className="form-select" name="experienceYears">
                      <option value="">Years</option>
                      {[...Array(50).keys()].map((year) => (
                        <option key={year} value={year}>
                          {year} {year === 1 ? "Year" : "Years"}
                        </option>
                      ))}
                    </select>

                    {/* Months Dropdown */}
                    <select className="form-select" name="experienceMonths">
                      <option value="">Months</option>
                      {[...Array(12).keys()].map((month) => (
                        <option key={month} value={month}>
                          {month} {month === 1 ? "Month" : "Months"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Company name */}
                <div className="mb-3">
                  <label className="form-label">Company name</label>
                  <input
                    type="text"
                    className="form-control custom-textarea"
                    placeholder="Enter your company name"
                  />
                </div>
                {/* Job Title */}
                <div className="mb-3">
                  <label className="form-label">Job title</label>
                  <input
                    type="text"
                    className="form-control custom-textarea"
                    placeholder="Enter your job title"
                  />
                </div>

                {/* Joining Date*/}
                <div className="mb-3">
                  <label className="form-label">Joining Date</label>

                  <div className="d-flex gap-3">
                    {/* Years Dropdown (2000 - 2025) */}
                    <select className="form-select" name="joiningYears">
                      <option value="">Year</option>
                      {[...Array(26).keys()].map((i) => {
                        const year = 2000 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>

                    {/* Months Dropdown (Jan - Dec) */}
                    <select className="form-select" name="joiningMonths">
                      <option value="">Month</option>
                      {[
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
                      ].map((month, index) => (
                        <option key={index + 1} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Worked till */}
                <div className="mb-3">
                  <label className="form-label">Leaving Date</label>

                  <div className="d-flex gap-3">
                    {/* Years Dropdown (2000 - 2025) */}
                    <select className="form-select" name="joiningYears">
                      <option value="">Year</option>
                      {[...Array(26).keys()].map((i) => {
                        const year = 2000 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>

                    {/* Months Dropdown (Jan - Dec) */}
                    <select className="form-select" name="joiningMonths">
                      <option value="">Month</option>
                      {[
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
                      ].map((month, index) => (
                        <option key={index + 1} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Job profile */}
                <div className="mb-3">
                  <label className="form-label">Job profile</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setIsGenerated(false); // Reset when user types
                    }}
                    rows="3"
                    placeholder="Enter your job profile"
                  />

                  {/* "Help me write" AI Suggestion Button */}
                  <button
                    type="button"
                    className="suggestion-btn"
                    onClick={handleGenerateHeadline}
                  >
                    <Sparkles />
                    {isGenerated ? "Clear" : "Help me write"}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={skills.length === 0}
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

export default EmploymentModal;
