"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

import { Trash2, Pencil } from "lucide-react";
import { useSearchParams } from "next/navigation";

import EditfieldModal from "./modals/editfield";

const Companytable = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldinfo, setfieldinfo] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalRH = (companydetails) => {
    setfieldinfo(companydetails);
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

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiurl}/api/fields/list_fields`,
          { company_id: id },
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

  const handleDelete = async (fid) => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/fields/delete_fields`,
        { fieldId: fid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCompanies((prev) => prev.filter((company) => company._id !== fid));
        setSuccess(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error deleting company. Please try again.");
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
                    <th style={{ textAlign: "center" }}>Type</th>
                    <th style={{ textAlign: "center" }}>Values</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    companies.map((company, index) => (
                      <tr key={company._id}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td style={{ textAlign: "center" }}>{company.name}</td>
                        <td style={{ textAlign: "center" }}>
                          {company.field_type}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {company.field_values}
                        </td>

                        <td className="text-center">
                          <Pencil
                            className="text-primary me-2 cursor-pointer"
                            onClick={() => openModalRH(company)}
                            size={20}
                          />
                          <Trash2
                            className="text-danger  me-2 cursor-pointer"
                            size={20}
                            onClick={() => handleDelete(company._id)}
                          />
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
          field={fieldinfo}
        />
      )}
    </>
  );
};

export default Companytable;
