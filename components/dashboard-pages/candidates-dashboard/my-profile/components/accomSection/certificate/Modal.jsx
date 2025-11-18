import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import { Trash2 } from "lucide-react";

const getComparableDateValue = (year, month) => {
  if (!year || !month) return null;
  return parseInt(year) * 100 + parseInt(month); // e.g., 202405
};
const CertificateModal = ({
  setReload,
  show,
  onClose,
  item,
  setError,
  setSuccess,
}) => {
  if (!show) return null;

  const [childerror, setChildError] = useState(null);
  const [wrongDate, setWrongDate] = useState(false);

  /* _id,
      title,
      certificationId,
      url,
      validityFromyear,
      validityFrommonth,
      validityToyear,
      validityToMonth,
      doesNotExpire, */

  const [formData, setFormData] = useState({
    _id: item._id || "",
    title: item.title || "",
    certificationId: item.certificationId || "",
    url: item.url || "",
    validityFromyear: item.validityFromyear || "",
    validityFrommonth: item.validityFrommonth || "",
    validityToyear: item.validityToyear || "",
    validityToMonth: item.validityToMonth || "",
    doesNotExpire: item.doesNotExpire || false,
  });

  const token = localStorage.getItem("candidate_token");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (formData.doesNotExpire) {
      setChildError("");
      setWrongDate(false);
    } else {
      const startValue = getComparableDateValue(
        formData.validityFromyear,
        formData.validityFrommonth
      );
      const endValue = getComparableDateValue(
        formData.validityToyear,
        formData.validityToMonth
      );

      if (startValue && endValue) {
        if (startValue > endValue) {
          setChildError("End date cannot be before start date.");
          setWrongDate(true);
        } else {
          setChildError("");
          setWrongDate(false);
        }
      }
    }
  }, [
    formData.validityFromyear,
    formData.validityFrommonth,
    formData.validityToyear,
    formData.validityToMonth,
    formData.doesNotExpire,
  ]);

  const validateForm = () => {
    // Title is required
    if (!formData.title || formData.title.toString().trim() === "") {
      return false;
    }

    // URL is optional, but if provided, it must be valid
    if (formData.url && formData.url.toString().trim() !== "") {
      if (!validateURL(formData.url)) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handleSave = async () => {
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    console.log("Saving personal details:", formData);
    setSaving(true);
    try {
      if (formData._id) {
        const response = await axios.put(
          `${apiurl}/api/candidate/accomplishments/update_certificate`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setSaving(false);
          onClose();
          setReload(true);
          setSuccess(response.data.message);
        } else {
          console.error(
            "Error saving Presentation details:",
            response.data.message
          );
          setSaving(false);
          setError(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${apiurl}/api/candidate/accomplishments/add_certificate`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setSaving(false);
          onClose();
          setReload(true);
          setSuccess(response.data.message);
        } else {
          console.error(
            "Error saving presentation details:",
            response.data.message
          );
          setSaving(false);
          setError(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      setSaving(false);
    }
  };

  const [urlError, setUrlError] = useState("");

  const validateURL = (url) => {
    if (!url) return true;
    try {
      const pattern = new URL(url); // Will throw if invalid
      return true;
    } catch {
      return false;
    }
  };

  const handleBlur = () => {
    if (!validateURL(formData.url)) {
      setUrlError("Please enter a valid URL (include https://)");
    } else {
      setUrlError("");
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    if (!formData._id) {
      console.error("No education record selected for deletion.");
      return;
    }
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    try {
      setSaving(true);

      /* /api/candidate/accomplishments/delete_online_profile */
      const response = await axios.delete(
        `${apiurl}/api/candidate/accomplishments/delete_certificate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            _id: formData._id,
          },
        }
      );

      if (response.data.success) {
        //setSaving(false);
        onClose();
        setReload(true);
        setLoading(false);
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting education record:", error);
      setError("An error occurred while deleting the record.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
    }
  };
  const monthNames = [
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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  const generateMonthOptions = (selectedYear) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
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
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Certifications</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setFormData(null); // or reset object
                  onClose();
                }}
              ></button>
            </div>
            {loading ? (
              <CustomizedProgressBars />
            ) : (
              <>
                <form className="default-form">
                  {/* Modal Body */}
                  <div className="modal-body">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "black",
                      }}
                      className="mb-3"
                    >
                      <span>
                        Add details of Certifications you have
                        achieved/completed.
                      </span>
                      {formData._id && (
                        <span style={{ color: "red", cursor: "pointer" }}>
                          <Trash2 size={20} onClick={handleConfirmDelete} />
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Certification name</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        placeholder="Enter Presentation title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    {/* Certification completion ID */}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Certification completion ID</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Certification completion ID"
                        name="certificationId"
                        value={formData.certificationId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            certificationId: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* URL */}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Certification URL</b>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${urlError ? "is-invalid" : ""}`}
                        placeholder="Enter Your Social profile URL"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value })
                        }
                        onBlur={handleBlur}
                        required
                      />
                      {urlError && (
                        <div className="invalid-feedback">{urlError}</div>
                      )}
                    </div>
                    {/* date  */}
                    {/* Duration From */}
                    <div className="mb-3 row form-group">
                      <label className="form-label">
                        <b>Certification validity From</b>
                      </label>
                      <div className="col-md-6">
                        <select
                          className="form-select form-control "
                          value={formData.validityFromyear || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              validityFromyear: e.target.value,
                              validityFrommonth: "", // reset month on year change
                            })
                          }
                        >
                          <option value="">Select Year</option>
                          {Array.from({ length: 30 }, (_, i) => {
                            const year = currentYear - i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <select
                          className="form-select form-control"
                          value={formData.validityFrommonth || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              validityFrommonth: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Month</option>
                          {generateMonthOptions(
                            parseInt(formData.validityFromyear)
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Duration To */}
                    {!formData.doesNotExpire && (
                      <>
                        <div className="mb-3 row form-group">
                          <label className="form-label">
                            <b>Certification validity To</b>
                          </label>
                          <div className="col-md-6">
                            <select
                              className="form-select"
                              value={formData.validityToyear || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  validityToyear: e.target.value,
                                  validityToMonth: "", // reset month on year change
                                })
                              }
                            >
                              <option value="">Select Year</option>
                              {Array.from({ length: 51 }, (_, i) => {
                                const year =
                                  Number(formData.validityFromyear || 2000) + i;
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <select
                              className="form-select"
                              value={formData.validityToMonth || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  validityToMonth: e.target.value,
                                })
                              }
                            >
                              <option value="">Select month</option>
                              {monthNames.map((month, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {month}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                    {childerror && (
                      <div className="text-danger mb-3">{childerror}</div>
                    )}
                    {/* Checkbox */}
                    <div className="mb-3 form-group">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          id="currentlyWorking"
                          checked={formData.doesNotExpire}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              doesNotExpire: e.target.checked,
                            })
                          }
                        />
                        <label
                          htmlFor="currentlyWorking"
                          className="form-label ms-2"
                        >
                          This certification does not expire
                        </label>
                      </div>
                    </div>

                    {/* date end */}
                  </div>
                </form>
              </>
            )}
            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFormData(null); // or reset object
                  onClose();
                }}
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
                  <div className="custom-tooltip">
                    Please fill all required fields
                  </div>
                )}
                {isFormValid && wrongDate && (
                  <div className="custom-tooltip">
                    Please enter a valid date
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!isFormValid || saving || wrongDate}
                >
                  {item._id ? (
                    <>{saving ? "Updating..." : "Update"}</>
                  ) : (
                    <>{saving ? "Saving..." : "Save"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateModal;
