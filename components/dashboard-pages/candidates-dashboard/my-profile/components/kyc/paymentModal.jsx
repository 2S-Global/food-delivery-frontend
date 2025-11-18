import React, { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import RazorpayPayment from "@/components/common/payments/RazorpayPayment";

const PaymentModal = ({
  show,
  onClose,
  setError,
  setSuccess,
  setMessageId,
  setErrorId,
  setReload,
  focusSection,
  data,
}) => {
  return (
    <>
      <div
        className="modal fade show d-block modal-xs "
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Payment</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <>
                <RazorpayPayment
                  amount={25}
                  /*  razorpayKey={razorpayKey}
                  onSuccess={handlePaymentSuccess}
                  paymentIds={paymentIdsString} */
                />
              </>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
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

export default PaymentModal;
