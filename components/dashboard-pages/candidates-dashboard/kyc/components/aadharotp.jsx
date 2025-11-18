import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; // you had imported it, keeping it
import MessageComponent from "@/components/common/ResponseMsg";

import RazorpayPayment from "@/components/common/payments/RazorpayPayment";

import axios from "axios";
import AadharForm from "./adharform";

const AadharOtp = () => {
  //razor pay
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const [otp, setOtp] = useState("");
  const [request_id, setRequest_id] = useState("");
  const [newId, setNewId] = useState("");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("Admin_token");
  const role = localStorage.getItem("Role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessage_id] = useState(null);
  const [formsubmitted, setFormsubmitted] = useState(false);
  const router = useRouter();
  //rendering
  const [renderForm, setRenderForm] = useState(true);
  const [renderBill, setRenderBill] = useState(false);
  const [renderotp, setRenderotp] = useState(false);

  /* Billing part */
  const [paymentmethod, setPaymentmethod] = useState("online");
  const [subTotal, setSubTotal] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [sgstPercentage, setSgstPercentage] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [cgstPercentage, setCgstPercentage] = useState(0);
  const [payments, setPayments] = useState([]);
  const [overall_billing, setOverallBilling] = useState({});

  const [total, setTotal] = useState(0);

  const [walletBalance, setWalletBalance] = useState(0);
  const handlePaymentSuccess = async (response, pay, pids) => {
    setLoading(true);
    console.log("From handlePaymentSuccess response", response);
    console.log("From handlePaymentSuccess pay", pay);
    console.log("From handlePaymentSuccess pids", pids);

    try {
      const paymentResponse = await axios.post(
        `${apiurl}/api/verify/paynowAadharOTP`,
        {
          razorpay_response: response,
          amount: pay,
          payment_method: paymentmethod,
          paymentIds: pids,
          overall_billing: overall_billing,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("From handlePaymentSuccess paymentResponse", paymentResponse);

      /* if code 200 */
      if (paymentResponse.status === 200) {
        setSuccess(
          "Your payment has been successfully processed. An invoice will be sent to your registered email shortly.Kindly Enter Your Aadhar OTP."
        );
        setMessage_id(Date.now());
        setNewId(paymentResponse.data.newId);
        setPayments([]);
        setRequest_id(paymentResponse.data.aadhar_response.request_id);
        setRenderBill(false);
        setRenderForm(false);
        setRenderotp(true);
        setLoading(false);
        setResendTimer(60);
      }
    } catch (err) {
      setError("Error processing payment. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handlefree = async (pay, pids) => {
    setLoading(true);
    console.log("From handlePaymentSuccess pay", pay);
    console.log("From handlePaymentSuccess pids", pids);

    try {
      const paymentResponse = await axios.post(
        `${apiurl}/api/verify/paynowaadharotpfree`,
        {
          amount: pay,
          payment_method: "Free",
          paymentIds: pids,
          overall_billing: overall_billing,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("From handlePaymentSuccess paymentResponse", paymentResponse);

      /* if code 200 */
      if (paymentResponse.status === 200) {
        setSuccess(
          "Your payment has been successfully processed. An invoice will be sent to your registered email shortly.Kindly Enter Your Aadhar OTP."
        );
        setMessage_id(Date.now());
        setNewId(paymentResponse.data.newId);
        setPayments([]);
        setRequest_id(paymentResponse.data.aadhar_response.request_id);
        setRenderBill(false);
        setRenderForm(false);
        setRenderotp(true);
        setLoading(false);
        setResendTimer(60);
      }
    } catch (err) {
      setError("Error processing payment. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setRenderBill(false);
      try {
        const response = await axios.get(
          `${apiurl}/api/usercart/list_user_cart_aadhar_otp`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //   console.log("From useEffect fetchPayments response", response);

        if (response.data.success) {
          setOverallBilling(response.data.billing || {});
          const paymentData = response.data.data;
          const billing = response.data.billing;

          setPayments(paymentData);

          setSubTotal(parseFloat(billing.subtotal) || 0);
          setTotal(parseFloat(billing.total) || 0);
          setDiscount(parseFloat(billing.discount) || 0);
          setDiscountPercentage(parseFloat(billing.discount_percent) || 0);
          setSgst(parseFloat(billing.sgst) || 0);
          setSgstPercentage(parseFloat(billing.sgst_percent) || 0);
          setCgst(parseFloat(billing.cgst) || 0);
          setCgstPercentage(parseFloat(billing.cgst_percent) || 0);
          setWalletBalance(parseFloat(billing.wallet_amount) || 0);
          if (paymentData.length !== 0) {
            setRenderForm(false);
            setRenderBill(true);
          }
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []); // ← runs only once on mount

  const setPaymentvalues = async () => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        setRenderForm(false);
        const response = await axios.get(
          `${apiurl}/api/usercart/list_user_cart_aadhar_otp`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setOverallBilling(response.data.billing || {});
          setPayments(response.data.data);
          setSubTotal(parseFloat(response.data.billing.subtotal) || 0);
          setTotal(parseFloat(response.data.billing.total) || 0);
          setDiscount(parseFloat(response.data.billing.discount) || 0);
          setDiscountPercentage(
            parseFloat(response.data.billing.discount_percent) || 0
          );
          setSgst(parseFloat(response.data.billing.sgst) || 0);
          setSgstPercentage(
            parseFloat(response.data.billing.sgst_percent) || 0
          );
          setCgst(parseFloat(response.data.billing.cgst) || 0);
          setCgstPercentage(
            parseFloat(response.data.billing.cgst_percent) || 0
          );
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err); // Debugging
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
        setRenderBill(true);
      }
    };

    fetchPayments();
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting OTP:", otp);
    console.log("request_id:", request_id);
    console.log("newId:", newId);

    try {
      const response = await axios.post(
        `${apiurl}/api/verify/verifyOtpAadhar`,
        {
          otp: otp,
          request_id: request_id,
          newId: newId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("From handleOTPSubmit response", response);

      if (response.data.success) {
        setSuccess(response.data.message);
        setMessage_id(Date.now());
        setRenderotp(false);
        setRenderForm(false);
        setRenderBill(false);
        setPayments([]);
        setRequest_id("");
        setOtp("");
        setTimeout(() => {
          router.push("/download-center");
        }, 5000);
      } else {
        console.log("Error submitting OTP:", response.data.message);
        setError(response.data.message || "Invalid OTP. Please try again.");
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error("Error submitting OTP:", err);
      setError("Error submitting OTP. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    setLoading(true);
    console.log("Deleting payment with ID:", id);
    try {
      setLoading(true);
      const Dlt_response = await axios.post(
        `${apiurl}/api/usercart/deleteUserAadharOTP`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Dlt_response.data.success) {
        setSubTotal(0);
        setPayments([]);
        setTotal(0);
        setDiscount(0);
        setDiscountPercentage(0);
        setSgst(0);
        setSgstPercentage(0);
        setCgst(0);
        setCgstPercentage(0);

        setSuccess(Dlt_response.data.message);
        setMessage_id(Date.now());
      }

      setRenderForm(true);
      setRenderBill(false);
      setFormsubmitted(false);
    } catch (err) {
      console.error("Error deleting payment:", err);
      setError("Error deleting payment. Please try again.");
      setErrorId(Date.now());
    }
    setLoading(false);
  };
  const paymentIdsString = payments.map((payment) => payment._id).join(", ");
  //console.log("Payment IDs:", paymentIdsString);
  const [resendTimer, setResendTimer] = useState(60);

  // Countdown for resend button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResendOTP = async () => {
    console.log("OTP resent");

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiurl}/api/verify/resendAadharOTP`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("From handleResendOTP response", response);

      if (response.data.success) {
        setSuccess(response.data.message);
        setMessage_id(Date.now());
        setOtp(""); // Clear the OTP input
        setNewId(response.data.newId);
        setPayments([]);
        setRequest_id(response.data.aadhar_response.request_id);
      } else {
        setError(response.data.message || "Failed to resend OTP.");
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("Error resending OTP. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      setResendTimer(60);
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
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="ls-widget">
          <div className="tabs-box">
            <div
              className="widget-content"
              style={{ padding: "25px 0", borderBottom: "1px solid #ddd" }}
            >
              <h3 className="text-center pb-2">Aadhar Card</h3>
              {renderForm && (
                <>
                  <AadharForm
                    loading={loading}
                    setLoading={setLoading}
                    error={error}
                    setError={setError}
                    setErrorId={setErrorId}
                    success={success}
                    setMessage_id={setMessage_id}
                    setSuccess={setSuccess}
                    setRenderBill={setRenderBill}
                    setRenderForm={setRenderForm}
                    setFormsubmitted={setFormsubmitted}
                    formsubmitted={formsubmitted}
                    setPaymentvalues={setPaymentvalues}
                  />
                </>
              )}

              {renderBill ? (
                <>
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        <th style={{ textAlign: "center" }}>Name</th>
                        <th style={{ textAlign: "center" }}>Mobile Number</th>
                        <th style={{ textAlign: "center" }}>Pay For</th>
                        <th style={{ textAlign: "center" }}>Amount</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length > 0 ? (
                        payments.map((payment, index) => (
                          <tr key={payment._id}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td style={{ textAlign: "center" }}>
                              {payment.candidate_name}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {payment.candidate_mobile || "N/A"}
                            </td>
                            <td style={{ textAlign: "center" }}>Aadhar</td>
                            <td style={{ textAlign: "center" }}>
                              {total?.toFixed(2)} INR
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <Trash2
                                size={16}
                                className="text-danger"
                                onClick={() => handleDelete(payment._id)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="p-3 bg-light rounded mt-3">
                    <p className="d-flex justify-content-between mb-1">
                      <span>Sub-Total :</span>{" "}
                      <span>{subTotal?.toFixed(2)} INR</span>
                    </p>
                    <p className="d-flex justify-content-between mb-1">
                      <span>Discount ({discountPercentage}%) :</span>{" "}
                      <span>- {discount?.toFixed(2)} INR</span>
                    </p>

                    <p className="d-flex justify-content-between mb-1">
                      <span>SGST ({sgstPercentage}%) :</span>{" "}
                      <span>{sgst?.toFixed(2)} INR</span>
                    </p>
                    <p className="d-flex justify-content-between mb-1">
                      <span>CGST ({cgstPercentage}%) :</span>{" "}
                      <span>{cgst?.toFixed(2)} INR</span>
                    </p>
                    <p className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total :</span> <span>{total?.toFixed(2)} INR</span>
                    </p>
                  </div>

                  <div className="mt-3">
                    {role == "2" && total > 0 && (
                      <div className="d-flex justify-content-end align-items-center gap-2">
                        <label htmlFor="paymentmethod" className="mb-0">
                          Payment Method:
                        </label>
                        <select
                          className="form-select w-auto"
                          id="paymentmethod"
                          value={paymentmethod}
                          onChange={(e) => setPaymentmethod(e.target.value)}
                          required
                        >
                          <option value="">Select Payment Method</option>
                          <option value="online">Online</option>
                          <option value="Wallet">
                            Wallet (Balance: ₹{walletBalance.toFixed(2)})
                          </option>
                        </select>
                      </div>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      {total === 0 ? (
                        <>
                          <div className="d-flex align-items-stretch gap-3 mt-3">
                            <div className="alert alert-light d-flex align-items-center flex-grow-1 border rounded shadow-sm mb-0 px-4 py-0">
                              <span
                                className="text-secondary py-3"
                                style={{ fontSize: "15px" }}
                              >
                                <strong>
                                  You're on our completely free plan
                                </strong>{" "}
                                — no payment is needed. Please continue to
                                complete the verification.
                              </span>
                            </div>
                            <button
                              className="btn btn-primary px-4"
                              style={{ height: "100%" }}
                              onClick={() =>
                                handlefree(total, paymentIdsString)
                              }
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {paymentmethod === "Wallet" && (
                            <>
                              {total > walletBalance ? (
                                <button
                                  className="btn btn-warning px-4"
                                  disabled={payments.length === 0}
                                >
                                  Add Balance to Wallet
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary px-4"
                                  disabled={payments.length === 0}
                                  onClick={() =>
                                    handlePaymentSuccess(
                                      null,
                                      total,
                                      paymentIdsString
                                    )
                                  }
                                >
                                  Pay with Wallet ({total?.toFixed(2)} INR)
                                </button>
                              )}
                            </>
                          )}

                          {paymentmethod === "online" && (
                            <RazorpayPayment
                              amount={total}
                              razorpayKey={razorpayKey}
                              onSuccess={handlePaymentSuccess}
                              paymentIds={paymentIdsString}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
              {renderotp && (
                <form onSubmit={handleOTPSubmit}>
                  <div className="alert alert-warning p-2 mb-3">
                    ⚠️ Do not refresh this page.
                  </div>

                  <div className="form-group">
                    <label htmlFor="otp" className="form-label">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      className="form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary mt-3">
                    Verify OTP
                  </button>

                  <button
                    type="button"
                    className={`btn mt-3 ms-2 ${
                      resendTimer > 0 ? "btn-secondary" : "btn-success"
                    }`}
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AadharOtp;
