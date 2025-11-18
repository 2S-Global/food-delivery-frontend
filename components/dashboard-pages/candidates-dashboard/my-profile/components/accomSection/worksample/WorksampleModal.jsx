import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import CustomizedProgressBars from "@/components/common/loader";

const getComparableDateValue = (year, month) => {
  if (!year || !month) return null;
  return parseInt(year) * 100 + parseInt(month); // e.g., 202405
};
//for text editor
import dynamic from "next/dynamic";
import { EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import htmlToDraft from "html-to-draftjs";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
const WorksampleModal = ({
  show,
  onClose,
  item,
  setReload,
  setSuccess,
  setmainError,
}) => {
  if (!show) return null;
  const [error, setError] = useState("");
  const [wrongDate, setWrongDate] = useState(false);

  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const token = localStorage.getItem("candidate_token");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  const [formData, setFormData] = useState({
    _id: item._id || "",
    workTitle: item.workTitle || "",
    url: item.url || "",
    description: item.description || "",
    durationFromYear: item.durationFrom?.year || "",
    durationFromMonth: item.durationFrom?.month_id || "",
    durationToYear: item.durationTo?.year || "",
    durationToMonth: item.durationTo?.month_id || "",
    currentlyWorking: item.currentlyWorking || false,
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

  // Validation logic
  useEffect(() => {
    const startValue = getComparableDateValue(
      formData.durationFromYear,
      formData.durationFromMonth
    );
    const endValue = getComparableDateValue(
      formData.durationToYear,
      formData.durationToMonth
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
  }, [
    formData.durationFromYear,
    formData.durationFromMonth,
    formData.durationToYear,
    formData.durationToMonth,
    formData.currentlyWorking,
  ]);

  useEffect(() => {
    if (formData.currentlyWorking) {
      setError("");
    }
  }, [formData.currentlyWorking]);

  const [urlError, setUrlError] = useState("");

  const validateURL = (url) => {
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

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    if (!formData.workTitle || formData.workTitle.toString().trim() === "") {
      return false;
    }
    if (!formData.url || formData.url.toString().trim() === "") {
      return false;
    }
    if (formData.url && !validateURL(formData.url)) {
      return false;
    }

    if (formData.currentlyWorking === false) {
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

  const [loading, setLoading] = useState(false);
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
          `${apiurl}/api/candidate/accomplishments/edit_work_samples`,
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
          `${apiurl}/api/candidate/accomplishments/add_work_samples`,
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
        `${apiurl}/api/candidate/accomplishments/delete_work_sample`,
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
              <h5 className="modal-title">Work Profiles</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <form className="default-form">
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
                    Link relevant work profiles (e.g. Github, Behance)
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
                    <b>Title</b>
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Work title"
                    name="workTitle"
                    value={formData.workTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, workTitle: e.target.value })
                    }
                  />
                </div>
                {/* URL */}
                <div className="mb-3 form-group">
                  <label className="form-label">
                    <b>URL</b>
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${urlError ? "is-invalid" : ""}`}
                    placeholder="Enter Your URL"
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

                {/* Duration From */}
                <div className="mb-3 row form-group">
                  <label className="form-label">
                    <b>Duration From</b>
                  </label>
                  <div className="col-md-6">
                    <select
                      className="form-select form-control "
                      value={formData.durationFromYear || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationFromYear: e.target.value,
                          durationFromMonth: "", // reset month on year change
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
                      value={formData.durationFromMonth || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationFromMonth: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Month</option>
                      {generateMonthOptions(
                        parseInt(formData.durationFromYear)
                      )}
                    </select>
                  </div>
                </div>

                {/* Duration To */}
                {!formData.currentlyWorking && (
                  <>
                    <div className="mb-3 row form-group">
                      <label className="form-label">
                        <b>Duration To</b>
                      </label>
                      <div className="col-md-6">
                        <select
                          className="form-select"
                          value={formData.durationToYear || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              durationToYear: e.target.value,
                              durationToMonth: "", // reset month on year change
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
                          className="form-select"
                          value={formData.durationToMonth || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              durationToMonth: e.target.value,
                            })
                          }
                        >
                          <option value="">Select month</option>
                          {generateMonthOptions(
                            parseInt(formData.durationToYear)
                          )}
                        </select>
                      </div>
                    </div>
                  </>
                )}
                {error && <div className="text-danger mb-3">{error}</div>}
                {/* Checkbox */}
                <div className="mb-3 form-group">
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="currentlyWorking"
                      checked={formData.currentlyWorking}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentlyWorking: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="currentlyWorking"
                      className="form-label ms-2"
                    >
                      I am currently working on this
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3 form-group">
                  <label className="form-label">
                    <b>Description</b>
                  </label>
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
              </div>
            </form>

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
                {!formData.currentlyWorking && wrongDate && (
                  <div className="custom-tooltip">
                    Please select correct date
                  </div>
                )}
                {error && <div className="custom-tooltip">{error}</div>}

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

export default WorksampleModal;
