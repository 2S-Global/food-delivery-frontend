import React from "react";
import Link from "next/link";
import { MapPin, CheckCircle, XCircle, Eye } from "lucide-react";
import Candidatelist from "@/components/dashboard-pages/employers-dashboard/list-verified-employee/components/CandidateList";

const Applicants = () => {
  return (
    <div className="row">
      {Candidatelist.map((candidate) => (
        <div key={candidate.id} className="col-lg-6 col-md-12 col-sm-12 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3 d-flex flex-column">
              {/* Name & Location */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold text-truncate m-0">{candidate.name}</h6>
                <span className="text-muted small d-flex align-items-center">
                  <MapPin size={14} className="me-1" /> {candidate.address}
                </span>
              </div>

              {/* Verification List */}
              <ul className="list-group list-group-flush flex-grow-1">
                {[
                  { label: "PAN", verified: candidate.pan_verified },
                  { label: "Aadhar", verified: candidate.aadhar_verified },
                  { label: "Voter", verified: candidate.voter_verified },
                  { label: "License", verified: candidate.license_verified },
                  { label: "Passport", verified: candidate.passport_verified },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center p-1 small"
                  >
                    {item.label} Status
                    {item.verified ? (
                      <CheckCircle size={14} className="text-success" />
                    ) : (
                      <XCircle size={14} className="text-danger" />
                    )}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <div className="text-end mt-2">
                <button className="btn btn-outline-primary btn-sm w-100">
                  <Link href="/employers-dashboard/list-verified-employee/details?id=1">
                    <Eye size={14} className="me-1" /> View Application
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Applicants;
