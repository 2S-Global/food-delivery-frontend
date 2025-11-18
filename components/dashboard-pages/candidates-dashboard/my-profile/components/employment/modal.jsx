/*  */
import dynamic from "next/dynamic";
import { EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import React, { useState, useEffect, useCallback, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import debounce from "lodash.debounce";
import CustomizedProgressBars from "@/components/common/loader";
import CompanyNameSelect from "./SelectCompany.jsx"; // Import the new component
const getComparableDateValue = (year, month) => {
  if (!year || !month) return null;
  return parseInt(year) * 100 + parseInt(month); // e.g., 202405
};
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
let debounceTimeout;
const EmploymentModal = ({
  show,
  onClose,
  item = [],
  setReload,
  setSuccess,
  setmainError,
}) => {
  const [error, setError] = useState("");
  const cache = {}; // local cache to avoid duplicate calls
  const [wrongDate, setWrongDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const token = localStorage.getItem("candidate_token");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [list_notice_period, setList_notice_period] = useState([]);
  const [testdata, setTestdata] = useState([]);

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
    fetchDefultOptions();
  }, []);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
  const [formData, setFormData] = useState({
    _id: item._id || "",
    currentlyWorking: item.currentlyWorking || false,
    employmenttype: item.employmenttype || "full-time",
    experience_yr: item.experience_yr || "",
    experience_month: item.experience_month || "",
    company_name: item.company_name || "",
    job_title: item.job_title || "",
    joining_year: item.joining_year || "",
    joining_month: item.joining_month || "",
    leaving_year: item.leaving_year || "",
    leaving_month: item.leaving_month || "",
    description: item.description || "",
    notice_period: item.notice_period || "",
  });
  const [editorState, setEditorState] = useState(() => {
    if (item.description) {
      const blocksFromHtml = htmlToDraft(item.description);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  const [defaultOptions, setDefaultOptions] = useState([
    {
      value: formData.company_name,
      label: formData.company_name,
    },
  ]);

  const fetchDefultOptions = async () => {
    setLoading2(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/candidate/employment/random_company?company_name=${formData.company_name}`
      );
      if (response.data.success) {
        const options = response.data.data.map((name) => ({
          value: name,
          label: name,
        }));
        setDefaultOptions(options);
      }
    } catch (error) {
      console.error("Error fetching default options:", error);
    } finally {
      setLoading2(false);
    }
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    if (
      !formData.company_name ||
      formData.company_name.toString().trim() === ""
    ) {
      return false;
    }
    if (!formData.job_title || formData.job_title.toString().trim() === "") {
      return false;
    }
    if (
      !formData.joining_year ||
      formData.joining_year.toString().trim() === ""
    ) {
      return false;
    }
    if (
      !formData.joining_month ||
      formData.joining_month.toString().trim() === ""
    ) {
      return false;
    }
    if (!formData.currentlyWorking) {
      if (
        !formData.leaving_year ||
        formData.leaving_year.toString().trim() === ""
      ) {
        return false;
      }
      if (
        !formData.leaving_month ||
        formData.leaving_month.toString().trim() === ""
      ) {
        return false;
      }
    }

    return true;
  };
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      // clear description
      setFormData({
        ...formData,
        description: "",
      });
      setEditorState(EditorState.createEmpty());
      setIsGenerated(false);
    } else {
      const generatedText =
        "Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience. Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality. Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution.";

      // update formData and editorState in sync
      setFormData({
        ...formData,
        description: generatedText,
      });
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromText(generatedText)
        )
      );
      setIsGenerated(true);
    }
  };

  if (!show) return null;

  const handleSave = async () => {
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    console.log("Saving personal details:", formData);
    setSaving(true);
    /* api/candidate/accomplishments/add_work_samples*/
    try {
      if (formData._id) {
        const response = await axios.put(
          `${apiurl}/api/candidate/employment/edit_employment `,
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
            "Error saving personal details:",
            response.data.message
          );
          setSaving(false);
          setmainError(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${apiurl}/api/candidate/employment/add_employment`,
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
            "Error saving personal details:",
            response.data.message
          );
          setSaving(false);
          setmainError(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!formData._id) {
      console.error("No id selected for deletion.");
      return;
    }
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    try {
      setSaving(true);

      const response = await axios.delete(
        `${apiurl}/api/candidate/employment/delete_employment`,
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
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting education record:", error);
      setError("An error occurred while deleting the record.Please try again.");
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
  const generateMonthOptions = (selectedYear) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  useEffect(() => {
    if (formData.currentlyWorking) {
      setError("");
      setWrongDate(false);
    } else {
      const startValue = getComparableDateValue(
        formData.joining_year,
        formData.joining_month
      );
      const endValue = getComparableDateValue(
        formData.leaving_year,
        formData.leaving_month
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
    formData.joining_year,
    formData.joining_month,
    formData.leaving_year,
    formData.leaving_month,
    formData.currentlyWorking,
  ]);

  useEffect(() => {
    if (formData.currentlyWorking) {
      setError("");
    }
  }, [formData.currentlyWorking]);

  /* test  */
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchMatchingCompanies(searchText);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchText]);

  const fetchMatchingCompanies = async (name) => {
    try {
      const res = await axios.get(
        `${apiurl}/api/candidate/employment/matching_company`,
        {
          params: { company_name: name },
        }
      );
      setSuggestions(res.data.data || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, company_name: value });
    setSearchText(value);
  };

  const handleSuggestionClick = (name) => {
    setFormData({ ...formData, company_name: name });
    setShowDropdown(false);
    fetchcompanydetails(name);
  };

  const fetchcompanydetails = async (name) => {
    try {
      const res = await axios.get(
        `${apiurl}/api/candidate/employment/all_company_details`,
        {
          params: { company_name: name },
        }
      );
      setTestdata(res.data.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setSuggestions([]);
    }
  };

  // Debounced API call
  const fetchOptions = async (inputValue) => {
    if (!inputValue) return [];

    if (cache[inputValue]) return cache[inputValue]; // return from cache

    setLoading(true);
    try {
      const res = await axios.get(
        `${apiurl}/api/candidate/employment/matching_company`,
        {
          params: { company_name: inputValue },
        }
      );

      const options = res.data.data.map((name) => ({
        label: name,
        value: name,
      }));

      cache[inputValue] = options; // store in cache
      setLoading(false);
      return options;
    } catch (err) {
      setLoading(false);
      console.error(err);
      return [];
    }
  };

  // Wrap fetchOptions in debounce so it only runs after typing stops
  const loadOptions = useCallback(debounce(fetchOptions, 300), []);
  useEffect(() => {
    debounce(fetchOptions, 300);
  }, [apiurl]);

  const handleChange = (selectedOption) => {
    setFormData({
      ...formData,
      company_name: selectedOption ? selectedOption.label : "",
    });
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
                  {" "}
                  Details like job title, company name, etc, help employers
                  understand your work
                </span>
                {formData._id && (
                  <span style={{ color: "red", cursor: "pointer" }}>
                    <Trash2 size={20} onClick={handleConfirmDelete} />
                  </span>
                )}
              </div>
              {loading2 ? (
                <CustomizedProgressBars />
              ) : (
                <>
                  <form className="default-form" onSubmit={handleSave}>
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        Is this your current employment?
                        <span style={{ color: "red" }} className="ms-1">
                          *
                        </span>
                      </label>

                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="currentlyWorking"
                            id="currentYes"
                            value="true"
                            checked={formData.currentlyWorking === true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                currentlyWorking: e.target.value === "true",
                              })
                            }
                          />

                          <label
                            className="form-check-label"
                            htmlFor="currentlyWorking"
                          >
                            Yes
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="currentlyWorking"
                            id="currentNo"
                            value="false"
                            checked={formData.currentlyWorking === false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                currentlyWorking: e.target.value === "true",
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

                    <div className="mb-3 form-group">
                      <label className="form-label">Employment Type</label>
                      <span style={{ color: "red" }} className="ms-1">
                        *
                      </span>

                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="employmenttype"
                            id="currentYes"
                            value="full-time"
                            checked={formData.employmenttype === "full-time"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
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
                            checked={formData.employmenttype === "part-time"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
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

                    {/* Company name */}
                    {/*  <div className="mb-3 form-group">
                      <label className="form-label">
                        Company Name <span style={{ color: "red" }}>*</span>
                      </label>

                      <AsyncCreatableSelect
                        cacheOptions
                        defaultOptions={defaultOptions}
                        isLoading={loading}
                        loadOptions={loadOptions}
                        value={
                          formData.company_name
                            ? {
                                label: formData.company_name,
                                value: formData.company_name,
                              }
                            : null
                        }
                        onChange={handleChange}
                        placeholder="Enter or create a company name"
                      />
                    </div> */}

                    {/* Company name input with suggestions */}
                    <CompanyNameSelect
                      formData={formData}
                      setFormData={setFormData}
                      defaultOptions={defaultOptions}
                    />

                    {/* <div className="mb-3 form-group">
                  <label className="form-label"> Testing</label>
                  <textarea
                    style={{
                      padding: "10px",
                      minheight: "2.5em",
                      height: "auto",
                      resize: "vertical", // allow only vertical resizing
                      minHeight: "2.5em", // ensures 1 row minimum height (adjust as needed)
                      overflowY: "auto",
                    }}
                    className="form-control custom-textarea"
                    placeholder="Enter your company description"
                    value={JSON.stringify(testdata, null, 2)}
                    rows={3}
                  />
                </div> */}

                    {/* Job Title */}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        Job Title
                        <span style={{ color: "red" }} className="ms-1">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control custom-textarea"
                        placeholder="Enter your job title"
                        value={formData.job_title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            job_title: e.target.value,
                          })
                        }
                      />
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
                          value={formData.joining_year || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
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
                          value={formData.joining_month || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              joining_month: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Month</option>
                          {generateMonthOptions(
                            parseInt(formData.joining_year || currentYear)
                          )}
                        </select>
                      </div>
                    </div>
                    {/* Worked till */}
                    {!formData.currentlyWorking && (
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
                              value={formData.leaving_year || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
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
                              value={formData.leaving_month || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  leaving_month: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Month</option>
                              {generateMonthOptions(
                                parseInt(formData.leaving_year || currentYear)
                              )}
                            </select>
                          </div>
                        </div>

                        {error && (
                          <div className="text-danger mb-3">{error}</div>
                        )}
                      </>
                    )}
                    {formData.currentlyWorking && (
                      <>
                        {/* notice_period */}
                        <div className="mb-3 form-group">
                          <label className="form-label">Notice Period</label>
                          {/* select list_notice_period */}
                          <select
                            className="form-select"
                            value={formData.notice_period || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                notice_period: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Notice Period</option>
                            {list_notice_period.map((item, index) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    {/* Job profile */}
                    <div className="mb-3 form-group">
                      <label className="form-label">Job Profile</label>
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={(state) => {
                          setEditorState(state);
                          const rawContentState = convertToRaw(
                            state.getCurrentContent()
                          );
                          const html = draftToHtml(rawContentState);

                          setFormData({
                            ...formData,
                            description: html, // Save HTML instead of plain text
                          });
                          setIsGenerated(false);
                        }}
                        placeholder="Type here ..."
                        toolbar={{
                          options: ["inline"],
                          inline: {
                            options: [
                              "bold",
                              "italic",
                              "underline",
                              "strikethrough",
                              "superscript",
                              "subscript",
                            ],
                          },
                          /* list: { options: ["unordered", "ordered"] }, */
                          /*  link: { options: ["link"] }, */
                        }}
                        wrapperClassName="border rounded mb-2"
                        editorClassName="form-control px-2"
                        toolbarClassName="border-bottom"
                      />

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
                </>
              )}
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
                {!formData.currentlyWorking && wrongDate && isFormValid && (
                  <div className="custom-tooltip">
                    Please select correct date
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={
                    !isFormValid ||
                    saving ||
                    !token ||
                    (!formData.currentlyWorking && wrongDate)
                  }
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

export default EmploymentModal;
