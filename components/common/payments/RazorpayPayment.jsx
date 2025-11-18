import React, { useEffect, useState } from "react";
import axios from "axios";
const RazorpayPayment = ({ amount, razorpayKey, onSuccess, paymentIds }) => {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const pay = amount;
  let pids = "";
  if (paymentIds) {
    pids = paymentIds;
  } else {
    pids = "";
  }

  useEffect(() => {
    if (window.Razorpay) {
      setIsRazorpayLoaded(true);
      return;
    }

    // Dynamically load the Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      console.error("Razorpay SDK is not loaded yet!");
      return;
    }
    try {
      // Use axios to create the order on the backend
      // const response = await axios.post(`${apiurl}/api/payment/create-order`, { amount });
      const response = await axios.post(`${apiurl}/api/payment/create-order`, {
        amount: parseFloat(amount), // Ensure it's a number
      });
      const amountInPaise = Math.round(parseFloat(amount) * 100);

      const orderId = response.data.order.id;

      // console.log(orderId);
      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: "INR",
        name: "Quikchek",
        description: "Payment for Verification",
        order_id: orderId,
        handler: function (response) {
          // alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
          console.log(response);
          if (onSuccess) onSuccess(response, pay, pids);
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

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during order creation:", error);
    }
  };

  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={handlePayment}
      disabled={!isRazorpayLoaded}
    >
      {isRazorpayLoaded ? `Pay (${amount?.toFixed(2)} INR)` : "Loading..."}
    </button>
  );
};

export default RazorpayPayment;
