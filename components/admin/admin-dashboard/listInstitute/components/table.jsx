"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

import {
  Trash2,
  Settings,
  Pencil,
  PackageOpen,
  Send,
  FilePen,
  Mailbox,
  ShoppingCart,
} from "lucide-react";
import EditfieldModal from "./modals/editfield";
import EditplanModal from "./modals/planmodal";
import VerifiedlistModal from "./modals/verifiedlistModal";
const Companytable = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editcompany, setEditcompany] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalplanOpen, setIsModalplanOpen] = useState(false);
  const [isModalvlOpen, setIsModalvlOpen] = useState(false);
  /*  const  */
  const [message_id, setMessage_id] = useState(null);
  const [errorId, setErrorId] = useState(null);

  const [emailloading, setEmailloading] = useState(false);
  const openModalRH = (companydetails) => {
    setEditcompany(companydetails);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };
  const openModalPlanRH = (companydetails) => {
    setEditcompany(companydetails);
    setIsModalplanOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
    console.log("open modal plan");
  };
  const openModalVL = (companydetails) => {
    setEditcompany(companydetails);
    setIsModalvlOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
    console.log("open modal verified list");
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
  const handlecart = (company) => {
    router.push(`/admin/cart?id=${company._id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiurl}/api/companyRoutes/list-companies`,
          { role: 3 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCompanies(response.data.data);
          setSuccess(response.data.message);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Error fetching companies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [apiurl]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/delete-companies`,
        { companyId: id, role: 3 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCompanies((prev) => prev.filter((company) => company._id !== id));
        setSuccess(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error deleting company. Please try again.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("Super_token");

    console.log("Token:", token);
    console.log("ID:", id);
    console.log("Current Status:", currentStatus);

    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/togglestatus-companies`,
        {
          companyId: id,
          status: !currentStatus,
          role: 3,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCompanies((prev) =>
          prev.map((comp) =>
            comp._id === id ? { ...comp, is_active: !currentStatus } : comp
          )
        );
        setSuccess(response.data.message);
      } else {
        setError("Failed to toggle status.");
      }
    } catch (error) {
      setError("Something went wrong while toggling status.");
    }
  };

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
          <div className="row">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ textAlign: "center" }}>S/N</th>
                    <th style={{ textAlign: "center" }}>Institute Name</th>
                    <th style={{ textAlign: "center" }}>Institute Email</th>
                    <th style={{ textAlign: "center" }}>Institute Status</th>
                    {/*   <th style={{ textAlign: "center" }}>Total Verification</th> */}
                    <th style={{ textAlign: "center" }}>Created Date</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    companies.map((company, index) => (
                      <tr key={company._id}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td style={{ textAlign: "center" }}>{company.name}</td>
                        <td style={{ textAlign: "center" }}>{company.email}</td>
                        <td style={{ textAlign: "center" }}>
                          <div className="form-check form-switch d-flex justify-content-center align-items-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id={`switch-${company._id}`}
                              checked={company.is_active}
                              onChange={() =>
                                toggleStatus(company._id, company.is_active)
                              }
                            />
                            <label
                              className={`form-check-label ms-2 fw-semibold ${
                                company.is_active
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                              htmlFor={`switch-${company._id}`}
                            >
                              {company.is_active ? "Active" : "Inactive"}
                            </label>
                          </div>
                        </td>
                        {/*   <td
                          style={{
                            textAlign: "center",
                            cursor:
                              company.orderCount > 0 ? "pointer" : "default",
                            transition: "background-color 0.3s ease",
                          }}
                          onClick={() =>
                            company.orderCount > 0 && openModalVL(company)
                          }
                          onMouseEnter={(e) => {
                            if (company.orderCount > 0) {
                              e.target.style.backgroundColor = "#c6f79a"; // Light gray on hover
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = ""; // Reset to default
                          }}
                        >
                          {company.orderCount > 0 ? company.orderCount : 0}
                        </td> */}
                        <td style={{ textAlign: "center" }}>
                          {new Date(company.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",

                            hour12: true,
                            timeZone: "Asia/Kolkata",
                          })}
                        </td>

                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-3">
                            <span title="Edit">
                              <Pencil
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() => openModalRH(company)}
                                size={20}
                              />
                            </span>
                            {/*  <span title="Plan">
                              <PackageOpen
                                className="text-info"
                                style={{ cursor: "pointer" }}
                                onClick={() => openModalPlanRH(company)}
                                size={20}
                              />
                            </span> */}

                            <span title="Delete">
                              <Trash2
                                size={20}
                                className="text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  const confirmDelete = window.confirm(
                                    "Are you sure you want to delete this Institute?"
                                  );
                                  if (confirmDelete) {
                                    handleDelete(company._id);
                                  }
                                }}
                              />
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <EditfieldModal
          show={isModalOpen}
          onClose={closeModalRH}
          field={editcompany}
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

export default Companytable;
