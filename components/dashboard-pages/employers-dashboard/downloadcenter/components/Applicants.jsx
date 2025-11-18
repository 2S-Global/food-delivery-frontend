"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Eye,
  Loader,
  MinusCircle,
  Clock2,
  Download,
} from "lucide-react";
import Link from "next/link";

const Applicants = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("Admin_token");
        if (!token) {
          console.error("Error: No token found in localStorage");
          setError("Unauthorized: No token found");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${API_URL}/api/usercart/getPaidUserVerificationCartByEmployer`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCandidates(response.data);
      } catch (error) {
        console.error(
          "Error fetching candidates:",
          error.response?.data || error
        );
        setError(error.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [API_URL]);

  const handleDownload = async (fileUrl) => {
    if (!fileUrl) {
      alert("No file available for download");
      return;
    }
  };

  const renderProcessingIcon = (docNumber, docName, response) => {
    if (docNumber || docName) {
      if (response) {
        switch (response.response_code) {
          case "100":
            return (
              <span title="Valid Authentication">
                <CheckCircle size={14} className="text-success" />
              </span>
            );
          case "101":
            return (
              <span title="Invalid Authentication">
                <XCircle size={14} className="text-danger" />
              </span>
            );
          default:
            return (
              <span title="Not Applied">
                <MinusCircle size={14} className="text-warning" />
              </span>
            );
        }
      }
      return (
        <span title="Processing">
          <Clock2 size={14} className="text-info" />
        </span>
      );
    }

    return (
      <span title="Not Applied">
        <MinusCircle size={14} className="text-muted" />
      </span>
    );
  };

  // DataTable columns configuration
  const columns = [
    {
      name: "Candidate Name",
      selector: (row) => row.candidate_name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.candidate_mobile,
      sortable: true,
    },
    {
      name: "PAN Status",
      selector: (row) =>
        renderProcessingIcon(row.pan_number, row.pan_name, row.pan_response),
      cell: (row) =>
        renderProcessingIcon(row.pan_number, row.pan_name, row.pan_response),
    },
    {
      name: "Passport Status",
      selector: (row) =>
        renderProcessingIcon(
          row.passport_file_number,
          row.passport_name,
          row.passport_response
        ),
      cell: (row) =>
        renderProcessingIcon(
          row.passport_file_number,
          row.passport_name,
          row.passport_response
        ),
    },
    {
      name: "Aadhaar Status",
      selector: (row) =>
        renderProcessingIcon(
          row.aadhar_number,
          row.aadhar_name,
          row.aadhaar_response
        ),
      cell: (row) =>
        renderProcessingIcon(
          row.aadhar_number,
          row.aadhar_name,
          row.aadhaar_response
        ),
    },
    {
      name: "DL Status",
      selector: (row) =>
        renderProcessingIcon(row.dl_number, row.dl_name, row.dl_response),
      cell: (row) =>
        renderProcessingIcon(row.dl_number, row.dl_name, row.dl_response),
    },
    {
      name: "Epic Status",
      selector: (row) =>
        renderProcessingIcon(row.epic_number, row.epic_name, row.epic_response),
      cell: (row) =>
        renderProcessingIcon(row.epic_number, row.epic_name, row.epic_response),
    },
    {
      name: "Verified At",
      selector: (row) =>
        row.all_verified === 1
          ? new Date(row.updatedAt).toLocaleDateString("en-GB")
          : "-",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            href={`/employers-dashboard/list-verified-employee/details?id=${row._id}`}
            passHref
          >
            <button className="btn btn-sm" title="View Details">
              <Eye size={16} className="me-1 text-primary" />
            </button>
          </Link>
          <button
            onClick={() => handleDownload(row.file_url)}
            className="btn btn-link p-0"
            title="Download File"
            disabled={row.all_verified === 0} // Disable when all_verified = 0
            style={{
              opacity: row.all_verified === 0 ? 0.5 : 1,
              cursor: row.all_verified === 0 ? "not-allowed" : "pointer",
            }}
          >
            <Download
              size={20}
              className={row.all_verified === 0 ? "text-muted" : "text-success"}
            />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: 1,
    },
  ];

  // Custom styles for centering content in the DataTable
  const customStyles = {
    headCells: {
      style: {
        display: "flex",
        justifyContent: "center", // Center header content
        alignItems: "center",
      },
    },
    cells: {
      style: {
        display: "flex",
        justifyContent: "center", // Center row content
        alignItems: "center",
      },
    },
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return <p className="text-danger text-center mt-3">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <DataTable
        title="Applicants"
        columns={columns}
        data={candidates}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles} // Apply the customStyles here
      />
    </div>
  );
};

export default Applicants;
