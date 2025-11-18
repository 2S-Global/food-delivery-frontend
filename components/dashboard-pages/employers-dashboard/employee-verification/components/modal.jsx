"use client";
import React, { useState, useEffect } from "react";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import EmployeeInfoCard from "./EmployeeInfoCard";
import PersonalInfoCard from "./PersonalDetailsCard";
import axios from "axios";
import { se } from "date-fns/locale/se";

const getComparableDateValue = (year, month) => {
  if (!year || !month) return null;
  return parseInt(year) * 100 + parseInt(month); // e.g., 202405
};

const Modal = ({ show, onClose, can_id, emp_id, is_complete = false }) => {
  if (!show) return null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [wrongDate, setWrongDate] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [list_notice_period, setList_notice_period] = useState([]);
  const [token, setToken] = useState(null);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("employer_token"));
    }
  }, []);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  const [user, setUser] = useState({
    name: "",
    father_name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    address: "",
    pan: "",
    designation: "",
    employmenttype: "",
    currentlyemployed: false,
    joiningdate: "",
    leavedate: "",
    joining_year: "",
    joining_month: "",
    leaving_year: "",
    leaving_month: "",
    Verified: false,
    designation_verified: false,
    duration_verified: false,
    employmenttype_verified: false,
    Serverd_notice_period: false,
    has_noc: false,
    has_due: false,
    remarks: "",
    _id: can_id,
    employmentId: emp_id,
  });

  useEffect(() => {
    if (!can_id || !emp_id || !token) return;
    FetchDetails(can_id, emp_id);
    console.log(can_id, emp_id, token);
  }, [can_id, emp_id, token]);

  const FetchDetails = async (can_id, emp_id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/companyprofile/get_employee_details?userId=${can_id}&employmentId=${emp_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setUser({
          ...user,
          name: data.name || "",
          father_name: data.fatherName || "",
          email: data.email || "",
          mobile: data.phone_number || "",
          dob: data.dob || "",
          gender: data.gender || "",
          address: data.permanentAddress || "",
          pan: data.pan_number || "",
          designation: data.jobTitle || "",
          employmenttype: data.employmentType || "",
          currentlyemployed: data.currentEmployment || false,
          joiningdate: data.joiningDate || "",
          leavedate: data.leavingDate || "",
          joining_year: data.joiningYear || "",
          joining_month: data.joiningMonth || "",
          leaving_year: data.leavingYear || "",
          leaving_month: data.leavingMonth || "",
          Verified: data.isVerified || false,
          designation_verified: data.designationVerified || false,
          duration_verified: data.durationVerified || false,
          employmenttype_verified: data.jobTypeVerified || false,
          Serverd_notice_period: data.servedNoticePeriod || false,
          has_noc: data.hasNOC || false,
          has_due: data.hasDues || false,
          remarks: data.remarks || "",
        });
      } else {
        console.error("Failed to fetch details:", response.data.message);
      }
    } catch (error) {
      console.error("Error while fetching account details:", error);
    } finally {
      setLoading(false);
    }
  };

  const [formdata, setFormData] = useState({
    ...user,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...user,
        remarks: prev.remarks,
        _id: can_id,
        employmentId: emp_id,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = (field) => () =>
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    console.log(formdata);
    try {
      const response = await axios.post(
        `${apiurl}/api/companyprofile/add_employee_verification_details`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess(response.data.message);
        FetchDetails(can_id, emp_id);

        setTimeout(() => onClose(), 3000);
      }
    } catch (error) {
      console.error("Error while submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (
      !formdata.joining_year ||
      formdata.joining_year.toString().trim() === ""
    ) {
      return false;
    }
    if (
      !formdata.joining_month ||
      formdata.joining_month.toString().trim() === ""
    ) {
      return false;
    }
    if (!formdata.currentlyemployed) {
      if (
        !formdata.leaving_year ||
        formdata.leaving_year.toString().trim() === ""
      ) {
        return false;
      }
      if (
        !formdata.leaving_month ||
        formdata.leaving_month.toString().trim() === ""
      ) {
        return false;
      }
    }

    return true;
  };
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formdata]);

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
  const generateMonthOptions = (selectedYear) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  useEffect(() => {
    if (formdata.currentlyemployed) {
      setError("");
      setWrongDate(false);
    } else {
      const startValue = getComparableDateValue(
        formdata.joining_year,
        formdata.joining_month
      );
      const endValue = getComparableDateValue(
        formdata.leaving_year,
        formdata.leaving_month
      );

      if (startValue && endValue) {
        if (startValue > endValue) {
          setError("End date cannot be before start date.");
          setWrongDate(true);
        } else {
          setError("");
          setWrongDate(false);
        }
      }
    }
  }, [
    formdata.joining_year,
    formdata.joining_month,
    formdata.leaving_year,
    formdata.leaving_month,
    formdata.currentlyemployed,
  ]);

  useEffect(() => {
    if (formdata.currentlyemployed) {
      setError("");
    }
  }, [formdata.currentlyemployed]);

  const fetchNoticePeriod = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/api/candidate/employment/get_notice_period`
      );
      if (response.data.success) {
        setList_notice_period(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notice period:", error);
    }
  };

  useEffect(() => {
    fetchNoticePeriod();
  }, []);
  useEffect(() => {
    if (formdata.Verified) {
      setFormData((prev) => ({
        ...prev,
        designation_verified: true,
        employmenttype_verified: true,
        duration_verified: true,
      }));
    }
  }, [formdata.Verified]);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <MessageComponent
        error={error}
        success={success}
        setError={setError}
        setSuccess={setSuccess}
      />
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        style={{ maxHeight: "90vh" }}
      >
        <div
          className="modal-content"
          style={{ borderRadius: "8px", overflow: "hidden" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Employee Verification</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div
            className="modal-body p-3"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {loading ? (
              <CustomizedProgressBars />
            ) : (
              <form onSubmit={handleSubmit} className="default-form">
                {/* Profile Summary Card */}
                <div className="">
                  <PersonalInfoCard user={user} />
                </div>
                <div className="mt-2">
                  <EmployeeInfoCard user={user} />
                </div>

                {/* Editable Form Fields */}
                {is_complete ? null : (
                  <div className="row g-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="verifiedSwitch"
                        checked={formdata.Verified}
                        onChange={handleToggle("Verified")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="verifiedSwitch"
                      >
                        All Details Verified
                      </label>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="verifiedSwitch"
                        checked={formdata.employmenttype_verified}
                        onChange={handleToggle("employmenttype_verified")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="verifiedSwitch"
                      >
                        Employment Type Verified
                      </label>
                    </div>

                    {/* Employment Type */}
                    <div className="col-md-6 form-group">
                      <label className="form-label">
                        <b>Employment Type</b>
                      </label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="employmenttype"
                            id="currentYes"
                            value="full-time"
                            checked={formdata.employmenttype === "full-time"}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                employmenttype: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="currentYes"
                          >
                            Full Time
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="employmenttype"
                            id="currentNo"
                            value="part-time"
                            checked={formdata.employmenttype === "part-time"}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                employmenttype: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="currentNo"
                          >
                            Part Time
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 form-group">
                      <label className="form-label">
                        <b> Is this person currently employed?</b>
                      </label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="currentlyemployed"
                            id="currentYes"
                            value="true"
                            checked={formdata.currentlyemployed === true}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                currentlyemployed: e.target.value === "true",
                              })
                            }
                          />

                          <label
                            className="form-check-label"
                            htmlFor="currentlyemployed"
                          >
                            Yes
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="currentlyemployed"
                            id="currentNo"
                            value="false"
                            checked={formdata.currentlyemployed === false}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                currentlyemployed: e.target.value === "true",
                              })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="currentNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 form-group">
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="designationSwitch"
                          checked={formdata.designation_verified}
                          onChange={handleToggle("designation_verified")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="designationSwitch"
                        >
                          Designation Verified
                        </label>
                      </div>

                      <label className="form-label">
                        <b>Designation</b>
                      </label>

                      <input
                        name="designation"
                        type="text"
                        className="form-control"
                        value={formdata.designation}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 mt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="durationSwitch"
                          checked={formdata.duration_verified}
                          onChange={handleToggle("duration_verified")}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="durationSwitch"
                        >
                          Duration Verified
                        </label>
                      </div>
                    </div>
                    {/* Joining Date*/}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        Joining Date
                        <span style={{ color: "red" }} className="ms-1">
                          *
                        </span>
                      </label>

                      <div className="d-flex gap-3">
                        {/* Years Dropdown (2000 - 2025) */}
                        <select
                          className="form-select form-control "
                          value={formdata.joining_year || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formdata,
                              joining_year: e.target.value,
                              joining_month: "", // reset month on year change
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

                        {/* Months Dropdown (Jan - Dec) */}
                        <select
                          className="form-select form-control"
                          value={formdata.joining_month || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formdata,
                              joining_month: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Month</option>
                          {generateMonthOptions(
                            parseInt(formdata.joining_year || currentYear)
                          )}
                        </select>
                      </div>
                    </div>
                    {/* Worked till */}
                    {!formdata.currentlyemployed && (
                      <>
                        <div className="mb-3 form-group">
                          <label className="form-label">
                            Leaving Date
                            <span style={{ color: "red" }} className="ms-1">
                              *
                            </span>
                          </label>

                          <div className="d-flex gap-3">
                            {/* Years Dropdown (2000 - 2025) */}
                            <select
                              className="form-select"
                              value={formdata.leaving_year || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formdata,
                                  leaving_year: e.target.value,
                                  leaving_month: "", // reset month on year change
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
                            {/* Months Dropdown (Jan - Dec) */}
                            <select
                              className="form-select"
                              value={formdata.leaving_month || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formdata,
                                  leaving_month: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Month</option>
                              {generateMonthOptions(
                                parseInt(formdata.leaving_year || currentYear)
                              )}
                            </select>
                          </div>
                        </div>

                        {error && (
                          <div className="text-danger mb-3">{error}</div>
                        )}
                      </>
                    )}

                    <div className="col-md-4 mt-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="noticePeriod"
                          name="Serverd_notice_period"
                          checked={formdata.Serverd_notice_period}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="noticePeriod"
                        >
                          Served Notice Period
                        </label>
                      </div>
                    </div>

                    <div className="col-md-4 mt-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="hasNoc"
                          name="has_noc"
                          checked={formdata.has_noc}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="hasNoc">
                          Has NOC
                        </label>
                      </div>
                    </div>

                    <div className="col-md-4 mt-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="hasDue"
                          name="has_due"
                          checked={formdata.has_due}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="hasDue">
                          Has Dues
                        </label>
                      </div>
                    </div>

                    {/* Remarks */}
                    <div className="col-12 mt-4">
                      <label className="form-label">
                        <b>Remarks</b>
                      </label>
                      <textarea
                        className="form-control"
                        name="remarks"
                        rows="4"
                        style={{
                          resize: "vertical",
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                        value={formdata.remarks}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                )}

                <div className="modal-footer mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  {is_complete ? null : (
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
