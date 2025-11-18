"use client";

import Link from "next/link";
import Modal from "./modal";
import { useState, useEffect } from "react";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import axios from "axios";

const Applicants = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [candidatesData, setCandidatesData] = useState([]);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [can_id, setCanId] = useState(null);
  const [employmentId, setEmploymentId] = useState(null);
  const [token, setToken] = useState(null);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("Institute_token"));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [token, apiurl]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/institutestudent/get_unverfired_students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setCandidatesData(response.data.data);
      }
    } catch (error) {
      // setError("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const openModalRH = (id, empId) => {
    setIsModalOpen(true);
    setCanId(id);
    setEmploymentId(empId);

    document.body.style.overflow = "hidden";
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    fetchData();
    document.body.style.overflow = "auto";
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

      <div className="container">
        <div className="row">
          {candidatesData && candidatesData.length > 0 ? (
            candidatesData.map((candidate) => (
              <div className="col-md-6 mb-3" key={candidate.employmentId}>
                <div className="card shadow-sm border-0 rounded-3 p-3 h-100">
                  <div className="d-flex align-items-center row">
                    <div className="me-3 col-md-6 mb-2">
                      <img
                        width={70}
                        height={70}
                        src={candidate.photo || "/images/resource/no_user.png"}
                        alt="candidates"
                        className="rounded-circle border border-primary"
                      />
                    </div>
                    <div className="flex-grow-1 col-md-6">
                      <h6 className="mb-1 fw-semibold">
                        <Link
                          href={`/candidates-details/${candidate.userId}`}
                          className="text-decoration-none text-dark"
                        >
                          {candidate.name}
                        </Link>
                      </h6>
                      <p className="mb-1 small text-muted">
                        {candidate.details}
                      </p>

                      {/* ✅ FIX: Bootstrap text-break for long emails */}
                      <p className="mb-2 small text-muted d-flex align-items-center text-break">
                        <i className="flaticon-envelope me-1 text-primary"></i>
                        {candidate.email}
                      </p>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            openModalRH(
                              candidate.userId,
                              candidate.employmentId
                            )
                          }
                        >
                          <i className="la la-eye me-1"></i> View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5">
                <img
                  src="/images/resource/no_user.png"
                  alt="no data"
                  width={80}
                  height={80}
                  className="mb-3"
                />
                <h6 className="fw-semibold">No candidates found</h6>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onClose={closeModalRH}
          can_id={can_id}
          emp_id={employmentId}
          setSuccess={setSuccess}
          setError={setError}
          setErrorId={setErrorId}
          setMessageId={setMessageId}
        />
      )}
    </>
  );
};

export default Applicants;
