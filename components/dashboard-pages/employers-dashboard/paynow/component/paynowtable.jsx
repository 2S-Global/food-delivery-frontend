import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import CardPaymentForm from "./modal/cardform";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

import { Trash2 } from "lucide-react";

import Razorpay from "razorpay";
import RazorpayPayment from "@/components/common/payments/RazorpayPayment";

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState(null);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const router = useRouter();
  useEffect(() => {
    const storedToken = localStorage.getItem("Admin_token");
    console.log("Fetched token:", storedToken); // Debugging
    setToken(storedToken);
  }, []);

  const openModalRH = () => {
    console.log("Opening Modal..."); // Debugging
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModalRH = () => {
    console.log("Closing Modal..."); // Debugging
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (!token) return;

    const fetchPayments = async () => {
      try {
        console.log("Fetching payments..."); // Debugging
        const response = await axios.get(
          `${apiurl}/api/usercart/list_user_cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          setPayments(response.data.data);
          setSubTotal(parseFloat(response.data.overall_billing.subtotal) || 0);
          setGst(parseFloat(response.data.overall_billing.gst) || 0);
          setTotal(parseFloat(response.data.overall_billing.total) || 0);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err); // Debugging
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]); // Runs when `token` changes

  const handleDelete = async (id) => {
    if (!token) return;

    console.log("Deleting payment with ID:", id);
    try {
      const Dlt_response = await axios.post(
        `${apiurl}/api/usercart/deleteUser`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Delete response:", Dlt_response.data);
      if (Dlt_response.data.updatedCart?.success) {
        console.log("Payment deleted successfully.");
        setPayments(Dlt_response.data.updatedCart.data);
        setSubTotal(
          parseFloat(Dlt_response.data.updatedCart.overall_billing.subtotal) ||
            0,
        );
        setGst(
          parseFloat(Dlt_response.data.updatedCart.overall_billing.gst) || 0,
        );
        setTotal(
          parseFloat(Dlt_response.data.updatedCart.overall_billing.total) || 0,
        );

        console.log("Updated totals:", {
          subTotal: Dlt_response.data.updatedCart.overall_billing.subtotal,
          gst: Dlt_response.data.updatedCart.overall_billing.gst,
          total: Dlt_response.data.updatedCart.overall_billing.total,
        });

        setSuccess(Dlt_response.data.message);
      }
    } catch (err) {
      console.error("Error deleting payment:", err);
      setError("Error deleting payment. Please try again.");
    }
  };

  const handlePaymentSuccess = async (response, pay, pids) => {
    console.log("Payment successful!", response, "payment ", pay);
    console.log("Payment IDs:", pids);
    alert("Payment successful! Payment ID: " + response.razorpay_payment_id);

    // API call success
    const paymentData = {
      razorpay_response: response,
      amount: pay,
      paymentIds: pids,
    };

    try {
      const paymentResponse = await axios.post(
        `${apiurl}/api/verify/paynow`,
        {
          razorpay_response: response,
          amount: pay,
          paymentIds: pids,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Payment response:", paymentResponse.data);
      /* if code 200 */
      if (paymentResponse.status === 200) {
        setSuccess(paymentResponse.data.message);
        router.push("/employers-dashboard/download-center");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Error processing payment. Please try again.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  const paymentIdsString = payments.map((payment) => payment.id).join(", ");
  console.log("Payment IDs:", paymentIdsString);

  return (
    <>
      <MessageComponent error={error} success={success} />
      <div className="container">
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
            {payments.map((payment, index) => (
              <tr key={payment.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}>{payment.name}</td>
                <td style={{ textAlign: "center" }}>
                  {payment.mobile || "N/A"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {payment.payFor || "N/A"}
                </td>
                <td style={{ textAlign: "center" }}>{payment.amount} INR</td>
                <td style={{ textAlign: "center" }}>
                  <Trash2
                    size={16}
                    className="text-danger"
                    onClick={() => handleDelete(payment.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 bg-light rounded">
          <p className="d-flex justify-content-between mb-1">
            <span>Sub-Total :</span> <span>{subTotal?.toFixed(2)} INR</span>
          </p>
          <p className="d-flex justify-content-between mb-1">
            <span>GST (18%) :</span> <span>{gst?.toFixed(2)} INR</span>
          </p>
          <p className="d-flex justify-content-between fw-bold fs-5">
            <span>Total :</span> <span>{total?.toFixed(2)} INR</span>
          </p>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <RazorpayPayment
            amount={total}
            razorpayKey={razorpayKey}
            onSuccess={handlePaymentSuccess}
            paymentIds={paymentIdsString}
          />
        </div>
      </div>

      {isModalOpen && (
        <CardPaymentForm
          show={isModalOpen}
          onClose={closeModalRH}
          mainamount={total}
        />
      )}
    </>
  );
};

export default PaymentDetails;
