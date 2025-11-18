import { Eye } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

const Table = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [users, setUsers] = useState([]);

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
          `${apiurl}/api/usercart/getAllVerifiedCandidateAdmin`,
          null,
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
  console.log("users", users);
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
        <>
          <div className="widget-content">
            <div className="row">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th style={{ textAlign: "center" }}>S/N</th>
                      <th style={{ textAlign: "center" }}>Candidate Name</th>
                      <th style={{ textAlign: "center" }}>Verified By</th>
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
                          <td style={{ textAlign: "center" }}>{index + 1}</td>
                          <td style={{ textAlign: "center" }}>
                            {company.candidate_name}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {company.employer_name}
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
                                <Eye size={16} className="me-1 text-primary" />
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
    </>
  );
};

export default Table;
