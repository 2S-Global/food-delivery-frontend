"use client";
import { queueRequest } from "../helper/queueHelper";
/* import "bootstrap/dist/css/bootstrap.min.css"; */
import React, { useState, useEffect } from "react";
import axios from "axios";

//components
import ProfileMain from "./accomSection/profile/main";
import Workmain from "./accomSection/worksample/main";
import ResearchMain from "./accomSection/research/main";
import PresentationMain from "./accomSection/presentation/main";
import PatentMain from "./accomSection/patent/main";
import CertificateMain from "./accomSection/certificate/main";

//utils
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const AcomSection = () => {
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [onlineProfilelist, setOnlineProfilelist] = useState([]);
  const [reloadonlineProfilelist, setReloadonlineProfilelist] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchonlineProfilelist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);

  useEffect(() => {
    if (reloadonlineProfilelist) {
      fetchonlineProfilelist();
      setReloadonlineProfilelist(false);
    }
  }, [reloadonlineProfilelist]);

  //functions
  const fetchonlineProfilelist = async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      /*  const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/get_online_profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(
          `${apiurl}/api/candidate/accomplishments/get_online_profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
      if (response.status == 200) {
        setOnlineProfilelist(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
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
          {/* <div className="widget-title">
            <h4>Online Profile</h4>
            <span
              onClick={() => openModal()}
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
          </div> */}
          {/* <span className="text-muted mb-2 mt-1">
            Add link to online professional profiles (e.g. LinkedIn, etc.)
          </span> */}

          {sectionloading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              <div className="widget-content">
                <div className="my-3">

                  {/* <span className="text-muted mb-2 mt-1">
                    Add link to online professional profiles (e.g. LinkedIn, etc.)
                  </span> */}

                  <ProfileMain
                    list={onlineProfilelist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadonlineProfilelist}
                    setReload={setReloadonlineProfilelist}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AcomSection;
