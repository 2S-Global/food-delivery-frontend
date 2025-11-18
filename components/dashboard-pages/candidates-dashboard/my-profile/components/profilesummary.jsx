"use client";
import { queueRequest } from "../helper/queueHelper";
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Profilesum from "./modal/profilesum";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const ProfilesumerySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilesummary, setProfilesummary] = useState();
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
    const fetchprofilesummary = async () => {
      try {
        setSectionloading(true);
        const token = localStorage.getItem("candidate_token");
        /*   const response = await axios.get(
          `${apiurl}/api/userdata/profile_summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); */
        const response = await queueRequest(() =>
          axios.get(`${apiurl}/api/userdata/profile_summary`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
        //set only if response code is 200
        setProfilesummary(response.data.profileSummary);
      } catch (error) {
        console.error("Error fetching profile pic:", error);
      } finally {
        setSectionloading(false);
      }
    };
    fetchprofilesummary();
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
            <h4>Profile summary</h4>
            {/* Open modal using an onClick function */}
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
              {profilesummary?.trim() ? "Edit" : "Add"}
            </span>
          </div>
          {/* Display Resume Headline */}

          {/* <div className="widget-content">
            <p>
              {profilesummary?.trim()
                ? profilesummary
                : "Highlight your key career achievements to help employers know your potentials."}
            </p>
          </div> */}
          {sectionloading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              {" "}
              <div className="widget-content">
                <p style={{ textAlign: "justify" }}>
                  {profilesummary?.trim() || "Add Your Resume Headline"}
                </p>
              </div>{" "}
            </>
          )}
        </div>
      </div>

      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && (
        <Profilesum
          show={isModalOpen}
          onClose={closeModalRH}
          mainprofilesummary={profilesummary}
          mainsetProfilesummary={setProfilesummary}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default ProfilesumerySection;
