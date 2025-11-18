"use client";

import { useState, useEffect } from "react";
import VerificationForm from "./From";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import ComingSoon from "@/components/common/commingsoon";
import { se } from "date-fns/locale";

import PanDetails from "./documents/pancard";
import DlDetails from "./documents/dlcard";
import EpicDetails from "./documents/epiccard";
import PassDetails from "./documents/passportcard";

const KycBox = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userdata, setUserdata] = useState({
    pan: { verified: false, incart: false, inprocess: false },
    driving_license: { verified: false, incart: false, inprocess: false },
    epic: { verified: false, incart: false, inprocess: false },
    passport: { verified: false, incart: false, inprocess: false },
  });

  const [listdocs, setListdocs] = useState([]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/get_verification_list`
      );
      if (response.data.success) {
        setListdocs(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        errorId={errorId}
        message_id={message_id}
      />
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <CustomizedProgressBars />
        </div>
      )}
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-content">
            {listdocs.map((doc) => (
              <div
                key={doc._id}
                className=""
                style={{ padding: "25px 0", borderBottom: "1px solid #ddd" }}
              >
                <h3 className="text-center pb-2">{doc.title}</h3>

                {userdata[doc?.verification_name]?.verified ? (
                  <>
                    {/*  {doc.verification_name === "pan" && <PanDetails />}
                    {doc.verification_name === "driving_license" && (
                      <DlDetails />
                    )}
                    {doc.verification_name === "epic" && <EpicDetails />}
                    {doc.verification_name === "passport" && <PassDetails />} */}
                  </>
                ) : userdata[doc?.verification_name]?.inprocess ? (
                  <span
                    style={{
                      display: "block",
                      backgroundColor: "#e6f4ff",
                      color: "#0073e6",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      margin: "6px auto", // centers horizontally
                      textAlign: "center",
                      width: "fit-content",
                    }}
                  >
                    In Process
                  </span>
                ) : userdata[doc?.verification_name]?.incart ? (
                  <span
                    style={{
                      display: "block",
                      backgroundColor: "#e6f4ff",
                      color: "#0073e6",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      margin: "6px auto", // centers horizontally
                      textAlign: "center",
                      width: "fit-content",
                    }}
                  >
                    Already in Cart
                  </span>
                ) : (
                  <VerificationForm Document={doc} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default KycBox;
