import React from "react";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Eye,
  BadgeAlert,
  BadgeCheck,
  FileText,
  OctagonAlert,
} from "lucide-react";
import Link from "next/link";

const UsersList = ({ users }) => {
  return (
    <div className="container mt-4">
      {users.length > 0 && (
        <div className="result-container">
          <h3>Search Results:</h3>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th style={{ textAlign: "center" }}>Sl</th>
                <th style={{ textAlign: "center" }}>Name</th>
                <th style={{ textAlign: "center" }}>Phone</th>
                <th style={{ textAlign: "center" }}>PAN Status</th>
                <th style={{ textAlign: "center" }}>Passport Status</th>
                <th style={{ textAlign: "center" }}>Aadhaar Status</th>
                <th style={{ textAlign: "center" }}>Driving License Status</th>
                <th style={{ textAlign: "center" }}>Epic Status</th>
                <th style={{ textAlign: "center" }}>Verified Date</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((candidate, index) => (
                <tr key={candidate._id || `user-${index}`}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td style={{ textAlign: "center" }}>
                    <strong>{candidate.candidate_name}</strong>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {candidate.candidate_mobile}
                  </td>

                  {/* Mapping over status responses */}
                  {[
                    { label: "PAN", response: candidate.pan_response },
                    {
                      label: "Passport",
                      response: candidate.passport_response,
                    },
                    { label: "Aadhar", response: candidate.aadhaar_response },
                    {
                      label: "Driving License",
                      response: candidate.dl_response,
                    },
                    ,
                    { label: "Epic", response: candidate.epic_response },
                  ].map((item, idx) => (
                    <td
                      style={{ textAlign: "center" }}
                      key={`${candidate._id}-${item.label}`}
                    >
                      {renderStatusIcon(item.response)}
                    </td>
                  ))}
                  <td style={{ textAlign: "center" }}>
                    {new Date(candidate.updatedAt).toLocaleDateString("en-GB")}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <Link
                      href={`/employers-dashboard/list-verified-employee/details?id=${candidate._id}`}
                    >
                      <button className="btn btn-outline-primary btn-sm w-100">
                        <Eye size={14} className="me-1" /> View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Function to render status icons
const renderStatusIcon = (response) => {
  if (response?.response_code === "100") {
    return (
      <BadgeCheck
        size={20}
        className="text-success"
        title="Valid Authentication"
      />
    );
  }
  if (response?.response_code === "101") {
    return (
      <BadgeAlert
        size={20}
        className="text-warning"
        title="Invalid Authentication"
      />
    );
  }
  return <OctagonAlert size={20} className="text-danger" title="Not Applied" />;
};

export default UsersList;
