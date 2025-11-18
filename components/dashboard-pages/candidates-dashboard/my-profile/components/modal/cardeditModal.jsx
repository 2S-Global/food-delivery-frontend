import React, { useState, useEffect, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomizedProgressBars from "@/components/common/loader";
import DatePicker2 from "react-datepicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
const Cardedit = ({
  show,
  onClose,
  setReload,
  setError_main,
  setSuccess_main,
}) => {
  const [countries, setCountries] = useState([]);
  const [Genders, setGenders] = useState([]);
  const [isResidingInIndia, setIsResidingInIndia] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const salaryCurrencies = [
    { label: "₹", value: "INR" },
    { label: "$", value: "USD" },
    { label: "€", value: "EUR" },
    { label: "£", value: "GBP" },
  ];

  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    dob: null,
    country: "",
    currentLocation: "",
    hometown: "",
    father_name: "",
    salary: "",
    currency: salaryCurrencies[0].value,
    experience_months: "",
    experience_years: "",
    mother_name: "",
  });

  useEffect(() => {
    if (isResidingInIndia) {
      setFormData((prev) => ({ ...prev, country: 102 }));
    }
  }, [isResidingInIndia]);

  const [loading, setLoading] = useState(true);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  if (!token) {
    console.log("No token");
  }

  if (!show) return null;

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_contry`);
        const data = await response.json();
        setCountries(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGenders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_gender`);
        const data = await response.json();
        setGenders(data.data);
      } catch (error) {
        console.error("Error fetching genders:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUerDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("candidate_token");
        const response = await axios.get(
          `${apiurl}/api/userdata/user_details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setFormData({
            full_name: response.data.name || "",
            gender: response.data.gender || "",
            dob: response.data.dob ? new Date(response.data.dob) : null,
            country: response.data.country_id || "",
            currentLocation: response.data.currentLocation || "",
            hometown: response.data.hometown || "",
            father_name: response.data.father_name || "",
            mother_name: response.data.mother_name || "",
            salary: response.data.salary || "",
            currency: response.data.currency || "INR",
            experience_months: response.data.experience_months || "",
            experience_years: response.data.experience_years || "",
          });

          if (response.data.country_id == 102) {
            setIsResidingInIndia(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUerDetails();
    fetchGenders();
    fetchCountries();
  }, [apiurl]);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const handleCheckboxChange = (e) => {
    setIsResidingInIndia(e.target.checked);
  };

  const handleCountryChange = (e) => {
    setFormData((prev) => ({ ...prev, country: parseInt(e.target.value) }));
  };
  const handleSelect = (type, value, e) => {
    e.preventDefault();
    if (type === "gender")
      setFormData((prevData) => ({
        ...prevData,
        gender: value,
      }));

    if (type === "marital") setSelectedMaritalStatus(value);
    if (type === "info") {
      setSelectedInfo((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };
  const handleDateChange = (date) => {
    if (date) {
      setFormData({ ...formData, dob: date }); // Store raw Date object
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "full_name") {
      const onlyLetters = /^[A-Za-z\s]*$/; // Allow letters and spaces only

      if (!onlyLetters.test(value)) {
        return; // Don't update state if invalid character
      }
    }

    if (name === "phone") {
      const onlyNumbers = /^[0-9]*$/; // Only numbers allowed

      // If value contains any non-numeric characters, prevent update
      if (!onlyNumbers.test(value)) {
        return; // Don't update state if invalid character
      }

      // Check for exact 10 characters
      if (value.length > 10) {
        return; // Prevent more than 10 characters
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setError(null);
    setSuccess(null);
    if (!formData.full_name.trim() || !formData.gender || !formData.dob) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiurl}/api/useraction/update-user-details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload successful:", response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }
      setSuccess("Details updated successfully!");
      setSuccess_main("Details updated successfully!");
      setReload(true);
      setTimeout(() => onClose(), 1500); // Close modal after success
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to update Details. Please try again.");
      setError_main("Failed to update Details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.experience_years === "30+") {
      setFormData((prev) => ({ ...prev, experience_months: "" }));
    }
  }, [formData.experience_years]);

  return (
    <>
      <style>
        {`
          .custom-textarea::placeholder {
            color: #c7c5c5!important;
            font-size: 15px !important;
          }
          .option-btn {
            border: 1px solid #8c8c8c;
            color: #333;
            background: white;
            font-size: 15px;
            padding: 6px 15px;
            transition: all 0.2s ease-in-out;
          }
          .option-btn.active {
            background: #f0efff;
            font-weight: bold;
            border-color: #635bff;
            color: black;
          }
          .info-btn {
            border: 1px solid #a5a5a5;
            background: white;
            color: #333;
            font-size: 14px;
            padding: 6px 12px;
            transition: all 0.2s ease-in-out;
          }
          .info-btn.active {
            background: #eaeafc;
            font-weight: bold;
            border-color: #635bff;
            color: black;
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
              <h5 className="modal-title">All About You</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form onSubmit={handleSubmit} className="default-form">
              {/* Modal Body */}
              <div className="modal-body">
                {loading ? (
                  <CustomizedProgressBars />
                ) : (
                  <>
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Fullname */}
                    <div className="mb-3 form-group">
                      <label htmlFor="full_name" className="form-label">
                        <b>Full Name</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        name="full_name"
                        type="text"
                        className="form-control"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        id="full_name"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="mb-3 form-group">
                      <label htmlFor="father_name" className="form-label">
                        <b>Father's Full Name</b>
                      </label>
                      <input
                        name="father_name"
                        type="text"
                        className="form-control"
                        value={formData.father_name}
                        onChange={handleChange}
                        id="father_name"
                        placeholder="Enter your father's full name"
                      />
                    </div>

                    <div className="mb-3 form-group">
                      <label htmlFor="mother_name" className="form-label">
                        <b>Mother's Full Name</b>
                      </label>
                      <input
                        name="mother_name"
                        type="text"
                        className="form-control"
                        value={formData.mother_name}
                        onChange={handleChange}
                        id="mother_name"
                        placeholder="Enter your mother's full name"
                      />
                    </div>
                    {/* Gender Selection */}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Gender</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="d-flex gap-2 flex-wrap">
                        {Genders.map((gender) => (
                          <button
                            key={gender.id}
                            onClick={(e) =>
                              handleSelect("gender", gender.id, e)
                            }
                            className={`btn option-btn rounded-pill ${
                              formData.gender == gender.id ? "active" : ""
                            }`}
                          >
                            {gender.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* experience yr and month dropdown */}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Total Experience</b>
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {/* Years Select */}
                        <select
                          className="form-select"
                          style={{ padding: "5px" }}
                          value={formData.experience_years || ""}
                          onChange={(e) => {
                            const yearValue = e.target.value;
                            setFormData({
                              ...formData,
                              experience_years: yearValue,
                              // Reset months if user chooses "30+"
                              experience_months:
                                yearValue === "30+"
                                  ? ""
                                  : formData.experience_months,
                            });
                          }}
                        >
                          <option value="" disabled hidden>
                            Years
                          </option>
                          {[...Array(31).keys()].map((year) => (
                            <option key={year} value={year}>
                              {year} Year{year !== 1 ? "s" : ""}
                            </option>
                          ))}
                          <option value="30+">30+ Years</option>
                        </select>

                        {/* Months Select */}
                        {formData.experience_years !== "30+" && (
                          <select
                            className="form-select"
                            style={{ padding: "5px" }}
                            value={formData.experience_months || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                experience_months: e.target.value,
                              })
                            }
                          >
                            <option value="" disabled hidden>
                              Months
                            </option>
                            {[...Array(12).keys()].map((month) => (
                              <option key={month} value={month}>
                                {month} Month{month !== 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* render only if experience is present */}

                    <div className="my-3 form-group">
                      <label className="form-label">
                        <b>Current salary</b>
                      </label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {/* Currency Selector */}
                        <select
                          className="form-select"
                          style={{ width: "60px", padding: "5px" }}
                          value={formData.currency}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currency: e.target.value,
                            })
                          }
                        >
                          {salaryCurrencies.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        {/* Salary Input */}
                        <input
                          type="text"
                          inputMode="numeric"
                          value={Number(formData.salary || 0).toLocaleString(
                            "en-IN"
                          )}
                          className="form-control"
                          placeholder="Enter current salary"
                          style={{ flex: 1 }}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/,/g, ""); // Remove commas
                            if (/^\d*$/.test(raw)) {
                              setFormData({
                                ...formData,
                                salary: raw, // Store raw number
                              });
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Date of Birth Section */}
                    {/*  <div className="mb-3 form-group mt-1"> */}
                    {/*  <label className="form-label d-block">
                        <b>Date of Birth</b>
                        <span style={{ color: "red" }}>*</span>
                      </label> */}
                    {/* <DatePicker2
                        selected={formData.dob ? new Date(formData.dob) : null}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        maxDate={eighteenYearsAgo}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        required
                        placeholderText="dd/mm/yyyy"
                        width="100%"
                        withPortal
                      /> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <div className="mb-3 form-group">
                        <label htmlFor="dob" className="form-label">
                          <b>
                            Date of Birth{" "}
                            <span style={{ color: "red" }}>*</span>
                          </b>
                        </label>
                        <DatePicker
                          value={formData.dob ? new Date(formData.dob) : null}
                          onChange={handleDateChange}
                          maxDate={eighteenYearsAgo}
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              id: "dob",
                              required: true,
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
                      </div>
                    </LocalizationProvider>
                    {/*  </div> */}

                    {/* ckeckbox */}
                    <div className="mb-3 form-group">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          checked={isResidingInIndia}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Currently residing in India
                        </label>
                      </div>
                    </div>

                    {!isResidingInIndia && (
                      <div className="mb-3 form-group">
                        <label htmlFor="country" className="form-label">
                          Country
                        </label>
                        <select
                          className="form-select"
                          id="country"
                          value={formData.country}
                          onChange={handleCountryChange}
                        >
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {/* current location */}
                    <div className="mb-3 form-group">
                      <label htmlFor="currentLocation" className="form-label">
                        Current Location
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="currentLocation"
                        placeholder="Enter your current location"
                        value={formData.currentLocation}
                        onChange={handleChange}
                        name="currentLocation"
                      />
                    </div>
                    {/* Home-Town */}
                    <div className="mb-3 form-group">
                      <label htmlFor="hometown" className="form-label">
                        Hometown
                      </label>
                      <input
                        name="hometown"
                        type="text"
                        className="form-control"
                        id="hometown"
                        placeholder="Enter your home-town"
                        value={formData.hometown}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Mobile no */}
                    {/* <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">
                      Mobile No.
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mobile"
                      placeholder="Enter your mobile number"
                      value={formData.mobile}
                      onChange={handleChange}
                      name="mobile"
                    />
                  </div> */}
                  </>
                )}
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
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cardedit;
