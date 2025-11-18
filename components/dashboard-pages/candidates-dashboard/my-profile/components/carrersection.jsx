"use client";

import { queueRequest } from "../helper/queueHelper";
import React, { useState, useEffect } from "react";
import CareerModal from "./modal/CareerModal";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";

const CareerSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusSection, setFocusSection] = useState(null);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  if (!token) {
    console.log("No token");
  }

  const salaryCurrencies = [
    { label: "₹", value: "INR" },
    { label: "$", value: "USD" },
    { label: "€", value: "EUR" },
    { label: "£", value: "GBP" },
  ];

  const [userdata, setUserdata] = useState({
    industry: "",
    industry_name: "",
    department: "",
    department_name: "",
    job_role: "",
    job_role_name: "",
    job_type: "",
    employment_type: "",
    work_location: "",
    work_location_name: "",
    currency_type: "",
    expected_salary: "",
    shift: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  //useEffect
  useEffect(() => {
    fetchuserdata();
  }, [token]);
  useEffect(() => {
    if (reload) {
      fetchuserdata();
      setReload(false);
    }
  }, [reload]);

  //function
  const fetchuserdata = async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      /*  const response = await axios.get(
        `${apiurl}/api/useraction/get_career_profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/useraction/get_career_profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (response.data.success) {
        setUserdata(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openModalRH = (section) => {
    if (section) {
      console.log(section);
      setFocusSection(section);
    } else {
      setFocusSection(null);
      console.log("no section");
    }
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        setError={setError}
        setSuccess={setSuccess}
      />
      <div className="ls-widget">
        <div className="tabs-box">
          {/* Title with Edit Icon */}
          <div
            className="widget-title"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>Career Profile</h4>
            <i
              className="la la-pencil-alt"
              onClick={() => openModalRH("")}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label="Edit Career Profile"
            ></i>
          </div>

          {/* Career Profile Details */}
          {loading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              <div className="widget-content container">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <strong>Current Industry</strong>
                    <div className="">
                      {userdata.industry_name ? (
                        userdata.industry_name
                      ) : (
                        <>
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("industry_section")}
                          >
                            Add Current Industry
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <strong>Department</strong>
                    <div className="">
                      {userdata.department_name ? (
                        userdata.department_name
                      ) : (
                        <>
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("department_section")}
                          >
                            Add Department
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <strong>Job Role</strong>
                    <div className="">
                      {userdata.job_role_name ? (
                        userdata.job_role_name
                      ) : (
                        <>
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("job_role_section")}
                          >
                            Add Job Role
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <strong>Desired Job Type</strong>
                    <div className="">
                      {userdata.job_type ? (
                        userdata.job_type
                      ) : (
                        <>
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("job_type_section")}
                          >
                            Add Job Type
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <strong>Desired Employment Type</strong>
                    <div className="">
                      {userdata.employment_type ? (
                        userdata.employment_type
                      ) : (
                        <>
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() =>
                              openModalRH("employment_type_section")
                            }
                          >
                            Add Employment Type
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <strong>Preferred Shift</strong>
                    <div className="">
                      {userdata.shift ? (
                        userdata.shift
                      ) : (
                        <>
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("shift_section")}
                          >
                            Add Shift
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <strong>Preferred Work Location</strong>
                    <div className="">
                      {userdata.work_location_name ? (
                        userdata.work_location_name
                      ) : (
                        <>
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("work_location_section")}
                          >
                            Add Work Location
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* const salaryCurrencies = [
    { label: "₹", value: "INR" },
    { label: "$", value: "USD" },
    { label: "€", value: "EUR" },
    { label: "£", value: "GBP" },
  ]; */}
                  <div className="col-md-6 mb-4">
                    <strong>Expected Salary</strong>
                    <div className="">
                      {userdata.expected_salary ? (
                        <>
                          {
                            // Find the symbol by currency type
                            salaryCurrencies.find(
                              (c) => c.value === userdata.currency_type
                            )?.label
                          }

                          {userdata.expected_salary?.toLocaleString("en-IN")}
                        </>
                      ) : (
                        <>
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() =>
                              openModalRH("expected_salary_section")
                            }
                          >
                            Add Expected Salary
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Employment Modal */}
      {isModalOpen && (
        <CareerModal
          show={isModalOpen}
          onClose={closeModalRH}
          focusSection={focusSection}
          item={userdata}
          setError={setError}
          setSuccess={setSuccess}
          setReload={setReload}
          salaryCurrencies={salaryCurrencies}
        />
      )}
    </>
  );
};

export default CareerSection;
