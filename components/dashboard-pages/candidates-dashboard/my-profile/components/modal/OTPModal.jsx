import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomizedProgressBars from "@/components/common/loader";
import axios from "axios";

const OTPModel = ({
  show,
  onClose,
  setReload,
  setError_main,
  setSuccess_main,
  phone,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ otp: "" });
  const [resendTimer, setResendTimer] = useState(0);
  const [showOTPField, setShowOTPField] = useState(false);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");

  if (!show) return null;

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setFormData({ otp: value });
    }
  };

  // First step: verify mobile number (send OTP)
  const handleVerifyNumber = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${apiurl}/api/userdata/candidate_phonenumber_verify`,
        { phone: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess("OTP sent successfully!");
        setShowOTPField(true);
        setResendTimer(60);
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.otp || formData.otp.length < 4) {
      setError("Please enter a valid OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiurl}/api/userdata/verify-otp`,
        { otp: formData.otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess("OTP verified successfully!");
        setSuccess_main("OTP verified successfully!");
        setReload(true);
        setTimeout(() => onClose(), 1500);
      } else {
        setError(response.data.message || "OTP verification failed.");
        setError_main(response.data.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setError_main("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${apiurl}/api/userdata/candidate_phonenumber_verify`,
        { phone: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess("OTP resent successfully!");
        setResendTimer(30);
      } else {
        setError(response.data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const maskPhone = (num) => {
    if (!num) return num;
    // Remove spaces just for processing
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.length < 10) return num;

    // Keep first 6 characters (+91 84), mask 5 digits, keep last 2 digits
    return (
      cleanNum.substring(0, 6) +
      "*****" +
      cleanNum.substring(cleanNum.length - 2)
    );
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Phone Number Verification</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {loading ? (
                <CustomizedProgressBars />
              ) : (
                <>
                  {/* Alerts */}
                  {error && (
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      {error}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                      ></button>
                    </div>
                  )}

                  {success && (
                    <div
                      className="alert alert-success alert-dismissible fade show"
                      role="alert"
                    >
                      {success}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess(null)}
                      ></button>
                    </div>
                  )}

                  {!showOTPField && (
                    <div className="mb-3 d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control"
                        value={maskPhone(phone)}
                        readOnly
                        style={{ width: "75%" }}
                      />
                      <button
                        type="button"
                        className="btn btn-success ms-2 "
                        onClick={handleVerifyNumber}
                      >
                        Send OTP
                      </button>
                    </div>
                  )}

                  {showOTPField && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="otp" className="form-label">
                          <b>OTP</b> <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          name="otp"
                          type="number"
                          className="form-control"
                          value={formData.otp}
                          onChange={handleChange}
                          placeholder="Enter OTP"
                          required
                        />
                      </div>

                      {showOTPField && (
                        <button type="submit" className="btn btn-primary mt-2">
                          Verify
                        </button>
                      )}

                      <button
                        type="button"
                        className={`btn mt-2 ms-2 ${resendTimer > 0 ? "btn-secondary" : "btn-success"}`}
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                      >
                        {resendTimer > 0
                          ? `Resend OTP in ${resendTimer}s`
                          : "Resend OTP"}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPModel;
