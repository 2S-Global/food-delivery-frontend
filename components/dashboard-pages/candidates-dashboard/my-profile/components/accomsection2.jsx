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
  const [worksamplelist, setWorksamplelist] = useState([]);
  const [researchlist, setResearchlist] = useState([]);
  const [presentationlist, setPresentationlist] = useState([]);
  const [patentlist, setPatentlist] = useState([]);
  const [certificatelist, setCertificatelist] = useState([]);
  const [reloadonlineProfilelist, setReloadonlineProfilelist] = useState(false);
  const [reloadWorksamplelist, setReloadWorksamplelist] = useState(false);
  const [reloadresearchlist, setReloadresearchlist] = useState(false);
  const [reloadpresentationlist, setReloadpresentationlist] = useState(false);
  const [reloadpatentlist, setReloadpatentlist] = useState(false);
  const [reloadcertificatelist, setReloadcertificatelist] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchonlineProfilelist();
      fetchWorksamplelist();
      fetchResearchlist();
      fetchPresentationlist();
      fetchPatentlist();
      fetchCertificatelist();
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

  useEffect(() => {
    if (reloadWorksamplelist) {
      fetchWorksamplelist();
      setReloadWorksamplelist(false);
    }
  }, [reloadWorksamplelist]);

  useEffect(() => {
    if (reloadresearchlist) {
      fetchResearchlist();
      setReloadresearchlist(false);
    }
  }, [reloadresearchlist]);

  useEffect(() => {
    if (reloadpresentationlist) {
      fetchPresentationlist();
      setReloadpresentationlist(false);
    }
  }, [reloadpresentationlist]);

  useEffect(() => {
    if (reloadpatentlist) {
      fetchPatentlist();
      setReloadpatentlist(false);
    }
  }, [reloadpatentlist]);

  useEffect(() => {
    if (reloadcertificatelist) {
      fetchCertificatelist();
      setReloadcertificatelist(false);
    }
  }, [reloadcertificatelist]);

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
          <div className="widget-title">
            <h4>Accomplishments</h4>
          </div>
          {sectionloading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              <div className="widget-content">
                <div className="border-bottom my-3">
                  <ProfileMain
                    list={onlineProfilelist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadonlineProfilelist}
                    setReload={setReloadonlineProfilelist}
                  />
                </div>

                <div className="border-bottom my-3">
                  <Workmain
                    list={worksamplelist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadWorksamplelist}
                    setReload={setReloadWorksamplelist}
                  />
                </div>

                <div className="border-bottom my-3">
                  <ResearchMain
                    list={researchlist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadresearchlist}
                    setReload={setReloadresearchlist}
                  />
                </div>

                <div className="border-bottom my-3">
                  <PresentationMain
                    list={presentationlist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadpresentationlist}
                    setReload={setReloadpresentationlist}
                  />
                </div>

                <div className="border-bottom my-3">
                  <PatentMain
                    list={patentlist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadpatentlist}
                    setReload={setReloadpatentlist}
                  />
                </div>

                <div className="border-bottom my-3">
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
