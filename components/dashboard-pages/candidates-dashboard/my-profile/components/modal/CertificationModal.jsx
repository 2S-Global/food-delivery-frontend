import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CertificationModal = ({ show, onClose }) => {
  if (!show) return null;
  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i,
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
  const [toYear, setToYear] = useState("");
  const [toMonth, setToMonth] = useState("");
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
              <h5 className="modal-title">Certifications</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            {/* Modal Body */}
            <div className="modal-body">
              <p style={{ color: "black" }}>
                Add details of Certifications you have achieved/completed
              </p>
              {/* Social profile */}
              <div className="mb-3">
                <label className="form-label">
                  <b>Certification name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Certification name"
                />
              </div>
              {/* Certification completion ID */}
              <div className="mb-3">
                <label className="form-label">
                  <b>Certification completion ID</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Certification completion ID"
                />
              </div>
              {/* URL */}
              <div className="mb-3">
                <label className="form-label">
                  <b>Certification URL</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Certification URL here"
                />
              </div>

              {/* Duration From */}
              <div className="mb-3 row">
                <label className="form-label">
                  <b>Certification validity From</b>
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
              {/* Duration To */}
              <div className="mb-3 row">
                <label className="form-label">
                  <b>Certification validity To</b>
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
              {/* Checkbox */}
              <div className="mb-3">
                <div className="checkbox-container">
                  <input type="checkbox" id="currentWork" />
                  <label htmlFor="currentWork">
                    This certification does not expire
                  </label>
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
    </>
  );
};

export default CertificationModal;
