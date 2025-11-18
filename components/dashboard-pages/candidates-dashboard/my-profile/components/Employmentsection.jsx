"use client";
import React, { useState } from "react";
import EmploymentModal from "./modal/employmentModal"; // Import the modal component

const Employsectiondemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState({}); // Track expanded descriptions

  const userdata = [
    {
      role: "Developer",
      company: "Google",
      type: "Full Time",
      is_verified: true,
      duration: "Jun 2023 to Present (1 Year and 8 months)",
      notice_period: "1 Month",
      description:
        "I have a strong foundation in web development and have recently completed my certification in JavaScript. I am eager to learn and grow in the field. I am looking for a challenging role that will allow me to use my skills to their full potential.",
    },
    {
      role: "Software Engineer",
      company: "Microsoft",
      type: "Full Time",
      is_verified: true,
      duration: "Jan 2021 to May 2023 (2 Years 4 Months)",
      description:
        "Designed and implemented scalable backend services using Node.js and Azure. Worked on improving system architecture and optimizing API response times.",
    },
    {
      role: "Backend Developer",
      company: "Amazon",
      type: "Contract",
      is_verified: false,
      duration: "Aug 2019 to Dec 2020 (1 Year 5 Months)",
      description:
        "Developed RESTful APIs and microservices using Express.js and MongoDB. Focused on performance tuning, security enhancements, and integration with AWS services.",
    },
  ];

  const openModalRH = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle expanded state for the specific item
    }));
  };

  return (
    <>
      {/* Resume Headline Section */}
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-title">
            <h4>Employment (demo)</h4>
            <span
              onClick={openModalRH}
              style={{
                cursor: "pointer",
                float: "right",
                color: "#275df5",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              Add
            </span>
          </div>

          {/* Display Resume Headline */}
          <div className="widget-content">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <div className="resume-content">
                {userdata.map((item, index) => (
                  <div key={index} className="resume-item emp-list pb-3">
                    {/* Job Title and Edit Icon */}
                    <div className="item title typ-14Bold">
                      <span className="truncate emp-desg" title={item.role}>
                        <strong>{item.role}</strong>
                      </span>
                      <i
                        className="la la-pencil-alt"
                        onClick={openModalRH}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>

                    {/* Company Name */}
                    <div className="item">
                      <span
                        className="truncate typ-14Medium emp-org"
                        title={item.company}
                      >
                        <strong>{item.company}</strong>
                      </span>
                      {/* Show verified/unverified image */}
                      <img
                        src={
                          item.is_verified
                            ? "/images/resource/verified.png"
                            : "/images/resource/unverified.png"
                        }
                        alt={item.is_verified ? "Verified" : "Not Verified"}
                        style={{ width: "100px", height: "20px" }}
                        className="ms-2"
                      />
                    </div>

                    {/* Job Type and Duration */}
                    <div className="item experienceType typ-14Regular">
                      <span className="truncate expType">{item.type}</span>
                      <span className="ver-line"></span>
                      <span className="truncate">{item.duration}</span>
                    </div>

                    {/* Notice Period (Only if exists) */}
                    {item.notice_period && (
                      <div className="item emp-notice-prd typ-14Medium">
                        {item.notice_period} Notice Period
                      </div>
                    )}

                    {/* Job Description with Read More Toggle */}
                    <div className="item prefill emp-desc typ-14Medium">
                      <div>
                        {expanded[index] ? (
                          <>
                            {item.description}{" "}
                            <a
                              href="#"
                              className="morelink"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleExpand(index);
                              }}
                            >
                              Read Less
                            </a>
                          </>
                        ) : (
                          <>
                            {item.description.length > 100 ? (
                              <>
                                {item.description.substring(0, 100)}...
                                <a
                                  href="#"
                                  className="morelink"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleExpand(index);
                                  }}
                                >
                                  Read More
                                </a>
                              </>
                            ) : (
                              item.description
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && (
        <EmploymentModal show={isModalOpen} onClose={closeModalRH} />
      )}
    </>
  );
};

export default Employsectiondemo;
