import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import CustomizedProgressBars from "@/components/common/loader";

import { Trash2 } from "lucide-react";

import Razorpay from "razorpay";
import RazorpayPayment from "@/components/common/payments/RazorpayPayment";

const PaymentDetails = ({ setActiveTab }) => {
  const [payments, setPayments] = useState([]);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessage_id] = useState(null);

  const [paymentmethod, setPaymentmethod] = useState("online");
  const role = localStorage.getItem("Role");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");

  /* Billing part */
  const [subTotal, setSubTotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [sgstPercentage, setSgstPercentage] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [cgstPercentage, setCgstPercentage] = useState(0);

  const [overall_billing, setOverallBilling] = useState({});

  //razor pay
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    fetchPayments();
  }, [token]);
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/candidate/usercart/list_candidate_cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPayments(response.data.data);
        setOverallBilling(response.data.overall_billing);
        setSubTotal(parseFloat(response.data.overall_billing.subtotal) || 0);
        setGst(parseFloat(response.data.overall_billing.gst) || 0);
        setTotal(parseFloat(response.data.overall_billing.total) || 0);
        setDiscount(parseFloat(response.data.overall_billing.discount) || 0);
        setDiscountPercentage(
          parseFloat(response.data.overall_billing.discount_percent) || 0
        );
        setSgst(parseFloat(response.data.overall_billing.sgst) || 0);
        setSgstPercentage(
          parseFloat(response.data.overall_billing.sgst_percent) || 0
        );
        setCgst(parseFloat(response.data.overall_billing.cgst) || 0);
        setCgstPercentage(
          parseFloat(response.data.overall_billing.cgst_percent) || 0
        );
      } else {
        setError("Failed to fetch data.");
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error("Error fetching data:", err); // Debugging
      setError("Error fetching data. Please try again.");
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
      const Dlt_response = await axios.post(
        `${apiurl}/api/candidate/usercart/delete_candidate_cart`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", Dlt_response.data);
      if (Dlt_response.data.success) {
        fetchPayments();

        setSuccess(Dlt_response.data.message);
        setMessage_id(Date.now());
      }
    } catch (err) {
      console.error("Error deleting payment:", err);
      setError("Error deleting payment. Please try again.");
      setErrorId(Date.now());
    }
    setLoading(false);
  };

  const handlePaymentSuccess = async (response, pay, pids) => {
    setLoading(true);

    try {
      const paymentResponse = await axios.post(
        `${apiurl}/api/candidate/usercart/paynow_candidate_cart`,
        {
          razorpay_response: response,
          amount: pay,
          paymentIds: pids,
          payment_method: paymentmethod,
          overall_billing: overall_billing,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /* if code 200 */
      if (paymentResponse.status === 200) {
        setSuccess(
          "Your payment has been successfully processed. An invoice will be sent to your registered email shortly."
        );
        setMessage_id(Date.now());
        setPayments([]);
        setLoading(false);
        /* 
        // Redirect to the download center after a 5-second delay
        setTimeout(() => {
          router.push("/download-center");
        }, 5000); */
      }
    } catch (err) {
      setError("Error processing payment. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      // setActiveTab("kyc");
    }
  };

  const paymentIdsString = payments.map((payment) => payment.id).join(", ");
  console.log("Payment IDs:", paymentIdsString);

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        errorId={errorId}
        message_id={message_id}
      />
      {loading ? (
        <div className="ls-widget">
          <div className="tabs-box">
            <div
              className="widget-content"
              style={{ padding: "25px 0", borderBottom: "1px solid #ddd" }}
            >
              <div className="container">
                <CustomizedProgressBars />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="ls-widget">
            <div className="tabs-box">
              <div
                className="widget-content"
                style={{ padding: "25px 0", borderBottom: "1px solid #ddd" }}
              >
                <div className="container">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        {/*  <th style={{ textAlign: "center" }}>Name</th>
                        <th style={{ textAlign: "center" }}>Mobile Number</th> */}
                        <th style={{ textAlign: "center" }}>Pay For</th>
                        <th style={{ textAlign: "center" }}>Amount</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length > 0 ? (
                        payments.map((payment, index) => (
                          <tr key={payment.id}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            {/* <td style={{ textAlign: "center" }}>
                              {payment.name}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {payment.mobile || "N/A"}
                            </td> */}
                            <td style={{ textAlign: "center" }}>
                              {payment.payFor || "N/A"}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {payment.amount} INR
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <Trash2
                                size={16}
                                className="text-danger"
                                onClick={() => handleDelete(payment.id)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            Your cart is empty.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {payments.length > 0 ? (
                    <>
                      <div className="p-3 bg-light rounded">
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
                          <span>Total :</span>{" "}
                          <span>{total?.toFixed(2)} INR</span>
                        </p>
                      </div>

                      <div className="mt-3">
                        <div className="d-flex justify-content-end gap-2 mt-3">
                          <>
                            <RazorpayPayment
                              amount={total}
                              razorpayKey={razorpayKey}
                              onSuccess={handlePaymentSuccess}
                              paymentIds={paymentIdsString}
                            />
                          </>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentDetails;
