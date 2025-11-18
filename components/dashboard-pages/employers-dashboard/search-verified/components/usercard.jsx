import React from "react";
import Link from "next/link";
import { CheckCircle, XCircle, HelpCircle, Eye } from "lucide-react";

const UserCard = ({ candidate }) => {
  return (
    <div className="col-md-3 mb-3 p-3 border rounded shadow-sm">
      {/* Name & Contact */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold text-truncate m-0">
          {candidate.candidate_name}
        </h6>
        <span className="text-muted small d-flex align-items-center">
          {candidate.candidate_mobile}
        </span>
      </div>

      {/* Verification List */}
      <ul className="list-group list-group-flush">
        {[
          { label: "PAN", response: candidate.pan_response },
          { label: "Aadhar", response: candidate.aadhar_response },
          { label: "Voter", response: candidate.epic_response },
          { label: "License", response: candidate.dl_response },
          { label: "Passport", response: candidate.passport_response },
        ].map((item) => {
          let statusIcon;
          if (item.response) {
            if (item.response.response_code === "100") {
              statusIcon = (
                <CheckCircle
                  size={14}
                  className="text-success"
                  title="Valid Authentication"
                />
              );
            } else if (item.response.response_code === "101") {
              statusIcon = (
                <XCircle
                  size={14}
                  className="text-danger"
                  title="Invalid Authentication"
                />
              );
            } else {
              statusIcon = (
                <HelpCircle
                  size={14}
                  className="text-warning"
                  title="Not Applied"
                />
              );
            }
          } else {
            statusIcon = (
              <HelpCircle
                size={14}
                className="text-warning"
                title="Not Applied"
              />
            );
          }

          return (
            <li
              key={`${item.response?.request_id || item.label}`}
              className="list-group-item d-flex justify-content-between align-items-center p-1 small"
            >
              {item.label} Status {statusIcon}
            </li>
          );
        })}
      </ul>

      {/* Button */}
      <div className="text-end mt-2">
        <Link
          href={`/employers-dashboard/list-verified-employee/details?id=${candidate._id}`}
        >
          <button className="btn btn-outline-primary btn-sm w-100">
            <Eye size={14} className="me-1" /> View Application
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
