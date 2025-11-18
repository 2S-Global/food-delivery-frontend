"use client";
import { queueRequest } from "../helper/queueHelper";
/* import "bootstrap/dist/css/bootstrap.min.css"; */
import React, { useState, useEffect } from "react";
import axios from "axios";

//components
import Workmain from "./accomSection/worksample/main";

//utils
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const AcomSection = () => {
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [worksamplelist, setWorksamplelist] = useState([]);
  const [reloadWorksamplelist, setReloadWorksamplelist] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchWorksamplelist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);

  useEffect(() => {
    if (reloadWorksamplelist) {
      fetchWorksamplelist();
      setReloadWorksamplelist(false);
    }
  }, [reloadWorksamplelist]);

  //functions

  const fetchWorksamplelist = async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      /*   const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/get_work_samples`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/candidate/accomplishments/get_work_samples`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      if (response.status == 200) {
        setWorksamplelist(response.data.data);
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
                  <Workmain
                    list={worksamplelist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadWorksamplelist}
                    setReload={setReloadWorksamplelist}
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
