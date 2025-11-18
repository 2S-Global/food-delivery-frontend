"use client";
import { queueRequest } from "../helper/queueHelper";
/* import "bootstrap/dist/css/bootstrap.min.css"; */
import React, { useState, useEffect } from "react";
import axios from "axios";

//components
import ResearchMain from "./accomSection/research/main";

//utils
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const AcomSection = () => {
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [researchlist, setResearchlist] = useState([]);
  const [reloadresearchlist, setReloadresearchlist] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchResearchlist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);

  useEffect(() => {
    if (reloadresearchlist) {
      fetchResearchlist();
      setReloadresearchlist(false);
    }
  }, [reloadresearchlist]);

  //functions

  const fetchResearchlist = async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      /* const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/get_research_publication`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(
          `${apiurl}/api/candidate/accomplishments/get_research_publication`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      if (response.status == 200) {
        setResearchlist(response.data.data);
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
            <h4>Accomplishments</h4>
          </div> */}
          {sectionloading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              <div className="widget-content">

                <div className="my-3">
                  <ResearchMain
                    list={researchlist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadresearchlist}
                    setReload={setReloadresearchlist}
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
