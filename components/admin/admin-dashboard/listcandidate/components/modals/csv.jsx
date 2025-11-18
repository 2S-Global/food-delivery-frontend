"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

const AddCsvModal = ({ show, onClose, setRefresh = () => {} }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessage_id] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  if (!show) return null;

  // ------------------------------
  // HANDLE FILE SELECTION
  // ------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("No file selected.");
      setErrorId(Date.now());
      setCsvFile(null);
      return;
    }

    // Check extension
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "xlsx") {
      setError("Only XLSX files are allowed.");
      setErrorId(Date.now());
      setCsvFile(null);
      return;
    }

    setError(null);
    setCsvFile(file);
  };

  // ------------------------------
  // SUBMIT CSV IMPORT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("Super_token")
        : null;
    if (!token) {
      setError("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    const formPayload = new FormData();
    formPayload.append("role", 1);
    formPayload.append("file", csvFile);

    try {
      const response = await axios.post(
        `${apiurl}/api/import-candidate`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) throw new Error(response.data.message);

      setSuccess(response.data.message);
      setMessage_id(Date.now());

      setTimeout(() => {
        setRefresh(true);
        //router.push("/admin/listcandidate");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Import failed. Try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <h5 className="modal-title mb-0">Import New Candidate</h5>

              {/* Download Template */}
              <a
                href="/demo-candidate-excel.xlsx"
                download
                className="btn btn-sm btn-outline-primary"
              >
                Download Template Excel
              </a>
            </div>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <MessageComponent
                error={error}
                success={success}
                errorId={errorId}
                message_id={message_id}
              />

              <div className="mb-4">
                <label className="form-label">Upload Excel (XLSX)</label>
                <input
                  type="file"
                  accept=".xlsx"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  onChange={handleFileChange}
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading || !csvFile}
              >
                {loading ? "Importing..." : "Import"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCsvModal;
