"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

import { Trash2, Settings, Pencil } from "lucide-react";
import EditfieldModal from "./modals/editfield";
const Companytable = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editcompany, setEditcompany] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalRH = (companydetails) => {
    setEditcompany(companydetails);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  useEffect(() => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiurl}/api/auth/list-customers`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCustomers(response.data.data);
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

    fetchCustomers();
  }, [apiurl]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/userdata/delete-customer`,
        { customerId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCustomers((prev) => prev.filter((customer) => customer._id !== id));
        setSuccess(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error deleting company. Please try again.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {

    console.log("Here is my Customer ID: ", id);
    console.log("Here is my Current Status: ", currentStatus);

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
        `${apiurl}/api/userdata/toggle-status`,
        {
          user_id: id,
          status: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCustomers((prev) =>
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
      <MessageComponent error={error} success={success} />
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
                    <th style={{ textAlign: "center" }}>Name</th>
                    <th style={{ textAlign: "center" }}>Email</th>
                    <th style={{ textAlign: "center" }}>Phone Number</th>
                    <th style={{ textAlign: "center" }}>Created Date</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer, index) => (
                      <tr key={customer._id}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td style={{ textAlign: "center" }}>{customer.name}</td>
                        <td style={{ textAlign: "center" }}>
                          {customer.email}
                        </td>
                        <td style={{ textAlign: "center" }}>{customer.phone_number}</td>
                        <td style={{ textAlign: "center" }}>{customer.createdAt}</td>
                        <td style={{ textAlign: "center" }}>
                          <div className="form-check form-switch d-flex justify-content-center align-items-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id={`switch-${customer._id}`}
                              checked={customer.is_active}
                              onChange={() =>
                                toggleStatus(customer._id, customer.is_active)
                              }
                            />
                            <label
                              className={`form-check-label ms-2 fw-semibold ${customer.is_active
                                  ? "text-success"
                                  : "text-danger"
                                }`}
                              htmlFor={`switch-${customer._id}`}
                            >
                              {customer.is_active ? "Active" : "Inactive"}
                            </label>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-3">
                            {/* <Pencil
                              className="text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => openModalRH(company)}
                              size={20}
                            /> */}
                            {/* <Settings
                              className="text-secondary"
                              style={{ cursor: "pointer" }}
                              size={20}
                              onClick={() =>
                                router.push(
                                  `/admin/company-setting?id=${company._id}`
                                )
                              }
                            /> */}
                            <Trash2
                              size={20}
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                const confirmDelete = window.confirm(
                                  "Are you sure you want to delete this candidate?"
                                );
                                if (confirmDelete) handleDelete(customer._id);
                              }}
                            />
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
    </>
  );
};

export default Companytable;
