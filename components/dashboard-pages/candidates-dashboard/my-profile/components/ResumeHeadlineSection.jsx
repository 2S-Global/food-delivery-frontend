"use client";
import { queueRequest } from "../helper/queueHelper";
import React, { useState, useEffect } from "react";
import ResumeHeadline from "./modal/resumeheadline"; // Import the modal component
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const ResumeHeadlineSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeHeadline, setResumeHeadline] = useState("");

  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const openModalRH = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };
  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchResumeHeadline = async () => {
      try {
        setSectionloading(true);
        const token = localStorage.getItem("candidate_token");
        const response = await queueRequest(() =>
          axios.get(`${apiurl}/api/userdata/resume_headline`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
        //set only if response code is 200

        setResumeHeadline(response.data.resumeHeadline);
      } catch (error) {
        console.error("Error fetching profile pic:", error);
      } finally {
        setSectionloading(false);
      }
    };

    fetchResumeHeadline();
  }, [apiurl]);
  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        setError={setError}
        setSuccess={setSuccess}
      />
      {/* Resume Headline Section */}
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-title">
            <h4>Resume Headline</h4>
            {/* Open modal using an onClick function */}
            <i
              className="la la-pencil-alt"
              onClick={openModalRH}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          {sectionloading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              {" "}
              <div className="widget-content">
                <p style={{ textAlign: "justify" }}>
                  {resumeHeadline?.trim() || "Add Your Resume Headline"}
                </p>
              </div>{" "}
            </>
          )}

          {/* Display Resume Headline */}
        </div>
      </div>

      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && (
        <ResumeHeadline
          show={isModalOpen}
          onClose={closeModalRH}
          mainresumeHeadline={resumeHeadline}
          mainsetResumeHeadline={setResumeHeadline}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default ResumeHeadlineSection;
