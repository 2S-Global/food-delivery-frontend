"use client";
import { queueRequest } from "../helper/queueHelper";
import React, { useState, useEffect } from "react";
import EducationModal from "./modal/EducationModal"; // Import the modal component
import ClgDisplay from "./academicbox_component/clgdisplay";
import SchoolDisplay from "./academicbox_component/schooldisplay";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const Academysection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState({}); // Track expanded descriptions
  const [listlevel, setListlevel] = useState([]);
  const [reload, setReload] = useState(false);
  const [missingLevels, setMissingLevels] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [userdata, setUserdata] = useState([]);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [edit_id, setEdit_id] = useState("");

  const [sectionloading, setSectionloading] = useState(false);

  useEffect(() => {
    if (reload) {
      fetchuserdata();
      fetchLevels();
      setReload(false);
    }
  }, [reload]);

  const fetchuserdata = async () => {
    try {
      setSectionloading(true);

      /*   const response = await axios.get(
        `${apiurl}/api/userdata/get_user_education`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/userdata/get_user_education`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (response.status == 200) {
        setUserdata(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setSectionloading(false);
    }
  };
  const fetchLevels = async () => {
    try {
      /*   const response = await axios.get(
        `${apiurl}/api/sql/dropdown/education_level`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/sql/dropdown/education_level`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      setListlevel(response.data.data);
    } catch (error) {
      //  console.error("Error fetching levels:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchLevels();
    fetchuserdata();
  }, []);

  useEffect(() => {
    const compareLevels = async () => {
      //map missing levels from userdata
      const missingLevels = listlevel.filter((level) => {
        return !userdata.some((item) => item.level_id == level.id);
      });

      // console.log("Missing Levels:", missingLevels);
      setMissingLevels(missingLevels);
    };

    compareLevels();
  }, [userdata, listlevel]);

  const openModalRH = (level, edit_id) => {
    setIsModalOpen(true);
    if (level) {
      console.log("Selected Level:", level);
      setSelectedLevel(level);
    } else {
      setSelectedLevel("");
    }

    if (edit_id) {
      setEdit_id(edit_id);
    } else {
      setEdit_id("");
    }

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
      <MessageComponent
        error={error}
        success={success}
        setError={setError}
        setSuccess={setSuccess}
      />
      {sectionloading ? (
        <>
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h4>Academics</h4>
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
              <CustomizedProgressBars />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h4>Academics</h4>
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

              {/* Display Resume Headline */}
              <div className="widget-content">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <div className="resume-content">
                    {userdata.map((item, index) => (
                      <div key={index}>
                        {item.level_id == 1 || item.level_id == 2 ? (
                          <SchoolDisplay
                            data={item}
                            openModalRH={openModalRH}
                          />
                        ) : (
                          <ClgDisplay data={item} openModalRH={openModalRH} />
                        )}
                      </div>
                    ))}

                    {/* Add Buttons */}

                    {missingLevels.map((level) => (
                      <span
                        key={level.id}
                        onClick={() => openModalRH(level.id)}
                        style={{
                          cursor: "pointer",
                          display: "block",
                          color: "#275df5",
                          fontWeight: 700,
                          fontSize: "16px",
                          paddingBottom: "10px", // Added bottom padding
                        }}
                      >
                        Add {level.level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Resume Headline Section */}

      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && (
        <EducationModal
          show={isModalOpen}
          onClose={closeModalRH}
          reload={reload}
          setReload={setReload}
          selectedLevel={selectedLevel}
          edit_id={edit_id}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default Academysection;
