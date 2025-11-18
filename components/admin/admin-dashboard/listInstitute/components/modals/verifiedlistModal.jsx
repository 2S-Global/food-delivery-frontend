import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import { Eye } from "lucide-react";

const VerifiedlistModal = ({ show, onClose, company }) => {
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("Super_token") : null;

  const didFetch = useRef(false);

  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [users, setUsers] = useState([]);

  //console.log("company from modal:", company);

  useEffect(() => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiurl}/api/usercart/getAllVerifiedCandidateByCompanyForAdmin`,
          { company_id: company._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("response", response);
        setUsers(response.data.data);
      } catch (err) {
        setError("Error fetching companies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content shadow-lg border-0 rounded-4">
            <div className="modal-header">
              <h5 className="modal-title">
                Verified Candidate List for{" "}
                <strong>{company?.name || "Company"}</strong>
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body px-4 py-3">
              <MessageComponent error={error} success={success} />

              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <div
                    className="spinner-border text-primary spinner-lg"
                    role="status"
                    style={{ width: "4rem", height: "4rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="widget-content">
                    <div className="row">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th style={{ textAlign: "center" }}>S/N</th>
                              <th style={{ textAlign: "center" }}>
                                Candidate Name
                              </th>
                              <th style={{ textAlign: "center" }}>Date</th>
                              <th style={{ textAlign: "center" }}>
                                Verified Documents
                              </th>
                              <th style={{ textAlign: "center" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.length === 0 ? (
                              <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                  No records found
                                </td>
                              </tr>
                            ) : (
                              users.map((company, index) => (
                                <tr key={company.id}>
                                  <td style={{ textAlign: "center" }}>
                                    {index + 1}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {company.candidate_name}
                                  </td>

                                  <td style={{ textAlign: "center" }}>
                                    {company.date}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {company.verifications_done}
                                  </td>

                                  <td className="text-center">
                                    <Link
                                      href={`/admin/listverified/details?id=${company.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <button
                                        className="btn btn-sm"
                                        title="View Details"
                                      >
                                        <Eye
                                          size={16}
                                          className="me-1 text-primary"
                                        />
                                      </button>
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
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

export default VerifiedlistModal;
