"use client";
import { queueRequest } from "../helper/queueHelper";

import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";

import KycModal from "./kyc/kycModal";
const KYCSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [reload, setReload] = useState(false);
  const [sectionloading, setSectionloading] = useState(false);

  useEffect(() => {}, [reload]);

  const openModalRH = () => {
    console.log("Opening Modal...");
    setIsModalOpen(true);
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
        errorId={errorId}
        message_id={message_id}
      />
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-title">
            <h4>KYC</h4>
            {/* Open modal using an onClick function */}
            <i
              className="la la-pencil-alt"
              onClick={openModalRH}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          {sectionloading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              <div className="widget-content">
                <p style={{ textAlign: "justify" }}>
                  {"Add Your KYC Documents and get verified"}
                </p>
              </div>{" "}
            </>
          )}
        </div>
      </div>

      <KycModal
        show={isModalOpen}
        onClose={closeModalRH}
        setError={setError}
        setSuccess={setSuccess}
        setMessageId={setMessageId}
        setErrorId={setErrorId}
        setReload={setReload}
        setSectionloading={setSectionloading}
      />
    </>
  );
};

export default KYCSection;
