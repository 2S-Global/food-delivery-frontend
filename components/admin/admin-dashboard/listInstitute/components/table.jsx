"use client";
import React, { useMemo, useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import DataTable from "react-data-table-component";
import { Trash2, Pencil, Eye, FileDown } from "lucide-react";
import OrderDetailsModal from "./modals/orderDetails";
// import EditfieldModal from "./modals/editfield";
// import EditplanModal from "./modals/planmodal";
// import VerifiedlistModal from "./modals/verifiedlistModal";
// import CandidateformModal from "./modals/formmodal";
import CircularProgress from "@mui/material/CircularProgress";
import { se } from "date-fns/locale/se";
import { set } from "date-fns/set";

const Ordertable = ({ setRefresh, refresh }) => {
    const apiurl = process.env.NEXT_PUBLIC_API_URL;

    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [downloadingid, setDownloadingid] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [deliveryPartner, setDeliveryPartner] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [editcompany, setEditcompany] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalplanOpen, setIsModalplanOpen] = useState(false);
    const [isModalvlOpen, setIsModalvlOpen] = useState(false);
    const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
    const [allOrderDetails, setAllOrderDetails] = useState(false);
    /*  const  */
    const [message_id, setMessage_id] = useState(null);
    const [errorId, setErrorId] = useState(null);

    const openModalRH = (companydetails) => {
        setEditcompany(companydetails);
        setIsModalOpen(true);
        document.body.style.overflow = "hidden"; // Disable background scrolling
    };

    const closeModalVL = () => {
        setIsModalvlOpen(false);
        document.body.style.overflow = "auto"; // Re-enable background scrolling
        console.log("close modal verified list");
    };

    const closeModalRH = () => {
        setIsModalOpen(false);
        document.body.style.overflow = "auto"; // Re-enable background scrolling
    };

    const closeModalPlanRH = () => {
        setIsModalplanOpen(false);
        document.body.style.overflow = "auto"; // Re-enable background scrolling
        console.log("close modal plan");
    };

    const openOrderDetailsModal = (order) => {
        // setPreviewImages(menu.images || []);
        // setAllMenuDetails(menu);
        // setModalName(name);
        // setModalDesc(description);
        setAllOrderDetails(order);
        setIsOrderDetailsModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeOrderDetailsModal = (order) => {
        // setPreviewImages(menu.images || []);
        // setAllMenuDetails(menu);
        // setModalName(name);
        // setModalDesc(description);
        setIsOrderDetailsModalOpen(false);
        document.body.style.overflow = "auto";
    };

    useEffect(() => {
        fetchCustomers();
    }, [apiurl]);

    useEffect(() => {
        if (refresh) {
            fetchCompanies();
            setRefresh(false);
        }
    }, [refresh]);

    const fetchCustomers = async () => {
        const token = localStorage.getItem("Super_token");
        if (!token) {
            setError("Token not found. Please log in again.");
            setErrorId(Date.now());
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `${apiurl}/api/order/list-all-order`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // setCompanies(response.data.data);
                // setCustomers(response.data.data);
                setOrders(response.data.data);
                // setSuccess(response.data.message);
                setMessage_id(Date.now());
            } else {
                setError(response.data.message);
                setErrorId(Date.now());
            }
        } catch (err) {
            setError("Error fetching companies. Please try again.");
            setErrorId(Date.now());
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {

        console.log("Now handle delete is executing and here is my main id : ", id);
        const token = localStorage.getItem("Super_token");
        if (!token) {
            setError("Token not found. Please log in again.");
            setErrorId(Date.now());
            return;
        }

        try {
            const response = await axios.post(
                `${apiurl}/api/order/delete-order?_id=${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // setCompanies((prev) => prev.filter((company) => company._id !== id));
                setOrders((prev) => prev.filter((customer) => customer._id !== id));
                // setRefresh(true);
                setSuccess(response.data.message);
                // setMessage_id(Date.now());
            } else {
                setError(response.data.message);
                setErrorId(Date.now());
            }
        } catch (err) {
            setError("Error deleting company. Please try again.");
            setErrorId(Date.now());
        }
    };

    const [searchText, setSearchText] = useState("");

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const search = searchText.toLowerCase();
            return (
                order.orderId?.toLowerCase().includes(search) ||
                order.customer?.toLowerCase().includes(search) ||
                (order.is_active ? "active" : "inactive").includes(search)
            );
        });
    }, [orders, searchText]);


    const columns = [
        {
            name: (
                <div style={{ width: "100%", textAlign: "center" }}>
                    S/N
                </div>
            ),
            width: "55px",
            cell: (row, index) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                    {index + 1}
                </div>
            ),
            sortable: false,
        },
        {
            name: (
                <div style={{ width: "100%", textAlign: "center" }}>
                    Order ID
                </div>
            ),
            selector: (row) => row.orderId,
            sortable: true,
            width: "",
            cell: (row) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                    {row.orderId}
                </div>
            )
        },
        {
            name: (
                <div style={{ width: "100%", textAlign: "center" }}>
                    Customer
                </div>
            ),
            selector: (row) => row.customer,
            sortable: true,
            width: "",
            cell: (row) => (
                <div
                    title={row.customer} // ✅ native tooltip on hover
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "140px",
                        textAlign: "center",
                    }}
                >
                    {row.customer}
                </div>
            ),
        },
        {
            name: (
                <div style={{ width: "100%", textAlign: "center" }}>
                    Total Amount
                </div>
            ),
            selector: (row) => row.total,
            sortable: true,
            width: "",
            cell: (row) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                    {row.total}
                </div>
            )
        },
        {
            name: (
                <div style={{ width: "100%", textAlign: "center" }}>
                    Created Date
                </div>
            ),
            selector: (row) => row.date,
            sortable: true,
            width: "150px",
            cell: (row) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                    {row.date}
                </div>
            )
        },
        {
            name: (
                <div style={{ width: "100%", textAlign: "center" }}>
                    Status
                </div>
            ),
            selector: (row) => row.status,
            sortable: true,
            width: "150px",
            cell: (row) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                    {row.status}
                </div>
            )
        },
        {
            name: (
                <div style={{ width: "100%", textAlign: "center" }}>
                    Action
                </div>
            ),
            style: { textAlign: "center" },
            cell: (row) => (
                <div className="text-center" style={{ width: "100%", textAlign: "center" }}>
                    <div className="d-flex justify-content-center gap-3">
                        <span title="View Details">
                            <Eye
                                color="green"
                                style={{ cursor: "pointer" }}
                                onClick={() => openOrderDetailsModal(row ?? [])}
                                size={20}
                            />
                        </span>

                        <span title="Delete">
                            <Trash2
                                size={20}
                                className="text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    const confirmDelete = window.confirm(
                                        "Are you sure you want to delete this Order?"
                                    );
                                    if (confirmDelete) {
                                        handleDelete(row._id);
                                    }
                                }}
                            />
                        </span>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <>
            <MessageComponent
                error={error}
                success={success}
                message_id={message_id}
                errorId={errorId}
            />
            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="widget-content">
                    <div className="table-wrapper">
                        <DataTable
                            columns={columns}
                            data={filteredOrders}
                            pagination
                            highlightOnHover
                            dense
                            fixedHeader
                            subHeader
                            subHeaderComponent={
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="form-control w-25"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)} // ✅ Live filtering
                                />
                            }
                            customStyles={{
                                table: {
                                    style: {
                                        borderRadius: "5px",
                                        overflow: "hidden",
                                        border: "1px solid #e5e5e5",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    },
                                },
                                rows: {
                                    style: {
                                        minHeight: "58px",
                                        borderBottom: "1px solid #f3f3f3",
                                        transition: "background-color 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: "#f9fafb",
                                        },
                                    },
                                },
                                head: {
                                    style: {
                                        borderBottom: "2px solid #e5e5e5",
                                    },
                                },
                                headCells: {
                                    style: {
                                        backgroundColor: "#f8f9fa",
                                        fontWeight: "700",
                                        fontSize: "10px",
                                        color: "#343a40",
                                        paddingTop: "14px",
                                        paddingBottom: "14px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.3px",
                                        borderBottom: "1px solid #dee2e6",
                                        borderRight: "1px solid #e0e0e0",
                                    },
                                },
                                cells: {
                                    style: {
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                        fontSize: "10px",
                                        color: "#212529",
                                        lineHeight: "1.5",
                                        borderRight: "1px solid #e0e0e0",
                                    },
                                },
                                pagination: {
                                    style: {
                                        borderTop: "1px solid #dee2e6",
                                        padding: "10px 20px",
                                    },
                                    pageButtonsStyle: {
                                        borderRadius: "5px",
                                        height: "35px",
                                        width: "35px",
                                        padding: "6px",
                                        margin: "2px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover:not(:disabled)": {
                                            backgroundColor: "#46b171",
                                            color: "#fff",
                                        },
                                        "&:focus": {
                                            outline: "none",
                                            backgroundColor: "#46b171",
                                            color: "#fff",
                                        },
                                    },
                                },
                                subHeader: {
                                    style: {
                                        backgroundColor: "#ffffff",
                                        borderBottom: "1px solid #f1f1f1",
                                        padding: "10px 15px",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            )}

            {isOrderDetailsModalOpen && (
                <OrderDetailsModal
                    show={isOrderDetailsModalOpen}
                    onClose={closeOrderDetailsModal}
                    order={allOrderDetails}
                    // images={previewImages}
                    // allMenuDetails={allMenuDetails}
                />
            )}

            {isModalOpen && (
                /*   <EditfieldModal
                  show={isModalOpen}
                  onClose={closeModalRH}
                  field={editcompany}
                  refresh={refresh}
                  setRefresh={setRefresh}
                /> */
                <CandidateformModal
                    show={isModalOpen}
                    onClose={closeModalRH}
                    field={editcompany}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    data={editcompany}
                />
            )}

            {isModalplanOpen && (
                <EditplanModal
                    show={isModalplanOpen}
                    onClose={closeModalPlanRH}
                    field={editcompany}
                />
            )}

            {isModalvlOpen && (
                <VerifiedlistModal
                    show={isModalvlOpen}
                    onClose={closeModalVL}
                    company={editcompany}
                />
            )}
        </>
    );
};

export default Ordertable;
