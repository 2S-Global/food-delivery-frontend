"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageComponent from "@/components/common/ResponseMsg";

const OrderDetailsModal = ({
    show,
    onClose,
    order = {},
    items = [], // order items from orderDetails collection
}) => {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [message_id, setMessage_id] = useState(null);
    const [error, setError] = useState(null);
    const [errorId, setErrorId] = useState(null);
    const [orderItems, setOrderItems] = useState(null);

    // console.log("Here I'm getting my all Orders : ", order);
    if (!show || !order) return null;

    const {
        _id,
        orderId,
        date,
        status,
        total,
        shipping_amount,
        tax,
        grand_total,
        is_del,
        customer,
        customerPhone,
        customerEmail,
        customerAddress,
        paymentMethod,
        notes,
    } = order;

    // console.log("So here I am accessing global _id: ", _id);

    // API URL
    const apiurl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (show && _id) {
            fetchOrderItems(_id);
        }
    }, [show, orderId]);

    const fetchOrderItems = async (_id) => {
        const token = localStorage.getItem("Super_token");
        if (!token) {
            setError("Token not found. Please log in again.");
            setErrorId(Date.now());
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `${apiurl}/api/order/list-order-items?order_id=${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // console.log("Here is my all List Order data: ", response.data);

            if (response.data.success) {
                setOrderItems(response.data.data);
                setSuccess(response.data.message);
                setMessage_id(Date.now());
            } else {
                setError(response.data.message);
                setErrorId(Date.now());
            }
        } catch (err) {
            setError("Error fetching ordered items. Please try again.");
            setErrorId(Date.now());
        } finally {
            setLoading(false);
        }
    };

    // Helper to format date safely
    const formatDate = (date) => {
        if (!date) return "-";
        try {
            return new Date(date).toLocaleString();
        } catch {
            return date;
        }
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <MessageComponent
                error={error}
                success={success}
                message_id={message_id}
                errorId={errorId}
            />
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content" style={{ overflow: "hidden" }}>
                    {/* HEADER */}
                    <div className="modal-header border-0 p-2">
                        <h5 className="mb-0" style={{ fontSize: "18px", fontWeight: 600 }}>
                            Order Details
                        </h5>
                        <button
                            type="button"
                            className="btn-close ms-auto"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body pt-0 pb-3 px-3">
                        {loading ? (
                            // LOADING SPINNER
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column flex-md-row">
                                {/* LEFT – simple summary block (you can customize or remove) */}
                                <div
                                    className="d-flex flex-column align-items-center justify-content-center bg-light mb-3 mb-md-0"
                                    style={{
                                        flex: 1,
                                        padding: "16px",
                                        minHeight: "260px",
                                    }}
                                >
                                    <div style={{ textAlign: "center" }}>
                                        <h6 className="mb-2" style={{ fontSize: "16px", fontWeight: 600 }}>
                                            Order #{orderId || "-"}
                                        </h6>
                                        <p className="mb-1" style={{ fontSize: "13px" }}>
                                            <strong>Status: </strong>
                                            <span style={{ textTransform: "capitalize" }}>
                                                {status || "-"}
                                            </span>
                                        </p>
                                        <p className="mb-1" style={{ fontSize: "13px" }}>
                                            <strong>Order Date: </strong>
                                            {formatDate(date)}
                                        </p>
                                        {is_del !== undefined && (
                                            <p className="mb-0" style={{ fontSize: "13px" }}>
                                                <strong>Deleted: </strong>
                                                {isDel ? "Yes" : "No"}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT – detailed info */}
                                <div
                                    className="d-flex flex-column"
                                    style={{
                                        flex: 2,
                                        padding: "16px 20px",
                                        maxHeight: "420px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {/* CUSTOMER DETAILS */}
                                    <h6 className="fw-bold mb-1" style={{ fontSize: "14px" }}>
                                        Customer Details
                                    </h6>
                                    <div
                                        className="mb-3"
                                        style={{ fontSize: "13px", lineHeight: 1.5 }}
                                    >
                                        <div>
                                            <strong>Name: </strong>
                                            {customer || "-"}
                                        </div>
                                        <div>
                                            <strong>Phone: </strong>
                                            {customerPhone || "-"}
                                        </div>
                                        {customerEmail && (
                                            <div>
                                                <strong>Email: </strong>
                                                {customerEmail}
                                            </div>
                                        )}
                                        {customerAddress && (
                                            <div>
                                                <strong>Address: </strong>
                                                {customerAddress}
                                            </div>
                                        )}
                                    </div>

                                    {/* ITEMS TABLE */}
                                    {orderItems && orderItems.length > 0 && (
                                        <>
                                            <h6 className="fw-bold mb-2" style={{ fontSize: "14px" }}>
                                                Items
                                            </h6>
                                            <div className="table-responsive mb-3">
                                                <table className="table table-sm mb-0">
                                                    <thead>
                                                        <tr style={{ fontSize: "13px" }}>
                                                            <th>Item</th>
                                                            <th>Qty</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderItems.map((item, index) => (
                                                            <tr key={index} style={{ fontSize: "13px" }}>
                                                                <td>{item.item_details || item.menuName || "-"}</td>
                                                                <td>{item.item_quantity || item.qty || 0}</td>
                                                                <td>{item.item_price ?? "-"}</td>
                                                                <td>{item.total_amount ?? "-"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}

                                    {/* PAYMENT SUMMARY */}
                                    <h6 className="fw-bold mb-2" style={{ fontSize: "14px" }}>
                                        Payment Summary
                                    </h6>
                                    <div
                                        className="mb-3"
                                        style={{ fontSize: "13px", lineHeight: 1.5 }}
                                    >
                                        <div>
                                            <strong>Subtotal: </strong>
                                            {total ?? "-"}
                                        </div>
                                        <div>
                                            <strong>Shipping: </strong>
                                            {shipping_amount ?? "-"}
                                        </div>
                                        <div>
                                            <strong>Tax: </strong>
                                            {tax ?? "-"}
                                        </div>
                                        <div>
                                            <strong>Grand Total: </strong>
                                            {grand_total ?? "-"}
                                        </div>
                                        {paymentMethod && (
                                            <div>
                                                <strong>Payment Method: </strong>
                                                {paymentMethod}
                                            </div>
                                        )}
                                    </div>

                                    {/* NOTES */}
                                    {notes && (
                                        <div className="mt-1">
                                            <h6 className="fw-bold mb-1" style={{ fontSize: "14px" }}>
                                                Notes
                                            </h6>
                                            <p style={{ fontSize: "13px", marginBottom: 0 }}>{notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer border-0 pt-0 pb-3 px-3">
                        <button
                            type="button"
                            className="btn btn-secondary ms-auto"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;