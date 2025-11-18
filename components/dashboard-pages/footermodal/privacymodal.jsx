import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

const privacyModal = ({ show, onClose }) => {
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("Super_token") : null;

  const [terms, setTerms] = useState("this is the terms and conditions");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessage_id] = useState(null);

  const fetchTerms = async () => {
    setLoading(true);
    /* /api/terms/getTerms */
    try {
      console.log("Fetching terms and conditions...");
      const response = await axios.get(
        `${apiurl}/api/privacyRoute/getPrivacyPolicy`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTerms(response.data.privacy.content);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch terms and conditions.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content shadow-lg border-0 rounded-4">
            <div className="modal-header">
              <h5 className="modal-title">
                <strong>Privacy and Policy</strong>
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body px-4 py-3">
              <MessageComponent
                error={error}
                success={success}
                errorId={errorId}
                message_id={message_id}
              />

              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <div
                    className="spinner-border text-primary spinner-lg"
                    role="status"
                    style={{ width: "4rem", height: "4rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <p>{terms}</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default privacyModal;
