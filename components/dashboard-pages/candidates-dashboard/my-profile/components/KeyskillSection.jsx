"use client";
import { queueRequest } from "../helper/queueHelper";
import React, { useState, useEffect } from "react";
import KeySkillsModal from "./modal/keyskillsModal"; // Import the modal component
import axios from "axios";
import MessageComponent from "@/components/common/ResponseMsg";
const Keyskillsection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyskill, setKeySkill] = useState([]);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  useEffect(() => {
    const fetchKeySkill = async () => {
      try {
        const token = localStorage.getItem("candidate_token");
        /*  const response = await axios.get(
          `${apiurl}/api/userdata/candidateskills`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); */
        const response = await queueRequest(() =>
          axios.get(`${apiurl}/api/userdata/candidateskills`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
        if (response.status == 200) {
          setKeySkill(response.data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchKeySkill();
  }, [apiurl]);
  const openModalRH = () => {
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
      {/* Resume Headline Section */}
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-title">
            <h4>Key Skills</h4>
            {/* Open modal using an onClick function */}
            <i
              className="la la-pencil-alt"
              onClick={openModalRH}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          {/* Display Resume Headline */}
          <div className="widget-content">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {keyskill.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    padding: "8px 8px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                  }}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && (
        <KeySkillsModal
          show={isModalOpen}
          onClose={closeModalRH}
          selectedSkills={keyskill}
          setKeySkill={setKeySkill}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default Keyskillsection;
