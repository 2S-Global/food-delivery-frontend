import React, { useState, useEffect, useRef, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import LanguageProficiency from "../academicbox_component/language";
import axios from "axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomizedProgressBars from "@/components/common/loader";
import Disability from "./disability";
import CareerBreak from "./carrer_break";
import { tr } from "date-fns/locale";
const PersonalInfoForm = ({
  formData,
  setFormData,
  focusSection,
  show,
  setWrongDate,
}) => {
  //main
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //list
  const [Genders, setGenders] = useState([]);

  const [countries, setCountries] = useState([]);
  const [more_info_list, setMore_info_list] = useState([]);
  const [marriageStatusList, setMarriageStatusList] = useState([]);
  const [withpartnername, setWithpartnername] = useState([]);
  const [categories, setCategories] = useState([]);
  const [UsaVisaList, setUsaVisaList] = useState([]);

  const [renderLanguages, setRenderLanguages] = useState(false);

  useEffect(() => {
    console.log("focusSection changed:", focusSection);
    if (!focusSection) {
      setRenderLanguages(true);
    }

    if (focusSection === "languages") {
      setRenderLanguages(true);
    } else {
      setRenderLanguages(false);
    }
  }, [focusSection]);

  //utlity
  const personalInfo = useRef(null);
  const category = useRef(null);
  const careerBreak = useRef(null);
  const workPermit = useRef(null);
  const languages = useRef(null);
  const dob = useRef(null);
  const differentlyAbled = useRef(null);
  const address = useRef(null);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  //loading state
  const [loading, setLoading] = useState(false);
  const [onpincode, setOnPincode] = useState(false);

  useEffect(() => {
    if (loading || !show || !focusSection) return;

    const sectionRefs = {
      personalInfo,
      category,
      careerBreak,
      workPermit,
      languages,
      dob,
      differentlyAbled,
      address,
    };

    const targetRef = sectionRefs[focusSection];

    if (!targetRef) {
      console.warn("No matching ref for focusSection:", focusSection);
      return;
    }

    setTimeout(() => {
      if (focusSection === "languages") {
        setRenderLanguages(true);
        return;
      }
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
    const fetchMoreInfoList = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/sql/dropdown/more_information`
        );
        const data = await response.json();
        setMore_info_list(data.data);
      } catch (error) {
        console.error("Error fetching more info list:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMarriageStatusList = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/sql/dropdown/marital_status`
        );
        const data = await response.json();
        setMarriageStatusList(data.data);
        setWithpartnername(data.hasPartner);
      } catch (error) {
        console.error("Error fetching marriage status list:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/sql/dropdown/category_details`
        );
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchUsaVisaList = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/visa_type`);
        const data = await response.json();
        setUsaVisaList(data.data);
      } catch (error) {
        console.error("Error fetching USA visa list:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_contry`);
        const data = await response.json();
        setCountries(
          data.data.map((country) => ({
            label: country.name,
            value: country.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();

    fetchUsaVisaList();
    fetchCategories();
    fetchMarriageStatusList();
    fetchGenders();
    fetchMoreInfoList();
  }, [apiurl]);

  //functions
  const handleSelect = (key, value, e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  const handleMultiSelect = (key, value, e) => {
    e.preventDefault();
    setFormData((prev) => {
      const currentValues = prev[key] || [];
      const isSelected = currentValues.includes(value);
      return {
        ...prev,
        [key]: isSelected
          ? currentValues.filter((v) => v !== value) // remove if already selected
          : [...currentValues, value], // add if not selected
      };
    });
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData({ ...formData, dob: date }); // Store raw Date object
    }
  };

  const handleChange = (selectedOptions) => {
    setFormData({
      ...formData,
      work_permit_other_countries: selectedOptions.map((opt) => opt.value),
    });
  };

  // Convert stored IDs to react-select compatible format
  const selectedCountries = countries.filter((country) =>
    formData.work_permit_other_countries.includes(country.value)
  );

  useEffect(() => {
    if (!formData.have_usa_visa) {
      setFormData({
        ...formData,
        usa_visa_type: "",
      });
    }
  }, [formData.have_usa_visa]);

  return (
    <>
      {loading ? (
        <CustomizedProgressBars />
      ) : (
        <>
          <form className="default-form">
            {!renderLanguages && (
              <>
                <div ref={personalInfo} id="personalInfo">
                  {/* Gender Selection */}
                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>Gender</b>
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="d-flex gap-2 flex-wrap">
                      {Genders.map((gender) => (
                        <button
                          type="button"
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
                  </div>
                  {/* more info selection */}
                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>More Information</b>
                    </label>
                    <div className="d-flex gap-2 flex-wrap">
                      {more_info_list.map((info) => (
                        <button
                          type="button"
                          key={info.id}
                          onClick={(e) =>
                            handleMultiSelect("more_info", info.id, e)
                          }
                          className={`btn option-btn rounded-pill ${
                            formData.more_info.includes(info.id) ? "active" : ""
                          }`}
                        >
                          {info.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Marital Status Section */}
                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>Marital Status</b>
                    </label>
                    <div className="d-flex gap-2 flex-wrap">
                      {marriageStatusList.map((status) => (
                        <button
                          type="button"
                          key={status.id}
                          onClick={(e) =>
                            handleSelect("marital_status", status.id, e)
                          }
                          className={`btn option-btn rounded-pill ${
                            formData.marital_status == status.id ? "active" : ""
                          }`}
                        >
                          {status.status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(withpartnername?.includes(formData.marital_status) ||
                    Boolean(formData.partner_name)) && (
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Partner Name</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Partner Name"
                        name="partner_name"
                        value={formData.partner_name || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            partner_name: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  {/* Date of Birth Selection */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div className="mb-3 form-group" ref={dob} id="dob">
                      <label htmlFor="dob" className="form-label">
                        <b>
                          Date of Birth <span style={{ color: "red" }}>*</span>
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
                  {/*   <div className="mb-3 col-md-4 form-group" ref={dob} id="dob">
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
                  </div> */}
                </div>
                <div className="mb-3 form-group" ref={category} id="category">
                  <label className="form-label">
                    <b>Category</b>
                  </label>
                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    Companies welcome people from various categories to bring
                    equality among all citizens.
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <button
                        type="button"
                        key={category.id}
                        onClick={(e) =>
                          handleSelect("category", category.id, e)
                        }
                        className={`btn option-btn rounded-pill ${
                          formData.category == category.id ? "active" : ""
                        }`}
                      >
                        {category.category_name}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  className="row"
                  ref={differentlyAbled}
                  id="differentlyAbled"
                >
                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>Are you differently abled?</b>
                    </label>
                    <div className="d-flex gap-3">
                      {["Yes", "No"].map((option) => (
                        <label key={option} className="form-check-label">
                          <input
                            type="radio"
                            name="differently_abled"
                            value={formData.differently_abled}
                            checked={formData.differently_abled === option}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                differently_abled: option,
                              })
                            }
                            className="form-check-input me-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.differently_abled === "Yes" ? (
                    <>
                      <Disability
                        formData={formData}
                        setFormData={setFormData}
                        apiurl={apiurl}
                      />
                    </>
                  ) : null}
                </div>

                <div
                  className="mb-3 form-group"
                  ref={careerBreak}
                  id="careerBreak"
                >
                  <label className="form-label">
                    <b>Have you taken a career break?</b>
                  </label>
                  <div className="d-flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="form-check-label">
                        <input
                          type="radio"
                          name="career_break"
                          value={option}
                          checked={formData.career_break === option}
                          onChange={() =>
                            setFormData({ ...formData, career_break: option })
                          }
                          className="form-check-input me-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  {formData.career_break === "Yes" ? (
                    <>
                      <CareerBreak
                        formData={formData}
                        setFormData={setFormData}
                        apiurl={apiurl}
                        setWrongDate={setWrongDate}
                      />
                    </>
                  ) : null}
                </div>

                <div ref={workPermit} id="workPermit">
                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>Do you have a Work permit for USA</b>
                    </label>
                    <div className="d-flex gap-3">
                      <select
                        className="form-select"
                        value={formData.have_usa_visa}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            have_usa_visa: e.target.value === "true",
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>

                  {formData.have_usa_visa && (
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Work permit for USA</b>
                      </label>
                      <div className="d-flex gap-3">
                        <select
                          className="form-select"
                          value={formData.usa_visa_type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              usa_visa_type: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Select Visa Type
                          </option>
                          {UsaVisaList.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.visa_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>Work permit for other countries (Max 3)</b>
                    </label>
                    <Select
                      isMulti
                      options={countries}
                      value={countries.filter((option) =>
                        formData.work_permit_other_countries.includes(
                          option.value
                        )
                      )}
                      onChange={handleChange}
                      placeholder="Tell us your location preferences to work"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isOptionDisabled={(option) =>
                        formData.work_permit_other_countries.length >= 3 &&
                        !formData.work_permit_other_countries.includes(
                          option.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="" ref={address} id="address">
                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>Permanent address</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Permanent address"
                      name="permanent_address"
                      value={formData.permanent_address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          permanent_address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>Hometown</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Hometown"
                      name="hometown"
                      value={formData.hometown}
                      onChange={(e) =>
                        setFormData({ ...formData, hometown: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3 form-group">
                    <label className="form-label">
                      <b>Pincode</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only digits
                        if (/^\d{0,6}$/.test(value)) {
                          setFormData({ ...formData, pincode: value });
                        }
                      }}
                      onFocus={() => setOnPincode(true)}
                      onBlur={() => setOnPincode(false)}
                    />
                    {formData.pincode.length > 0 &&
                      formData.pincode.length !== 6 &&
                      !onpincode && (
                        <small className="text-danger">
                          Pincode must be exactly 6 digits.
                        </small>
                      )}
                  </div>
                </div>
              </>
            )}
            {/* render only if languages is true */}
            {renderLanguages && (
              <div ref={languages} id="languages">
                <LanguageProficiency
                  formData={formData}
                  setFormData={setFormData}
                  apiurl={apiurl}
                />
              </div>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default PersonalInfoForm;
