// components/common/payments/RazorpayPayment.jsx

import React from "react";

const RazorpayPayment = ({ amount, razorpayKey, onSuccess }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Try again.");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: amount * 100, // Convert INR to paise
      currency: "INR",
      name: "E2 Score",
      description: "Payment for Verification",
      handler: function (response) {
        onSuccess(response, Number(amount), response.razorpay_payment_id);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <button
      type="button"
      className="btn btn-primary w-100"
      onClick={handlePayment}
    >
      Confirm Payment
    </button>
  );
};

export default RazorpayPayment;
