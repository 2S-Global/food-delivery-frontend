"use client";
import { queueRequest } from "../helper/queueHelper";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectModal from "./modal/projectModal";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const ProjectSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resumeHeadline =
    "Stand out to employers by adding details about projects that you have done so far";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [reload, setReload] = useState(false);
  const [item, setItem] = useState([]);
  const [list, setList] = useState([]);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchData();
  }, [apiurl]);

  useEffect(() => {
    if (reload) {
      fetchData();
      setReload(false);
    }
  }, [reload]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("candidate_token");

    try {
      /*  const response = await axios.get(
        `${apiurl}/api/candidate/project/get_project_details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/candidate/project/get_project_details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (response.data.success) {
        setList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModalRH = (edit_item) => {
    setIsModalOpen(true);
    if (edit_item) {
      setItem(edit_item);
      console.log("Selected Item:", item);
    } else {
      setItem([]);
    }

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
            <h4>Projects</h4>
            {/* Open modal using an onClick function */}
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
          {loading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              <div className="widget-content">
                {list.length > 0 ? (
                  <>
                    {list.map((item) => (
                      <div
                        key={item._id}
                        className="my-2"
                        style={{ lineHeight: "1.4" }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#000",
                          }}
                        >
                          {item.title}

                          <i
                            onClick={() => openModalRH(item)}
                            className="la la-pencil-alt ms-2"
                            style={{ cursor: "pointer" }}
                          ></i>
                        </span>
                        <br />

                        <span className="text-muted">
                          Duration: {item.workfrommonth_name}{" "}
                          {item.workfromyear} to{" "}
                          {item.status === "in-progress" ? (
                            <>
                              <span>Present</span>
                            </>
                          ) : (
                            <span>
                              {item.worktomonth_name} {item.worktoyear}
                            </span>
                          )}
                        </span>
                        <br />

                        <p style={{ textAlign: "justify" }}>
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>{resumeHeadline}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && (
        <ProjectModal
          show={isModalOpen}
          onClose={closeModalRH}
          item={item}
          setReload={setReload}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default ProjectSection;
