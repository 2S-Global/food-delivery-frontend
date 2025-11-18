/*  */

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import AsyncSelect from "react-select/async";

const CareerModal = ({
  show,
  onClose,
  focusSection,
  item = [],
  setError,
  setSuccess,
  setReload,
  salaryCurrencies,
}) => {
  const industry_section = useRef(null);
  const department_section = useRef(null);
  const job_role_section = useRef(null);
  const job_type_section = useRef(null);
  const employment_type_section = useRef(null);
  const shift_section = useRef(null);
  const work_location_section = useRef(null);
  const expected_salary_section = useRef(null);
  const [loading, setLoading] = useState(true);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  if (!token) {
    console.log("No token");
  }
  const [industry, setIndustry] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [job_role, setJob_role] = useState([]);
  const [locations, setLocations] = useState([]);

  if (!show) return null;

  const [formData, setFormData] = useState({
    _id: item._id || "",
    industry: item.industry || "",
    department: item.department || "",
    job_role: item.job_role || "",
    job_type: item.job_type || "",
    employment_type: item.employment_type || "",
    work_location: item.work_location || [],
    currency_type: item.currency_type || "INR",
    expected_salary: item.expected_salary || 0,
    shift: item.shift || "",
  });

  console.log("Form Data:", formData);

  useEffect(() => {
    if (loading || !show || !focusSection) return;

    const sectionRefs = {
      industry_section,
      department_section,
      job_role_section,
      job_type_section,
      employment_type_section,
      shift_section,
      work_location_section,
      expected_salary_section,
    };

    const targetRef = sectionRefs[focusSection];

    if (!targetRef) {
      console.warn("No matching ref for focusSection:", focusSection);
      return;
    }

    setTimeout(() => {
      if (targetRef.current) {
        try {
          targetRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Optional highlight effect
          targetRef.current.style.transition = "background-color 0.5s ease";
          const originalBg = targetRef.current.style.backgroundColor;
          targetRef.current.style.backgroundColor = "#ffffcc";

          setTimeout(() => {
            if (targetRef.current) {
              targetRef.current.style.backgroundColor =
                originalBg || "transparent";
            }
          }, 1500);
        } catch (err) {
          console.error("Scroll error:", err);
        }
      } else {
        console.warn("Ref is null at scroll time for:", focusSection);
      }
    }, 100);
  }, [show, focusSection, loading]);

  useEffect(() => {
    fetchIndustries();
    fetchLocations();
  }, [apiurl]);
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/get_india_cities `
      );
      if (response.data.success) {
        const data = response.data.data;
        setLocations(
          data.map((city) => ({
            label: city.city_name,
            value: city.id,
            popular_location: city.popular_location,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };
  const [popularLocations, setPopularLocations] = useState([]);
  useEffect(() => {
    if (!locations) return;
    const popularLocationsineffect = locations.filter(
      (loc) => loc.popular_location === 1
    );
    setPopularLocations(popularLocationsineffect);
  }, [locations]);
  const [groupedDefaultOptions, setGroupedDefaultOptions] = useState([]);
  useEffect(() => {
    const groupedDefaultOptionseffect = [
      {
        label: "Popular",
        options: popularLocations,
      },
    ];
    setGroupedDefaultOptions(groupedDefaultOptionseffect);
  }, [popularLocations]);

  const loadOptions = (inputValue, callback) => {
    const filtered = locations.filter((loc) =>
      loc.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    const popular = filtered.filter((loc) => loc.popular_location === 1);
    const others = filtered.filter((loc) => loc.popular_location !== 1);

    const groups = [];
    if (popular.length > 0) {
      groups.push({ label: "Popular", options: popular.slice(0, 50) });
    }
    if (others.length > 0) {
      groups.push({ label: "All Locations", options: others.slice(0, 50) });
    }

    callback(groups);
  };
  /* end of location   */

  useEffect(() => {
    if (!formData.industry) return;
    fetchDepartments();
  }, [apiurl, formData.industry]);

  useEffect(() => {
    if (!formData.department) return;
    fetchjob_role();
  }, [apiurl, formData.department]);

  //functions
  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/get_industry `
      );
      if (response.data.success) {
        setIndustry(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/get_job_departments?industry_id=${formData.industry} `
      );
      if (response.data.success) {
        setDepartment(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchjob_role = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/get_job_roles?department_id=${formData.department} `
      );
      if (response.data.success) {
        setJob_role(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommaSeparatedCheckbox = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] ? prev[field].split(",") : [];
      const exists = current.includes(value);

      const updated = exists
        ? current.filter((v) => v !== value)
        : [...current, value];

      return {
        ...prev,
        [field]: updated.join(","),
      };
    });
  };
  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChange = (selectedOptions) => {
    setFormData({
      ...formData,
      work_location: selectedOptions.map((opt) => opt.value),
    });
  };

  //validation part
  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const validateForm = () => {
    if (!formData.industry || formData.industry.toString().trim() === "") {
      return false;
    }
    if (!formData.department || formData.department.toString().trim() === "") {
      return false;
    }
    if (!formData.job_role || formData.job_role.toString().trim() === "") {
      return false;
    }

    return true;
  };
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handleSave = async () => {
    if (!isFormValid) {
      return;
    }
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    setSaving(true);
    try {
      /* /api/useraction/add_career_profile */
      const response = await axios.post(
        `${apiurl}/api/useraction/add_career_profile`,
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
      }
    } catch (error) {
      console.error("Error saving personal details:", error);

      setError(error.response.data.message);
    } finally {
      setSaving(false);
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
              <h5 className="modal-title">Career profile</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <p style={{ color: "black" }}>
                Add details about your current and preferred job profile. This
                helps us personalise your job recommendations.
              </p>

              {/* test button */}
              {/*      <button
                className="btn btn-primary"
                onClick={() => console.log(formData)}
              >
                Test
              </button> */}

              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  //backgroundColor: "rgba(255, 255, 255, 0.7)", // light overlay
                  zIndex: 9999, // make sure it's above everything
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  visibility: loading ? "visible" : "hidden",
                }}
              >
                <CustomizedProgressBars />
              </div>

              <form className="default-form">
                {/* Current industry */}
                <div className="my-2 form-group" ref={industry_section}>
                  <label className="form-label">Current industry</label>
                  <span style={{ color: "red" }}>*</span>
                  <select
                    className="form-select form-control"
                    value={formData.industry || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                  >
                    <option value="">Select industry</option>
                    {industry.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.job_industry}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current department */}
                <div className="my-2 form-group" ref={department_section}>
                  <label className="form-label">Current department</label>
                  <span style={{ color: "red" }}>*</span>
                  <select
                    className="form-select form-control"
                    value={formData.department || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="">Select department</option>
                    {Department.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.job_department}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current job role */}
                <div className="my-2 form-group" ref={job_role_section}>
                  <label className="form-label">Job role</label>
                  <span style={{ color: "red" }}>*</span>
                  <select
                    className="form-select form-control"
                    value={formData.job_role || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, job_role: e.target.value })
                    }
                  >
                    <option value="">Select job role</option>
                    {job_role.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.job_role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Desired job type (CHECKBOX) */}
                <div className="my-2 form-group" ref={job_type_section}>
                  <label className="form-label">Desired job type</label>

                  <div className="row">
                    <div
                      className="col-md-6 form-check"
                      style={{ paddingLeft: "35px" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="permanent-job-type"
                        checked={formData.job_type.includes("Permanent")}
                        onChange={() =>
                          handleCommaSeparatedCheckbox("job_type", "Permanent")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="permanent-job-type"
                      >
                        Permanent
                      </label>
                    </div>
                    <div
                      className="col-md-6 form-check"
                      style={{ paddingLeft: "35px" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="contractual-job-type"
                        checked={formData.job_type.includes("Contractual")}
                        onChange={() =>
                          handleCommaSeparatedCheckbox(
                            "job_type",
                            "Contractual"
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="contractual-job-type"
                      >
                        Contractual
                      </label>
                    </div>
                  </div>
                </div>

                {/* Desired Employment type (CHECKBOX) */}
                <div className="my-2 form-group" ref={job_type_section}>
                  <label className="form-label">Desired employment type</label>
                  <div className="row">
                    <div
                      className="col-md-6 form-check"
                      style={{ paddingLeft: "35px" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="full-time-employment"
                        checked={formData.employment_type.includes("Full-time")}
                        onChange={() =>
                          handleCommaSeparatedCheckbox(
                            "employment_type",
                            "Full-time"
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="full-time-employment"
                      >
                        Full-time
                      </label>
                    </div>
                    <div
                      className="col-md-6 form-check"
                      style={{ paddingLeft: "35px" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="part-time-employment"
                        checked={formData.employment_type.includes("Part-time")}
                        onChange={() =>
                          handleCommaSeparatedCheckbox(
                            "employment_type",
                            "Part-time"
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="part-time-employment"
                      >
                        Part-time
                      </label>
                    </div>
                  </div>
                </div>

                {/* shift type radio */}
                <div className="my-2 form-group" ref={shift_section}>
                  <label className="form-label">Shift type</label>
                  <div className="row">
                    {["Day", "Night", "Flexible"].map((shiftOption, index) => (
                      <div
                        className="col-md-4 form-check"
                        style={{ paddingLeft: "35px" }}
                        key={index}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="shift-type"
                          id={`shift-${shiftOption}`}
                          checked={formData.shift === shiftOption}
                          onChange={() =>
                            handleRadioChange("shift", shiftOption)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`shift-${shiftOption}`}
                        >
                          {shiftOption}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred work location (Max 10) */}
                <div className="my-2 form-group" ref={work_location_section}>
                  <label className="form-label">
                    <b>Preferred work location (Max 10)</b>
                  </label>
                  <AsyncSelect
                    isMulti
                    defaultOptions={groupedDefaultOptions}
                    loadOptions={loadOptions}
                    value={locations.filter((option) =>
                      formData.work_location.includes(option.value)
                    )}
                    placeholder="Tell us your location preferences to work"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleChange}
                    isOptionDisabled={(option) =>
                      formData.work_location.length >= 10 &&
                      !formData.work_location.includes(option.value)
                    }
                  />
                </div>
                {/* salary */}
                <div className="my-2 form-group" ref={expected_salary_section}>
                  <label className="form-label">
                    <b>Expected salary</b>
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
                      value={formData.currency_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currency_type: e.target.value,
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
                      value={Number(
                        formData.expected_salary || 0
                      ).toLocaleString("en-IN")}
                      className="form-control"
                      placeholder="Enter expected salary"
                      style={{ flex: 1 }}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, ""); // Remove commas
                        if (/^\d*$/.test(raw)) {
                          setFormData({
                            ...formData,
                            expected_salary: raw, // Store raw number
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
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
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!isFormValid || saving}
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

export default CareerModal;
