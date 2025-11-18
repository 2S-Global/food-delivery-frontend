'use client'
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import { Eye, EyeOff } from "lucide-react"; // Or any icon library you prefer

const AddCsvModal = ({ show, onClose, field }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorId, setErrorId] = useState(null);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_CSV_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    const formPayload = new FormData();

    formPayload.append("role", 2);
    if (csvFile) {
      formPayload.append("file", csvFile); // Changed 'csv' to 'file'
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/import-institute`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }

      setSuccess(response.data.message);
      window.location.reload();
      // router.push("/admin/listinstitute");
    } catch (err) {
      setError(
        err.response?.data?.message || "Import failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setCsvFile(null);
      setError("No file selected.");
      setErrorId(Date.now());
      return;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "csv") {
      setError("Only CSV files are allowed.");
      setErrorId(Date.now());
      setCsvFile(null);
      return;
    }
    setCsvFile(file);
    setError("");
  };
  return (
    <>
      {/* Modal Overlay */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            {/* Modal Header */}
      <div className="modal-header d-flex justify-content-between align-items-center">
  <div className="d-flex align-items-center gap-3">
    <h5 className="modal-title mb-0">Import New Institute</h5>
    <a
      href="/demo-institute.csv"
      download
      className="btn btn-sm btn-outline-primary"
    >
      Download Dummy CSV
    </a>
  </div>
  <button
    type="button"
    className="btn-close"
    onClick={onClose}
  ></button>
</div>


            {/* Modal Body */}
            <div className="modal-body row">
              <form onSubmit={handleSubmit}>
                {/* Response Message */}
                <MessageComponent error={error} success={success} />
                <div className="row">
                  <div className="mb-5 col-md-12 ">
                    <label htmlFor="csvUpload" className="form-label">
                      Upload CSV
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      className={`form-control ${error ? "is-invalid" : ""}`}
                      onChange={handleFileChange}
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
                  </div>
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

export default AddCsvModal;
