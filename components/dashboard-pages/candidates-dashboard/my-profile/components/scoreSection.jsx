"use client";
import React, { useState, useEffect } from "react";

import { FaPhone, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";

const ScoreSection = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  const [loading, setLoading] = useState(true);
  const [userdata, setUserdata] = useState({});

  /* /api/userdata/get_candidate_info */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/userdata/get_candidate_info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setUserdata(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <>
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-content">
            {loading ? (
              <CustomizedProgressBars />
            ) : (
              <>
                {/* main code start here */}
                <div className="row">
                  <div className="col-md-6 d-flex justify-content-start align-items-center p-4">
                    <div className="p-4">
                      {/* Name & Degree Section */}
                      <div className="mb-3">
                        <h4 className="fw-bold mb-1 d-flex align-items-center">
                          {userdata.name} &nbsp;
                        </h4>
                        <p className="mb-2" title={userdata.phone_number}>
                          <FaPhone className="text-secondary me-2" />
                          {userdata.phone_number?.length > 15
                            ? userdata.phone_number.substring(0, 15) + "..."
                            : userdata.phone_number}
                        </p>
                        <p className="mb-2" title={userdata.email}>
                          <FaEnvelope className="text-secondary me-2" />
                          {userdata.email?.length > 15
                            ? userdata.email.substring(0, 15) + "..."
                            : userdata.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2 d-flex justify-content-center align-items-center p-2">
                    <img
                      /*   src="/images/resource/nextUpdate.png" */
                      src="/images/resource/Group 1 (1).jpg"
                      alt="Profile"
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                  <div className="col-md-2 d-flex justify-content-center align-items-center p-2">
                    <img
                      /*  src="/images/resource/cibil.png" */
                      src="/images/resource/Group 3.jpg"
                      alt="Profile"
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                  <div className="col-md-2 d-flex justify-content-center align-items-center p-2">
                    <img
                      /* src="/images/resource/experian.png" */
                      src="/images/resource/Group 2.jpg"
                      alt="Profile"
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                </div>
              </>
            )}

            {/* end */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScoreSection;
