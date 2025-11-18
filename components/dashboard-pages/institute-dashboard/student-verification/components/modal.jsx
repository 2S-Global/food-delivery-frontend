"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import EmployeeInfoCard from "./EmployeeInfoCard";
import PersonalInfoCard from "./PersonalDetailsCard";

import VerificationFormSection from "./VerificationFormSection";

const Modal = ({
  show,
  onClose,
  can_id,
  emp_id,
  setSuccess = () => {},
  setMessageId = () => {},
  setError = () => {},
  setErrorId = () => {},
  is_complete = false,
}) => {
  if (!show) return null;

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(true);
  const [error, setErrorthis] = useState(null);
  const [success, setSuccessthis] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [formdata, setFormData] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("Institute_token"));
    }
  }, []);

  const FetchDetails = async (can_id, emp_id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/institutestudent/get_student_details?userId=${can_id}&employmentId=${emp_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        const data = response.data.data;
        setUser({
          name: data.name || "",
          father_name: data.fatherName || "",
          email: data.email || "",
          mobile: data.phone_number || "",
          dob: data.dob || "",
          gender: data.gender || "",
          address: data.permanentAddress || "",
          pan: data.pan_number || "",
          level: data.level || "",
          levelname: data.levelname || "",
          course_type: data.courseType || "",
          courseTypename: data.courseTypename || "",
          course_id: data.courseName_id || "",
          courseName: data.courseName || "",
          course_name: data.courseName || "",
          duration: data.duration || "",
          durationstring: data.durationstring || "",
          grading_system: data.grading_system || "",
          gradingSystem: data.gradingSystem || "",
          marks: data.marks || "",
          is_verified: data.is_verified || false,
          level_verified: data.level_verified || false,
          duration_verified: data.duration_verified || false,
          gradingSystem_verified: data.gradingSystem_verified || false,
          marks_verified: data.marks_verified || false,
          courseName_verified: data.courseName_verified || false,
          courseType_verified: data.courseType_verified || false,
          remarks: data.remarks || "",
          _id: can_id,
          employmentId: emp_id,
        });
      }
    } catch (error) {
      console.error("Error while fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (can_id && emp_id && token) FetchDetails(can_id, emp_id);
  }, [can_id, emp_id, token]);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <MessageComponent
        error={error}
        success={success}
        setError={setErrorthis}
        setSuccess={setSuccessthis}
      />

      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-3 overflow-hidden">
          <div className="modal-header">
            <h5 className="modal-title">Student Verification</h5>
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
              <>
                <PersonalInfoCard user={user} />
                <div className="mt-2">
                  <EmployeeInfoCard user={user} />
                </div>

                {!is_complete ? (
                  <VerificationFormSection
                    formdata={formdata}
                    setFormData={setFormData}
                    onClose={onClose}
                    is_complete={is_complete}
                    loading={loading}
                    setLoading={setLoading}
                    setSuccess={setSuccess}
                    setError={setError}
                    setErrorId={setErrorId}
                    setMessageId={setMessageId}
                  />
                ) : (
                  <>
                    <div className="modal-footer mt-4">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
