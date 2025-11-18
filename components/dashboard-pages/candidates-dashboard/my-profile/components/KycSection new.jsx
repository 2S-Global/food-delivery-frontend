"use client";
import { queueRequest } from "../helper/queueHelper";

import React, { use } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";

import KycModal from "./kyc/kycModal";

import RazorpayPayment from "./kyc/Razorpay";

import AadharCardInfo from "./kyc/AadharCardInfo";

const KYCSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  const [focusSection, setFocusSection] = useState(null);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [reload, setReload] = useState(false);
  const [sectionloading, setSectionloading] = useState(true);

  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    if (reload) {
      FetchData();
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    FetchData();
  }, [token]);

  const FetchData = async () => {
    setSectionloading(true);
    try {
      const response = await queueRequest(() =>
        axios.get(`${apiurl}/api/candidatekyc/kyc`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      if (response.data.success) {
        setUserdata(response.data.kyc);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  };

  const openModalRH = (type) => {
    setFocusSection(type);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  const handelpaymentsuccess = async (response) => {
    setSectionloading(true);
    try {
      const res = await axios.post(
        `${apiurl}/api/candidatekyc/verify-order`,
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setError(null);
        setErrorId(null);
        setSuccess(res.data.verificationResult?.message || res.data.message);
        setMessageId(Date.now());
        setReload(true);

        console.log("✅ Verified Order:", res.data.order);
      } else {
        setError(res.data.message);
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error("❌ Verification API Error:", error);
      setError("Failed to update KYC. Try again later.");
      setErrorId(Date.now());
    } finally {
      setSectionloading(false);
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
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-title">
            <h4>KYC {/* NEW */}</h4>
            {/* Open modal using an onClick function */}
            <i
              className="la la-pencil-alt"
              onClick={() => openModalRH("all")}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          {sectionloading ? (
            <CustomizedProgressBars />
          ) : (
            <>
              <div className="widget-content">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    {" "}
                    <strong>Pan Card</strong>
                    {userdata?.pan_number && (
                      <>
                        {userdata?.pan_verified ? (
                          <FaCheckCircle className="ms-2 text-success" />
                        ) : (
                          <>
                            {" "}
                            <FaRegCircleXmark className="ms-2 text-danger" />{" "}
                            <RazorpayPayment
                              onSuccess={handelpaymentsuccess}
                              documentType="pan"
                            />
                          </>
                        )}
                      </>
                    )}
                    <div>
                      <div className="mt-2">
                        {userdata?.pan_number ? (
                          <div
                            className="text-secondary"
                            style={{ lineHeight: 1.5 }}
                          >
                            <div>
                              <span className="fw-semibold">Name:</span>{" "}
                              {userdata?.pan_name}
                            </div>
                            <div>
                              <span className="fw-semibold">PAN Number:</span>{" "}
                              {userdata?.pan_number}
                            </div>
                          </div>
                        ) : (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "1rem" }}
                            onClick={() => openModalRH("pan")}
                          >
                            Add PAN info
                          </span>
                        )}
                      </div>
                    </div>{" "}
                  </div>

                  <div className="col-md-6 mb-4">
                    <strong>Driving License</strong>
                    {userdata?.dl_number && (
                      <>
                        {userdata?.dl_verified ? (
                          <FaCheckCircle className="ms-2 text-success" />
                        ) : (
                          <>
                            {" "}
                            <FaRegCircleXmark className="ms-2 text-danger" />{" "}
                            <RazorpayPayment
                              onSuccess={handelpaymentsuccess}
                              documentType="dl"
                            />
                          </>
                        )}
                      </>
                    )}

                    <div>
                      <div className="mt-2">
                        {userdata?.dl_number ? (
                          <div
                            className="text-secondary"
                            style={{ lineHeight: 1.5 }}
                          >
                            <div>
                              <span className="fw-semibold">Name:</span>{" "}
                              {userdata?.dl_name}
                            </div>
                            <div>
                              <span className="fw-semibold">DL Number:</span>{" "}
                              {userdata?.dl_number}
                            </div>
                            <div>
                              <span className="fw-semibold">DOB:</span>{" "}
                              {userdata?.dl_dob && (
                                <span>
                                  {new Date(userdata.dl_dob).toLocaleDateString(
                                    "en-GB"
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "1rem" }}
                            onClick={() => openModalRH("dl")}
                          >
                            Add Driving License Info
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <strong>EPIC Card</strong>
                    {userdata?.epic_number && (
                      <>
                        {userdata?.epic_verified ? (
                          <FaCheckCircle className="ms-2 text-success" />
                        ) : (
                          <>
                            {" "}
                            <FaRegCircleXmark className="ms-2 text-danger" />{" "}
                            <RazorpayPayment
                              onSuccess={handelpaymentsuccess}
                              documentType="epic"
                            />
                          </>
                        )}
                      </>
                    )}
                    <div>
                      <div className="mt-2">
                        {userdata?.epic_number ? (
                          <div
                            className="text-secondary"
                            style={{ lineHeight: 1.5 }}
                          >
                            <div>
                              <span className="fw-semibold">Name:</span>{" "}
                              {userdata?.epic_name}
                            </div>
                            <div>
                              <span className="fw-semibold">EPIC Number:</span>{" "}
                              {userdata?.epic_number}
                            </div>
                          </div>
                        ) : (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "1rem" }}
                            onClick={() => openModalRH("epic")}
                          >
                            Add EPIC Details
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <strong>Passport </strong>
                    {userdata?.passport_number && (
                      <>
                        {userdata?.passport_verified ? (
                          <FaCheckCircle className="ms-2 text-success" />
                        ) : (
                          <>
                            {" "}
                            <FaRegCircleXmark className="ms-2 text-danger" />{" "}
                            {/*  <button
                              className="btn btn-primary ms-2"
                              style={{
                                fontSize: "10px",
                                padding: "2px 6px",
                                lineHeight: 1,
                              }}
                            >
                              Verify Now
                            </button> */}
                            <RazorpayPayment
                              onSuccess={handelpaymentsuccess}
                              documentType="passport"
                            />
                          </>
                        )}
                      </>
                    )}
                    <div>
                      <div className="mt-2">
                        {userdata?.passport_number ? (
                          <div
                            className="text-secondary"
                            style={{ lineHeight: 1.5 }}
                          >
                            <div>
                              <span className="fw-semibold">Name:</span>{" "}
                              {userdata?.passport_name}
                            </div>
                            <div>
                              <span className="fw-semibold">
                                Passport File Number:
                              </span>{" "}
                              {userdata?.passport_number}
                            </div>
                            <div>
                              <span className="fw-semibold">DOB:</span>{" "}
                              {userdata?.passport_dob && (
                                <span>
                                  {new Date(
                                    userdata.passport_dob
                                  ).toLocaleDateString("en-GB")}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span
                            className="text-primary fw-bold"
                            style={{ cursor: "pointer", fontSize: "1rem" }}
                            onClick={() => openModalRH("passport")}
                          >
                            Add Passport Info
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* {userdata && ( */}
                  <AadharCardInfo
                    userdata={userdata}
                    openModalRH={openModalRH}
                    setSectionloading={setSectionloading}
                    setError={setError}
                    setErrorId={setErrorId}
                    setSuccess={setSuccess}
                    setMessageId={setMessageId}
                    setReload={setReload}
                  />
                  {/*       )} */}
                </div>
              </div>{" "}
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <>
          {/* <PaymentModal
            show={isModalOpen}
            onClose={closeModalRH}
            setError={setError}
            setSuccess={setSuccess}
            setMessageId={setMessageId}
            setErrorId={setErrorId}
            setReload={setReload}
            focusSection={focusSection}
            data={userdata}
          /> */}
          <KycModal
            show={isModalOpen}
            onClose={closeModalRH}
            setError={setError}
            setSuccess={setSuccess}
            setMessageId={setMessageId}
            setErrorId={setErrorId}
            setReload={setReload}
            focusSection={focusSection}
            data={userdata}
          />
        </>
      )}
    </>
  );
};

export default KYCSection;
