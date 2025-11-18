import React, { useEffect, useState } from "react";
import RazorpayPayment from "@/components/common/payments/RazorpayPayment2";
import MessageComponent from "@/components/common/ResponseMsg";
import axios from "axios";
import { useRouter } from "next/navigation";

const WalletBalance = ({ showTable, setShowTable }) => {
  const [balance, setBalance] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const router = useRouter();

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const token = localStorage.getItem("Admin_token");
      try {
        const { data } = await axios.post(
          `${apiurl}/api/wallet/walletBalance`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(data?.data?.wallet_amount || 0);
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
        setError("Failed to load wallet balance.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  const handlePaymentSubmit = async (
    razorpayResponse,
    payAmount,
    paymentIds
  ) => {
    const token = localStorage.getItem("Admin_token");
    try {
      const { data } = await axios.post(
        `${apiurl}/api/wallet/addTransaction`,
        {
          razorpay_response: razorpayResponse,
          amount: payAmount,
          paymentIds: paymentIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success) {
        setSuccess(data.message);
        setBalance(data.updated_wallet);
        setPaymentAmount("");
        setShowPaymentForm(false);
      } else {
        setError(data.message || "Payment failed.");
      }
    } catch (err) {
      setError("Error processing payment. Please try again.");
    }
  };

  return (
    <div className="mt-4">
      {loading ? (
        <p>Loading wallet...</p>
      ) : (
        <>
          {/* Notification Messages */}
          {error && <MessageComponent type="error" message={error} />}
          {success && <MessageComponent type="success" message={success} />}

          {/* Wallet Info */}
          <section className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1 small">Current Balance</p>
                <h2 className="mb-0">₹{balance.toFixed(2)}</h2>
              </div>
              <button
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                className={`btn ${showPaymentForm ? "btn-danger" : "btn-success"} btn-sm`}
              >
                {showPaymentForm ? "Cancel" : "Add Balance"}
                {!showPaymentForm && <i className="bi bi-arrow-right ms-2"></i>}
              </button>
            </div>

            <div className="mt-3 text-end">
              <button
                onClick={() => setShowTable && setShowTable(!showTable)}
                className={`btn ${showTable ? "btn-danger" : "btn-primary"} btn-sm`}
              >
                {showTable ? "Hide" : "Transaction History"}
                {!showTable && <i className="bi bi-arrow-right ms-2"></i>}
              </button>
            </div>
          </section>

          {/* Payment Form */}
          {showPaymentForm && (
            <section>
              <h5 className="mb-3">Make a Payment</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="paymentAmount" className="form-label">
                    Payment Amount
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      id="paymentAmount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Razorpay Integration */}
                <RazorpayPayment
                  amount={parseFloat(paymentAmount) || 0}
                  razorpayKey={razorpayKey}
                  onSuccess={handlePaymentSubmit}
                />
              </form>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default WalletBalance;
