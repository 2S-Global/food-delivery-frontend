"use client";

import { useState, useEffect } from "react";

import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const KycBox = ({ formData, setFormData, focusSection }) => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (focusSection) {
      const element = document.getElementById(focusSection);

      if (element) {
        // Scroll into view
        element.scrollIntoView({ behavior: "smooth" });

        if (focusSection != "all") {
          // Add highlight class
          element.classList.add("highlight");
        }
        // Remove after 3s
        const timeout = setTimeout(() => {
          element.classList.remove("highlight");
        }, 3000);

        // Cleanup if effect re-runs
        return () => clearTimeout(timeout);
      }
    }
  }, [focusSection]);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        errorId={errorId}
        message_id={message_id}
      />
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <CustomizedProgressBars />
        </div>
      )}
      <div>
        <div>
          <div id="all">
            <div className="row m-2" id="pan">
              <div className="form-group col-md-6">
                <label className="form-label">PAN Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pan_number}
                  onChange={(e) => {
                    setFormData({ ...formData, pan_number: e.target.value });
                  }}
                  pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                  title="Please enter a valid PAN number"
                  placeholder="Enter PAN Number"
                />
              </div>
              <div className="form-group col-md-6">
                <label className="form-label">Name as per PAN</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pan_name}
                  onChange={(e) => {
                    setFormData({ ...formData, pan_name: e.target.value });
                  }}
                  placeholder="Enter Name as per PAN"
                />
              </div>
            </div>
            <div className="row m-2" id="dl">
              <div className="form-group col-md-4">
                <label className="form-label">Driving License Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.dl_number}
                  onChange={(e) => {
                    setFormData({ ...formData, dl_number: e.target.value });
                  }}
                  pattern="^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$"
                  title="Please enter a valid Driving License number"
                  placeholder="Enter Driving License Number"
                />
              </div>
              <div className="form-group col-md-4">
                <label className="form-label">
                  Name as per Driving License
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.dl_name}
                  onChange={(e) => {
                    setFormData({ ...formData, dl_name: e.target.value });
                  }}
                  placeholder="Enter Name as per Driving License"
                />
              </div>
              <div className="form-group col-md-4">
                <label className="form-label">
                  Date of Birth as per Driving License
                </label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={formData.dl_dob ? new Date(formData.dl_dob) : null}
                    onChange={(newValue) => {
                      setFormData({ ...formData, dl_dob: newValue });
                    }}
                    format="dd/MM/yyyy"
                    maxDate={eighteenYearsAgo}
                    slotProps={{
                      textField: {
                        id: "dl_dob",
                        required: false,
                        placeholder: "dd/mm/yyyy",
                        className: "form-control",
                        style: {
                          backgroundColor: "#f0f5f7",
                          border: "1px solid #f0f5f7",
                          boxSizing: "border-box",
                          borderRadius: "8px",
                          transition: "all 300ms ease",
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row m-2" id="epic">
              <div className="form-group col-md-6">
                <label className="form-label">Epic (Voter) Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.epic_number}
                  onChange={(e) => {
                    setFormData({ ...formData, epic_number: e.target.value });
                  }}
                  pattern="^[A-Z]{3}[0-9]{7}$"
                  title="Please enter a valid Epic (Voter) Number"
                  placeholder="Enter Epic (Voter) Number"
                />
              </div>
              <div className="form-group col-md-6">
                <label className="form-label">Name as per Epic (Voter)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.epic_name}
                  onChange={(e) => {
                    setFormData({ ...formData, epic_name: e.target.value });
                  }}
                  placeholder="Enter Name as per Epic (Voter)"
                />
              </div>
            </div>
            <div className="row m-2" id="passport">
              <div className="form-group col-md-4">
                <label className="form-label">Passport File Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.passport_number}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      passport_number: e.target.value,
                    });
                  }}
                  title="Please enter a valid Passport File Number"
                  placeholder="Enter Passport File Number"
                />
              </div>
              <div className="form-group col-md-4">
                <label className="form-label">Name as per Passport</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.passport_name}
                  onChange={(e) => {
                    setFormData({ ...formData, passport_name: e.target.value });
                  }}
                  placeholder="Enter Name as per Passport"
                />
              </div>
              <div className="form-group col-md-4">
                <label className="form-label">
                  Date of Birth as per Passport
                </label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={
                      formData.passport_dob
                        ? new Date(formData.passport_dob)
                        : null
                    }
                    onChange={(newValue) => {
                      setFormData({ ...formData, passport_dob: newValue });
                    }}
                    format="dd/MM/yyyy"
                    maxDate={eighteenYearsAgo}
                    slotProps={{
                      textField: {
                        id: "passport_dob",
                        required: false,
                        placeholder: "dd/mm/yyyy",
                        className: "form-control",
                        style: {
                          backgroundColor: "#f0f5f7",
                          border: "1px solid #f0f5f7",
                          boxSizing: "border-box",
                          borderRadius: "8px",
                          transition: "all 300ms ease",
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row m-2" id="aadhar">
              <div className="form-group col-md-6">
                <label className="form-label">Aadhar Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.aadhar_number}
                  onChange={(e) => {
                    setFormData({ ...formData, aadhar_number: e.target.value });
                  }}
                  pattern="^\d{12}$"
                  title="Please enter a valid Aadhar Number"
                  placeholder="Enter Aadhar Number"
                />
              </div>
              <div className="form-group col-md-6">
                <label className="form-label">Name as per Aadhar</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.aadhar_name}
                  onChange={(e) => {
                    setFormData({ ...formData, aadhar_name: e.target.value });
                  }}
                  placeholder="Enter Name as per Aadhar "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KycBox;
