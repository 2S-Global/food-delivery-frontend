import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import LanguageProficiency from "../academicbox_component/language";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomizedProgressBars from "@/components/common/loader";

import PersonalInfoForm from "../personal_details_component/personal_detailsform";
const PersonalModal = ({ show, onClose, focusSection }) => {
  const [formData, setFormData] = useState({
    gender: "",
    dob: null,
    more_info: [],
  });

  const [selectedMaritalStatus, setSelectedMaritalStatus] =
    useState("Single/unmarried");
  const [selectedInfo, setSelectedInfo] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAbled, setSelectedAbled] = useState("No");
  const [selectedCareerBreak, setSelectedCareerBreak] = useState("No");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  if (!token) {
    console.log("No token");
  }
  const [loading, setLoading] = useState(true);

  const old_locations = [
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Japan",
    "Mexico",
    "Poland",
    "Russia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Turkey",
    "Brazil",
    "China",
    "India",
    "Indonesia",
    "Korea",
    "Philippines",
    "Singapore",
    "Thailand",
    "United Arab Emirates",
    "Vietnam",
    "Argentina",
    "Bolivia",
    "Chile",
    "Colombia",
    "Ecuador",
    "Guyana",
    "Paraguay",
    "Peru",
    "Suriname",
    "Uruguay",
    "Venezuela",
  ];
  const locations = old_locations.map((location) => ({
    label: location,
    value: location,
  }));
  const handleDateChange = (date) => {
    if (date) {
      setFormData({ ...formData, dob: date }); // Store raw Date object
    }
  };
  const handleChange = (selectedOptions) => {
    if (selectedOptions.length <= 10) {
      setSelectedLocations(selectedOptions);
    }
  };
  const handleSelect = (type, value, e) => {
    e.preventDefault();
    if (type === "gender") setSelectedGender(value);
    if (type === "marital") setSelectedMaritalStatus(value);
    if (type === "info") {
      setSelectedInfo((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const personalInfo = useRef(null);
  const category = useRef(null);
  const careerBreak = useRef(null);
  const workPermit = useRef(null);
  const languages = useRef(null);
  // Handle scrolling to section update this
  useEffect(() => {
    if (show && focusSection) {
      const sections = {
        personalInfo: personalInfo,
        category: category,
        careerBreak: careerBreak,
        workPermit: workPermit,
        languages: languages,
      };
      console.log("Scrolling to focus section:", focusSection);
      sections[focusSection]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [show, focusSection]);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  if (!show) return null;

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
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content p-3">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Personal Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <p className="text-muted">
                This information helps employers know you better.
              </p>
              {loading ? (
                <>{/*   <CustomizedProgressBars /> */}</>
              ) : (
                <PersonalInfoForm
                  formData={formData}
                  setFormData={setFormData}
                  focusSection={focusSection}
                  show={show}
                  setLoading={setLoading}
                />
              )}
              <form>
                <div ref={personalInfo}>
                  {/* Gender Selection */}
                  {/* Gender Selection */}
                  {/*  <div className="mb-3">
                    <label className="form-label">
                      <b>Gender</b>
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex gap-2 flex-wrap">
                      {Genders.map((gender) => (
                        <button
                          key={gender.id}
                          onClick={(e) => handleSelect("gender", gender.id, e)}
                          className={`btn option-btn rounded-pill ${
                            formData.gender == gender.id ? "active" : ""
                          }`}
                        >
                          {gender.name}
                        </button>
                      ))}
                    </div>
                  </div> */}

                  {/* More Information Section */}
                  <div className="mb-3">
                    <label className="form-label">
                      <b>More information</b>
                    </label>
                    <p className="text-muted" style={{ fontSize: "14px" }}>
                      Companies are focusing on equal opportunities and might be
                      looking for candidates from diverse backgrounds.
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      {[
                        "Single parent +",
                        "Working mother +",
                        "Served in military +",
                        "Retired (60+) +",
                        "LGBTQ+ +",
                      ].map((info) => (
                        <button
                          key={info}
                          onClick={(e) => handleSelect("info", info, e)}
                          className={`btn info-btn rounded-pill ${
                            selectedInfo.includes(info) ? "active" : ""
                          }`}
                        >
                          {info}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Marital Status Section */}
                  <div className="mb-3">
                    <label className="form-label">
                      <b>Marital Status</b>
                    </label>
                    <div className="d-flex gap-2 flex-wrap">
                      {[
                        "Single/unmarried",
                        "Married",
                        "Widowed",
                        "Divorced",
                        "Separated",
                        "Other",
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={(e) => handleSelect("marital", status, e)}
                          className={`btn option-btn rounded-pill ${
                            selectedMaritalStatus === status ? "active" : ""
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date of Birth Section */}
                  <div className="mb-3">
                    <label className="form-label d-block">
                      <b>Date of Birth</b>
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
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
                    />
                  </div>
                </div>

                {/* Category Section */}
                <div className="mb-3" ref={category}>
                  <label className="form-label">
                    <b>Category</b>
                  </label>
                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    Companies welcome people from various categories to bring
                    equality among all citizens.
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    {[
                      "General",
                      "Scheduled Caste (SC)",
                      "Scheduled Tribe (ST)",
                      "OBC - Creamy",
                      "OBC - Non creamy",
                      "Other",
                    ].map((category) => (
                      <button
                        key={category}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(category);
                        }}
                        className={`btn option-btn rounded-pill ${selectedCategory === category ? "active" : ""}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Differently Abled Section */}
                <div className="mb-3">
                  <label className="form-label">
                    <b>Are you differently abled?</b>
                  </label>
                  <div className="d-flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="form-check-label">
                        <input
                          type="radio"
                          name="differentlyAbled"
                          value={option}
                          checked={selectedAbled === option}
                          onChange={() => setSelectedAbled(option)}
                          className="form-check-input me-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Career Break Section */}
                <div className="mb-3" ref={careerBreak}>
                  <label className="form-label">
                    <b>Have you taken a career break?</b>
                  </label>
                  <div className="d-flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="form-check-label">
                        <input
                          type="radio"
                          name="careerBreak"
                          value={option}
                          checked={selectedCareerBreak === option}
                          onChange={() => setSelectedCareerBreak(option)}
                          className="form-check-input me-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Work permit for USA  */}
                <div className="mb-3" ref={workPermit}>
                  <label className="form-label">
                    <b>Work permit for USA</b>
                  </label>
                  <div className="d-flex gap-3">
                    {/* Work permit for USA dropdown with type */}
                    <select className="form-select">
                      <option value="">Select Type</option>
                      {[
                        "Have US H1 Visa",
                        "Need US H1 Visa",
                        "US TN Permit Holder",
                        "US Green Card Holder",
                        "US Citizen",
                        "Authorized to work in US",
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <b>Work permit for other countries (Max 3)</b>
                  </label>
                  <Select
                    isMulti
                    options={locations}
                    value={selectedLocations}
                    onChange={handleChange}
                    placeholder="Tell us your location preferences to work"
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>

                {/* Permanent address */}
                <div className="mb-3">
                  <label className="form-label">
                    <b>Permanent address</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Your Permanent address"
                  />
                </div>
                {/* Hometown */}
                <div className="mb-3">
                  <label className="form-label">
                    <b>Hometown</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Your Hometown"
                  />
                </div>
                {/* Pincode */}
                <div className="mb-3">
                  <label className="form-label">
                    <b>Pincode</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Your Pincode"
                  />
                </div>

                {/* language */}
                <div ref={languages}>
                  <LanguageProficiency />
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalModal;
