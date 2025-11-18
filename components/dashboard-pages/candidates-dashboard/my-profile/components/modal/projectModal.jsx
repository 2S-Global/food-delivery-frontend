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

const ProjectModal = ({
  setReload,
  show,
  onClose,
  item,
  setError,
  setSuccess,
}) => {
  const [description, setDescription] = useState("");
  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const [childerror, setChildError] = useState(null);
  const [wrongDate, setWrongDate] = useState(false);

  const [formData, setFormData] = useState({
    _id: item._id || "",
    title: item.title || "",
    taggedWith: item.taggedWith || "",
    client: item.client || "",
    status: item.status || "",
    workfromyear: item.workfromyear || "",
    workfrommonth: item.workfrommonth || "",
    worktoyear: item.worktoyear || "",
    worktomonth: item.worktomonth || "",
    description: item.description || "",
  });
  const token = localStorage.getItem("candidate_token");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [tagoptions, setTagoptions] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchtagoptions();
  }, [apiurl]);

  const fetchtagoptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/candidate/project/get_project_tag`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setTagoptions(response.data.data);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch tags.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setFormData({
        ...formData,
        description: "",
      });
      setIsGenerated(false);
    } else {
      setFormData({
        ...formData,
        description:
          "Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience. Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality. Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution.",
      });
      setIsGenerated(true);
    }
  };

  if (!show) return null;

  useEffect(() => {
    if (formData.status === "in-progress") {
      setChildError("");
      setWrongDate(false);
    } else {
      const startValue = getComparableDateValue(
        formData.workfromyear,
        formData.workfrommonth
      );
      const endValue = getComparableDateValue(
        formData.worktoyear,
        formData.worktomonth
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
    formData.workfromyear,
    formData.workfrommonth,
    formData.worktoyear,
    formData.worktomonth,
    formData.status,
  ]);
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

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    // Title is required
    if (!formData.title || formData.title.toString().trim() === "") {
      return false;
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
          `${apiurl}/api/candidate/project/edit_project_details`,
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
          `${apiurl}/api/candidate/project/add_project_details`,
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
  const handleDelete = async () => {
    setLoading(true);
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
        `${apiurl}/api/candidate/project/delete_project_details`,
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
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Project</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
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
                        Stand out for employers by adding details about projects
                        you have done in college, internships, or at work.
                      </span>
                      {formData._id && (
                        <span style={{ color: "red", cursor: "pointer" }}>
                          <Trash2 size={20} onClick={handleConfirmDelete} />
                        </span>
                      )}
                    </div>
                    {/*   <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => console.log(formData)}
                    >
                      Test
                    </button> */}

                    <div className="mb-3 form-group">
                      {/* Project title */}
                      <label htmlFor="projectTitle">Project Title </label>
                      <span className="ms-1" style={{ color: "red" }}>
                        *
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="projectTitle"
                        placeholder="Enter project title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            title: e.target.value,
                          })
                        }
                        required
                      ></input>
                    </div>
                    {/* Tag this project with your employment/education */}
                    {tagoptions.length > 0 && (
                      <>
                        <div className="mb-3 form-group">
                          <label htmlFor="projectTag">
                            Tag this project with your employment/education
                          </label>
                          <select
                            className="form-control"
                            id="projectTag"
                            value={formData.taggedWith || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                taggedWith: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Select your role/education</option>
                            {tagoptions.map((option) => (
                              <option key={option._id} value={option._id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {/* Client */}
                    <div className="mb-3 form-group">
                      <label htmlFor="projectClient">Client</label>
                      <input
                        type="text"
                        className="form-control"
                        id="projectClient"
                        placeholder="Enter client name"
                        value={formData.client}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            client: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                    {/* Project status*/}
                    <div className="mb-3 form-group">
                      <label htmlFor="projectStatus">Project Status</label>
                      {/* radio buttons */}
                      <div className="form-check">
                        <input
                          className="form-check-input "
                          type="radio"
                          name="status"
                          id="status1"
                          value="finished"
                          checked={formData.status === "finished"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value,
                            })
                          }
                        />
                        <label className="form-check-label" htmlFor="status1">
                          Finished
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status2"
                          value="in-progress"
                          checked={formData.status === "in-progress"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value,
                            })
                          }
                        />
                        <label className="form-check-label" htmlFor="status2">
                          In progress
                        </label>
                      </div>
                    </div>

                    {/* Worked from */}
                    <div className=" mb-3 form-group">
                      <label htmlFor="workedFromYear">Worked from</label>
                      <div className="row">
                        {/* Year Dropdown */}
                        <div className="col-md-6 mb-1">
                          <select
                            className="form-select form-control "
                            value={formData.workfromyear || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                workfromyear: e.target.value,
                                workfrommonth: "", // reset month on year change
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
                        <div className="col-md-6 mb-1">
                          <select
                            className="form-select form-control"
                            value={formData.workfrommonth || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                workfrommonth: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Month</option>
                            {generateMonthOptions(
                              parseInt(formData.workfromyear)
                            )}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* work till */}
                    {formData.status !== "in-progress" && (
                      <>
                        <div className="mb-3 form-group">
                          <label htmlFor="workedFromYear">Worked till</label>
                          <div className="row">
                            {/* Year Dropdown */}
                            <div className="col-md-6 mb-1">
                              <select
                                className="form-select"
                                value={formData.worktoyear || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    worktoyear: e.target.value,
                                    worktomonth: "", // reset month on year change
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
                            <div className="col-md-6 mb-1">
                              <select
                                className="form-select"
                                value={formData.worktomonth || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    worktomonth: e.target.value,
                                  })
                                }
                              >
                                <option value="">Select month</option>
                                {generateMonthOptions(
                                  parseInt(formData.worktoyear)
                                )}
                              </select>
                            </div>
                          </div>
                        </div>

                        {childerror && (
                          <div className="text-danger mb-3">{childerror}</div>
                        )}
                      </>
                    )}

                    {/* Description */}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Description</b>
                      </label>
                      <textarea
                        className="form-control mb-1"
                        placeholder="Type here ..."
                        rows="2" // default height = 1 row
                        name="description"
                        style={{
                          padding: "10px",
                          minheight: "2.5em",
                          height: "auto",
                          resize: "vertical", // allow only vertical resizing
                          minHeight: "2.5em", // ensures 1 row minimum height (adjust as needed)
                        }}
                        value={formData.description}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          });
                          setIsGenerated(false); // Reset when user types
                        }}
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
                  </div>
                </form>
              </>
            )}
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

export default ProjectModal;
