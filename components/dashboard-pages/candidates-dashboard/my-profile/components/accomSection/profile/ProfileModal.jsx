import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from "lucide-react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import { Trash2 } from "lucide-react";
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

const ProfileModal = ({
  setReload,
  show,
  onClose,
  item,
  setError,
  setSuccess,
}) => {
  if (!show) return null;

  const [formData, setFormData] = useState({
    _id: item._id || "",
    socialProfile: item.socialProfile || "",
    url: item.url || "",
    description: item.description || "",
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

  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const token = localStorage.getItem("candidate_token");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [listsocialProfile, setListsocialProfile] = useState([]);

  const fetchsocialProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("candidate_token");
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/social_profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setListsocialProfile(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchsocialProfile();
  }, [apiurl]);

  const [loading, setLoading] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const validateForm = () => {
    if (
      !formData.socialProfile ||
      formData.socialProfile.toString().trim() === ""
    ) {
      return false;
    }
    if (!formData.url || formData.url.toString().trim() === "") {
      return false;
    }
    if (formData.url && !validateURL(formData.url)) {
      return false;
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

  const handleSave = async () => {
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    console.log("Saving personal details:", formData);
    setSaving(true);
    /* /api/candidate/accomplishments/add_online_profile */
    try {
      if (formData._id) {
        const response = await axios.put(
          `${apiurl}/api/candidate/accomplishments/edit_online_profile`,
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
          setError(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${apiurl}/api/candidate/accomplishments/add_online_profile`,
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
        `${apiurl}/api/candidate/accomplishments/delete_online_profile`,
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
              <h5 className="modal-title">Online profiles</h5>
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
                        Add link to online professional profiles (e.g. LinkedIn,
                        etc.)
                      </span>
                      {formData._id && (
                        <span style={{ color: "red", cursor: "pointer" }}>
                          <Trash2 size={20} onClick={handleConfirmDelete} />
                        </span>
                      )}
                    </div>

                    {/* Social profile */}
                    <div className="mb-3 form-group">
                      <label className="form-label">
                        <b>Social profile</b>
                        <span style={{ color: "red" }}>*</span>
                      </label>

                      <select
                        className="form-select form-control"
                        value={formData.socialProfile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socialProfile: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Social profile</option>
                        {listsocialProfile.map((profile, index) => (
                          <option key={index} value={profile.id}>
                            {profile.name}
                          </option>
                        ))}
                      </select>
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

export default ProfileModal;
