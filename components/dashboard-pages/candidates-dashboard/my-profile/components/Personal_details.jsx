"use client";
import { queueRequest } from "../helper/queueHelper";
import React, { useState, useEffect } from "react";
import PersonalModal from "./modal/PersonalModal2";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import { CircleCheck, CircleX } from "lucide-react";
const PersonalSection = () => {
  // Modal state
  const [modalType, setModalType] = useState(null);
  const [focusSection, setFocusSection] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // Personal details state (initial data)
  const [personalDetails, setPersonalDetails] = useState({
    gender: "",
    maritalStatus: "",
    moreinfo: "",
    dob: "",
    category: "",
    differentlyAbled: "",
    disabilityType: "",
    disabilityDescription: "",
    workplaceAssistance: "",
    partner_name: "",

    careerBreak: "",
    careerBreakReason: "",
    careerBreakStartYear: "",
    careerBreakStartMonth: "",
    currentlyOnCareerBreak: false,
    careerBreakEndYear: "",
    careerBreakEndMonth: "",

    workPermit: "",
    address: "",
    languages: [],
    usa_visa_type: "",
  });

  const [reload, setReload] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [sectionloading, setSectionloading] = useState(true);

  useEffect(() => {
    const fetchuserdata = async () => {
      try {
        setSectionloading(true);
        const token = localStorage.getItem("candidate_token");
        /* const response = await axios.get(
          `${apiurl}/api/candidate/personal/get_personal_details_with_name`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); */
        const response = await queueRequest(() =>
          axios.get(
            `${apiurl}/api/candidate/personal/get_personal_details_with_name`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        );
        if (response.status == 200) {
          const maindata = response.data.data;

          setPersonalDetails(maindata);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setSectionloading(false);
      }
    };
    fetchuserdata();
  }, [reload]);

  // Open and close modal handlers
  const openModalRH = (type) => {
    setModalType(type);
    setFocusSection(type); // set the focus section for modal
    document.body.style.overflow = "hidden";
  };
  const closeModalRH = () => {
    setModalType(null);
    setFocusSection(null); // reset focus section
    document.body.style.overflow = "auto";
  };

  const getFormattedDOB = (dob) => {
    if (!dob) return "";
    const date = new Date(dob); // Input: UTC string like "2000-10-12T18:30:00.000Z"
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata", // Force IST conversion
    };
    return date.toLocaleDateString("en-GB", options); // e.g., "13 Oct 2000"
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
            <h4>Personal Details</h4>
            <i
              className="la la-pencil-alt"
              onClick={() => openModalRH("editPersonal")}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label="Edit Personal Details"
            ></i>
          </div>
          {sectionloading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              {/* Personal Details */}
              <div className="widget-content">
                <div className="container">
                  <div className="row">
                    {/* Personal Section */}
                    <div className="col-md-6 mb-4">
                      <strong>Personal</strong>
                      <div className="typ-14Medium mt-1">
                        <div>
                          {[
                            personalDetails.gender,
                            personalDetails.maritalStatus,
                            personalDetails.moreinfo,
                          ]
                            .filter(Boolean)
                            .join(", ")}

                          {![
                            personalDetails.gender,
                            personalDetails.maritalStatus,
                            personalDetails.moreinfo,
                          ].every(Boolean) && (
                            <span
                              className="ms-2 text-primary fw-bold"
                              style={{ cursor: "pointer", fontSize: "16px" }}
                              onClick={() => openModalRH("personalInfo")}
                            >
                              Add more info
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* partner_name */}
                    {personalDetails.partner_name && (
                      <div className="col-md-6 mb-4">
                        <strong>Partner Name</strong>
                        <div
                          className="text-truncate typ-14Medium mt-1"
                          title={personalDetails.partner_name || ""}
                        >
                          {personalDetails.partner_name || "N/A"}
                        </div>
                      </div>
                    )}

                    {/* Career Break */}
                    <div className="col-md-6 mb-4">
                      <strong>Career Break</strong>
                      <div className="typ-14Medium mt-1">
                        {personalDetails.careerBreak ? (
                          personalDetails.careerBreak.toLowerCase() ===
                          "yes" ? (
                            <div className="">
                              <div>
                                Yes
                                {personalDetails.careerBreakReason && (
                                  <> – {personalDetails.careerBreakReason} </>
                                )}
                              </div>
                              <div className="d-flex flex-wrap gap-1">
                                <div>
                                  <strong> From:</strong>{" "}
                                  {personalDetails.careerBreakStartMonth}{" "}
                                  {personalDetails.careerBreakStartYear}
                                </div>
                                <div>
                                  <strong>To:</strong>{" "}
                                  {personalDetails.currentlyOnCareerBreak
                                    ? "Present"
                                    : `${personalDetails.careerBreakEndMonth} ${personalDetails.careerBreakEndYear}`}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span>{personalDetails.careerBreak}</span>
                          )
                        ) : (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("careerBreak")}
                          >
                            Add Career Break
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="col-md-6 mb-4">
                      <strong>Date of Birth</strong>
                      <div className="typ-14Medium mt-1">
                        {getFormattedDOB(personalDetails.dob) || (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("dob")}
                          >
                            Add Date of Birth
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-md-6 mb-4">
                      <strong>Category</strong>
                      <div className="typ-14Medium mt-1">
                        {personalDetails.category || (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("category")}
                          >
                            Add Category
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Work Permit */}
                    <div className="col-md-6 mb-4">
                      <strong>Work Permit</strong>
                      <div className="typ-14Medium mt-1">
                        {/* Show visa type if available */}
                        {personalDetails.usa_visa_type && (
                          <div>{personalDetails.usa_visa_type}</div>
                        )}

                        {/* Show work permit if available */}
                        {personalDetails.workPermit && (
                          <div>{personalDetails.workPermit}</div>
                        )}

                        {/* Show Add Work Permit only if both are missing */}
                        {!personalDetails.usa_visa_type &&
                          !personalDetails.workPermit && (
                            <div
                              className="text-primary fw-bold"
                              style={{ cursor: "pointer", fontSize: "16px" }}
                              onClick={() => openModalRH("workPermit")}
                            >
                              Add Work Permit
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-md-6 mb-4">
                      <strong>Address</strong>
                      <div className="typ-14Medium mt-1">
                        {personalDetails.address || (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("address")}
                          >
                            Add Address
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Differently Abled */}
                    <div className="col-md-6 mb-4">
                      <strong>Differently Abled</strong>
                      <div className="typ-14Medium mt-1">
                        {personalDetails.differentlyAbled ? (
                          personalDetails.differentlyAbled.toLowerCase() ===
                          "yes" ? (
                            <span>
                              {[
                                personalDetails.differentlyAbled,
                                personalDetails.disabilityType,
                                personalDetails.disabilityDescription,
                                personalDetails.workplaceAssistance,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          ) : (
                            <span>{personalDetails.differentlyAbled}</span>
                          )
                        ) : (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "16px" }}
                            onClick={() => openModalRH("differentlyAbled")}
                          >
                            Add Differently Abled Status
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Languages Section */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Languages</h5>
                  <span
                    onClick={() => openModalRH("languages")}
                    style={{
                      cursor: "pointer",
                      color: "#275df5",
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    {personalDetails.languages.length > 0 ? "Edit" : "Add"}
                  </span>
                </div>

                {/* Language Table */}
                {personalDetails.languages.length > 0 && (
                  <div className="table-responsive mt-3">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Language</th>
                          <th>Proficiency</th>
                          <th>Read</th>
                          <th>Write</th>
                          <th>Speak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personalDetails.languages.map((lang, index) => (
                          <tr key={index}>
                            <td>{lang.language}</td>
                            <td>{lang.proficiency}</td>
                            <td>
                              {lang.read ? (
                                <CircleCheck color="#00A85A" size={18} />
                              ) : (
                                <CircleX color="#FF0000" size={18} />
                              )}
                            </td>
                            <td>
                              {lang.write ? (
                                <CircleCheck color="#00A85A" size={18} />
                              ) : (
                                <CircleX color="#FF0000" size={18} />
                              )}
                            </td>
                            <td>
                              {lang.speak ? (
                                <CircleCheck color="#00A85A" size={18} />
                              ) : (
                                <CircleX color="#FF0000" size={18} />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal with data submission handler */}
      {modalType && (
        <PersonalModal
          show={!!modalType}
          onClose={closeModalRH}
          focusSection={focusSection}
          reload={reload}
          setReload={setReload}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default PersonalSection;
