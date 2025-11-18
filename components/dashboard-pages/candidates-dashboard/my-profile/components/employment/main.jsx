"use client";

import { queueRequest } from "../../helper/queueHelper";
import React, { useState, useEffect } from "react";
import EmploymentModal from "./modal.jsx"; // Import the modal component
import axios from "axios";
import { BadgeCheck, BadgeAlert, Info } from "lucide-react";
//utils
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const Employsectionmain = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState({}); // Track expanded descriptions
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [item, setItem] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const openModalRH = (Edit_item) => {
    if (Edit_item) {
      setItem(Edit_item);
      console.log("Selected Item:", item);
    } else {
      setItem([]);
    }
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
  useEffect(() => {
    fetchuserdata();
  }, [apiurl]);

  useEffect(() => {
    if (reload) {
      fetchuserdata();
      setReload(false);
    }
  }, [reload]);

  const fetchuserdata = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("candidate_token");
      /*  const response = await axios.get(
        `${apiurl}/api/candidate/employment/get_employment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/candidate/employment/get_employment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (response.data.success) {
        setUserdata(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
    setLoading(false);
  };

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
            <h4>Employment </h4>
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
          {loading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              {/* Display Resume Headline */}
              <div className="widget-content">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <div className="resume-content">
                    {userdata.map((row, index) => (
                      <div key={index} className="resume-item emp-list pb-3">
                        {/* Job Title and Edit Icon */}
                        <div className="item title typ-14Bold">
                          <span
                            className="truncate emp-desg"
                            title={row.job_title}
                          >
                            <strong className="me-2">{row.job_title}</strong>
                            {row.designationVerified ? (
                              <>
                                <BadgeCheck size={20} color="green" />
                              </>
                            ) : (
                              <>
                                <BadgeAlert size={20} color="orange" />
                              </>
                            )}
                          </span>{" "}
                          {row.isVerified ? (
                            <>
                              <span
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={row.remarks || "No remarks"}
                                style={{ cursor: "pointer" }}
                              >
                                <Info
                                  size={20}
                                  color="green"
                                  className="ms-2"
                                />
                              </span>
                            </>
                          ) : (
                            <>
                              <i
                                className="la la-pencil-alt"
                                onClick={() => openModalRH(row)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </>
                          )}
                        </div>

                        {/* Company Name */}
                        <div className="item">
                          <span
                            className="truncate typ-14Medium emp-org"
                            title={row.company_name}
                          >
                            <strong>{row.company_name}</strong>
                          </span>
                          {/* Show verified/unverified image */}
                          <img
                            src={
                              row.isVerified
                                ? "/images/resource/verified.png"
                                : "/images/resource/unverified.png"
                            }
                            alt={row.isVerified ? "Verified" : "Not Verified"}
                            style={{ width: "100px", height: "20px" }}
                            className="ms-2"
                          />
                        </div>

                        {/* Job Type and Duration */}
                        <div className="item experienceType typ-14Regular">
                          <span className="truncate expType">
                            {row.employmenttype?.charAt(0).toUpperCase() +
                              row.employmenttype?.slice(1).toLowerCase()}{" "}
                            {row.jobTypeVerified ? (
                              <>
                                <BadgeCheck size={20} color="green" />
                              </>
                            ) : (
                              <>
                                <BadgeAlert size={20} color="orange" />
                              </>
                            )}
                          </span>
                          <br />
                          <span className="truncate">
                            {row.joining_month_name} {row.joining_year} to{" "}
                            {row.currentlyWorking ? (
                              "Present"
                            ) : (
                              <>
                                {" "}
                                {row.leaving_month_name} {row.leaving_year}
                              </>
                            )}{" "}
                            {row.jobDurationVerified ? (
                              <>
                                <BadgeCheck size={20} color="green" />
                              </>
                            ) : (
                              <>
                                <BadgeAlert size={20} color="orange" />
                              </>
                            )}
                          </span>
                        </div>

                        {/* Notice Period (Only if exists) */}
                        {row.notice_period && (
                          <div className="item emp-notice-prd typ-14Medium">
                            Notice Period : {row.notice_period_name}
                          </div>
                        )}

                        {/* Job Description with Read More Toggle */}
                        <span
                          style={{ textAlign: "justify" }}
                          dangerouslySetInnerHTML={{ __html: row.description }}
                        ></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && (
        <EmploymentModal
          show={isModalOpen}
          onClose={closeModalRH}
          item={item}
          setReload={setReload}
          setmainError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default Employsectionmain;
