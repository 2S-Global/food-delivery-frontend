"use client";
import { queueRequest } from "../helper/queueHelper";
/* import "bootstrap/dist/css/bootstrap.min.css"; */
import React, { useState, useEffect } from "react";
import axios from "axios";

//components
import PatentMain from "./accomSection/patent/main";

//utils
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const AcomSection = () => {
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [patentlist, setPatentlist] = useState([]);
  const [reloadpatentlist, setReloadpatentlist] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchPatentlist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);
  
  useEffect(() => {
    if (reloadpatentlist) {
      fetchPatentlist();
      setReloadpatentlist(false);
    }
  }, [reloadpatentlist]);

  //functions
  const fetchPatentlist = async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      /* const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/list_patent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/candidate/accomplishments/list_patent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (response.status == 200) {
        setPatentlist(response.data.data);
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
                  <PatentMain
                    list={patentlist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadpatentlist}
                    setReload={setReloadpatentlist}
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