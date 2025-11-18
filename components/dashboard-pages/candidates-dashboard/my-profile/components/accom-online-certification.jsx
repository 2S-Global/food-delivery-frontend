"use client";
import { queueRequest } from "../helper/queueHelper";
/* import "bootstrap/dist/css/bootstrap.min.css"; */
import React, { useState, useEffect } from "react";
import axios from "axios";

//components
import CertificateMain from "./accomSection/certificate/main";

//utils
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const AcomSection = () => {
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [certificatelist, setCertificatelist] = useState([]);
  const [reloadcertificatelist, setReloadcertificatelist] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchCertificatelist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);

  useEffect(() => {
    if (reloadcertificatelist) {
      fetchCertificatelist();
      setReloadcertificatelist(false);
    }
  }, [reloadcertificatelist]);

  //functions
 
  const fetchCertificatelist = async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      /* const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/list_certificate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/candidate/accomplishments/list_certificate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (response.status == 200) {
        setCertificatelist(response.data.data);
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
                  <CertificateMain
                    list={certificatelist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadcertificatelist}
                    setReload={setReloadcertificatelist}
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