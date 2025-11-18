"use client";
import { queueRequest } from "../helper/queueHelper";
import React, { useState, useEffect } from "react";
import OTskillModal from "./modal/otskillModal";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";

const OtherskillSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true); //make it true when ready
  const [reload, setReload] = useState(false);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const openModalRH = (skill) => {
    setIsModalOpen(true);
    setItem(skill || {});
    document.body.style.overflow = "hidden";
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("candidate_token");
      if (!token) {
        console.log("No token found");
        setError("Authentication token missing");
        return;
      }

      /* const response = await axios.get(
        `${apiurl}/api/candidate/itskill/itskill`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/candidate/itskill/getotherskill`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      if (response.data.success) {
        setUserdata(response.data.data);
      } else {
        setError("Failed to fetch IT skills");
      }
    } catch (err) {
      console.error("Error fetching IT skills:", err);
      setError("Something went wrong while fetching IT skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [apiurl]);

  useEffect(() => {
    if (reload) {
       fetchSkills();
      setReload(false);
    }
  }, [reload]);

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
          <div className="widget-title">
            <h4>Other Skills</h4>
            <span
              onClick={() => openModalRH()}
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

          <div className="widget-content">
            {loading ? (
              <CustomizedProgressBars />
            ) : (
              <>
                {userdata.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr className="border-bottom">
                          <th>Skill</th>
                          {/* <th>Version</th> */}
                          {/* <th>Last Used</th> */}
                          <th>Experience</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userdata.map((skill, index) => (
                          <tr key={index}>
                            <td>{skill.skillSearch || "N/A"}</td>
                            {/* <td>{skill.version || "N/A"}</td> */}
                            {/* <td>{skill.lastUsed || "N/A"}</td> */}
                            <td>
                              {skill.experienceyear || "0"} yr{" "}
                              {skill.experiencemonth || "0"} mo
                            </td>
                            <td>
                              <i
                                className="la la-pencil-alt"
                                onClick={() => openModalRH(skill)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No other skills added yet.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <OTskillModal
          show={isModalOpen}
          onClose={closeModalRH}
          item={item}
          setError={setError}
          setSuccess={setSuccess}
          setReload={setReload}
        />
      )}
    </>
  );
};

export default OtherskillSection;
