import React, { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import KycBox from "./Kycboxnew";
import { set } from "date-fns/set";
import { da } from "@faker-js/faker";

const KycModal = ({
  show,
  onClose,
  setError,
  setSuccess,
  setMessageId,
  setErrorId,
  setReload,
  focusSection,
  data,
}) => {
  if (!show) return null;
  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  /* 
  console.log("data", data); */

  const [formData, setFormData] = useState({
    pan_number: data?.pan_number || "",
    pan_name: data?.pan_name || "",
    epic_number: data?.epic_number || "",
    epic_name: data?.epic_name || "",
    passport_name: data?.passport_name || "",
    passport_number: data?.passport_number || "",
    passport_dob: data?.passport_dob || "",
    dl_number: data?.dl_number || "",
    dl_name: data?.dl_name || "",
    dl_dob: data?.dl_dob || "",
    aadhar_number: data?.aadhar_number || "",
    aadhar_name: data?.aadhar_name || "",
  });

  const [formerrors, setFormErrors] = useState("");

  const validationConfig = [
    {
      fields: ["pan_number", "pan_name"],
      message: "Please fill both the PAN number and name.",
    },
    {
      fields: ["epic_number", "epic_name"],
      message: "Please fill both the EPIC number and name.",
    },
    {
      fields: ["passport_number", "passport_name", "passport_dob"],
      message: "Please fill Passport number, name, and DOB.",
    },
    {
      fields: ["dl_number", "dl_name", "dl_dob"],
      message: "Please fill Driving License number, name, and DOB.",
    },
    {
      fields: ["aadhar_number", "aadhar_name"],
      message: "Please fill a valid Aadhar number and name.",
    },
  ];

  const ValidateForm = () => {
    setFormErrors("");
    setIsFormValid(false); // default: invalid

    let hasAnyGroupFilled = false;

    for (const { fields, message } of validationConfig) {
      // Check if at least one field in this group is filled
      const isAnyFilled = fields.some(
        (field) => formData[field]?.toString().trim() !== ""
      );

      if (isAnyFilled) {
        hasAnyGroupFilled = true; // ✅ at least one group has data

        // If some are filled, ensure all are filled
        const isAllFilled = fields.every(
          (field) => formData[field]?.toString().trim() !== ""
        );

        if (!isAllFilled) {
          setFormErrors(message);
          setIsFormValid(false);
          return;
        }
      }
    }

    if (!hasAnyGroupFilled) {
      setFormErrors("Please fill at least one document.");
      setIsFormValid(false);
      return;
    }

    // ✅ Passed all checks
    setIsFormValid(true);
  };

  useEffect(() => {
    ValidateForm();
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    setMessageId(null);
    setErrorId(null);

    try {
      const response = await axios.post(
        `${apiurl}/api/candidatekyc/kyc`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "KYC updated successfully.");
        setMessageId(Date.now());
        setReload(true);
        onClose();
      }

      if (!response.data.success) {
        setError(response.data.message || "Failed to update KYC.");
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error(error);
      setError("Failed to update KYC. Try again later.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block modal-xl "
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
            <form className="default-form" onSubmit={handleSubmit}>
              {/* Modal Body */}
              <div className="modal-body">
                <KycBox
                  formData={formData}
                  setFormData={setFormData}
                  focusSection={focusSection}
                />
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
                <style jsx>{`
                  .tooltip-wrapper {
                    position: relative;
                    display: inline-block;
                  }

                  .tooltip-wrapper .custom-tooltip {
                    visibility: hidden;
                    background-color: white;
                    color: red;
                    font-weight: bold;
                    text-align: center;
                    border: 1px solid red;
                    border-radius: 4px;
                    padding: 5px 10px;
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    margin-bottom: 6px;
                    z-index: 1;
                    white-space: nowrap;
                  }

                  .tooltip-wrapper:hover .custom-tooltip {
                    visibility: visible;
                  }
                `}</style>

                <div className="tooltip-wrapper">
                  {!isFormValid && (
                    <div className="custom-tooltip">{formerrors}</div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    // onClick={handleSave}
                    disabled={!isFormValid || saving}
                  >
                    <>{saving ? "Saving..." : "Save"}</>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default KycModal;
