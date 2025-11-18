/*  */

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EducationForm from "../academicbox_component/academicForm3";
import axios from "axios";
import { Trash2 } from "lucide-react";

const EducationModal = ({
  show,
  onClose,
  reload,
  setReload,
  selectedLevel,
  edit_id,
  setError,
  setSuccess,
}) => {
  const token = localStorage.getItem("candidate_token");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    _id: "",
    level: "",
    state: "",
    board: "",
    year_of_passing: "",
    medium: "",
    marks: "",
    eng_marks: "",
    math_marks: "",
    university: "",
    school_name: "",
    institute_name: "",
    course_name: "",
    course_type: "",
    start_year: "",
    end_year: "",
    grading_system: "",
    is_primary: false,
    transcript: null,
    transcriptPreview: "",
    certificate: null,
    certificatePreview: "",
    level_type: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLevel) {
      console.log("selectedLevel from useEffect", selectedLevel);
      setFormData({ ...formData, level: selectedLevel });
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (edit_id) {
      console.log("edit_id from useEffect", edit_id);
      setFormData({ ...formData, _id: edit_id });
      /* http://localhost:8080/api/userdata/get_edit_user_data?dataId=6839499e3bbfe3574bccef83 */
      const fetchuserdata = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${apiurl}/api/userdata/get_edit_user_data?dataId=${edit_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status == 200) {
            const responseData = response.data.data;

            setFormData({
              ...formData,
              _id: responseData._id || "",
              school_name: responseData.school_name || "",
              level: responseData.level || "",
              state: responseData.state || "",
              board: responseData.board || "",
              year_of_passing: responseData.year_of_passing || "",
              medium: responseData.medium_of_education || "",
              marks: responseData.marks || "",
              eng_marks: responseData.eng_marks || "",
              math_marks: responseData.math_marks || "",
              university: responseData.universityName || "",
              institute_name: responseData.instituteName || "",
              course_name: responseData.courseName || "",
              course_type: responseData.courseType || "",
              start_year: responseData.duration.from || "",
              end_year: responseData.duration.to || "",
              grading_system: responseData.gradingSystem || "",
              is_primary: responseData.isPrimary || false,
              transcript: null,
              transcriptPreview: responseData.transcript_data || "",
              certificate: null,
              certificatePreview: responseData.certificate_data || "",
              level_type: responseData.levelType || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchuserdata();
    }
  }, [edit_id]);

  const validateForm = () => {
    // 'level' is always required
    if (!formData.level || formData.level.toString().trim() === "") {
      return false;
    }

    if (formData.level == 1 || formData.level == 2) {
      const requiredFields = [
        "level",
        "state",
        "board",
        "year_of_passing",
        "medium",
        "marks",
      ];

      if (formData.level == 2) {
        requiredFields.push("eng_marks");
        requiredFields.push("math_marks");
      }

      const isAnyFieldEmpty = requiredFields.some((field) => {
        const value = formData[field];

        return !value || value.toString().trim() === "";
      });

      if (isAnyFieldEmpty) return false;
    } else {
      const requiredFields = [
        "level",
        "state",
        "university",
        "institute_name",
        "course_name",
        "course_type",
        "start_year",
        "end_year",
        "grading_system",
        "marks",
      ];

      const isAnyFieldEmpty = requiredFields.some((field) => {
        const value = formData[field];
        if (field === "transcript" || field === "certificate") {
          return !value;
        }
        return !value || value.toString().trim() === "";
      });

      if (isAnyFieldEmpty) return false;
      0;
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

    if (!validateForm()) {
      console.log("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      const payload = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          payload.append(key, formData[key]);
        }
      }
      if (edit_id) {
        const response = await axios.put(
          `${apiurl}/api/useraction/usereducation`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Education data saved successfully:", response.data);
      } else {
        const response = await axios.post(
          `${apiurl}/api/useraction/usereducation`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Education data saved successfully:", response.data);
      }

      setSuccess("Education data saved successfully");
      setReload(true);
      onClose();
    } catch (error) {
      console.error("Error saving education data:", error);
      setError("Error saving education data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!edit_id) {
      console.error("No education record selected for deletion.");
      return;
    }
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    try {
      setLoading(true);

      /* /api/useraction/delete_user_data?_id=683958213ade488ea47299eb */
      const response = await axios.delete(
        `${apiurl}/api/useraction/delete_user_data?_id=${edit_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete education record");
      }
      setReload(true);
      onClose();
    } catch (error) {
      console.error("Error deleting education record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Academics</h5>
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
                Details like course, university, and more, help recruiters
                identify your educational background
              </span>
              {edit_id && (
                <span style={{ color: "red", cursor: "pointer" }}>
                  <Trash2 size={20} onClick={handleConfirmDelete} />
                </span>
              )}
            </div>

            {/*    <button
              className="btn btn-primary"
              onClick={() => console.log(formData)}
            >
              TEST
            </button> */}

            <EducationForm
              formData={formData}
              setFormData={setFormData}
              selectedLevel_main={selectedLevel}
              edit_id_main={edit_id}
              loading={loading}
              setLoading={setLoading}
            />
          </div>

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
                {edit_id ? (
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
  );
};

export default EducationModal;
