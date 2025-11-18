"use client";
import { queueRequest } from "../helper/queueHelper";
/* import "bootstrap/dist/css/bootstrap.min.css"; */
import React, { useState, useEffect } from "react";
import axios from "axios";

//components
import PresentationMain from "./accomSection/presentation/main";

//utils
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const AcomSection = () => {
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [presentationlist, setPresentationlist] = useState([]);
  const [reloadpresentationlist, setReloadpresentationlist] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchPresentationlist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);

  useEffect(() => {
    if (reloadpresentationlist) {
      fetchPresentationlist();
      setReloadpresentationlist(false);
    }
  }, [reloadpresentationlist]);

  //functions

  const fetchPresentationlist = async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      /* const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/get_presentaion`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/candidate/accomplishments/get_presentaion`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (response.status == 200) {
        setPresentationlist(response.data.data);
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
                  <PresentationMain
                    list={presentationlist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadpresentationlist}
                    setReload={setReloadpresentationlist}
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
