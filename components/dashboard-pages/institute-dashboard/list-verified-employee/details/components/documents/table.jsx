"use client"; // Required in Next.js App Router
import React from "react";
import { BadgeAlert, BadgeCheck, FileText, OctagonAlert } from "lucide-react";
export const DocumentsTable = ({ user, handleclick }) => {
  // Helper function to get the appropriate icon
  const getStatusIcon = (key) => {
    if (!user?.[key]) {
      return <OctagonAlert className="text-danger" size={20} />;
    }
    return user[key]?.response_code == 100 ? (
      <BadgeCheck
        className="text-success cursor-pointer"
        size={20}
        onClick={() => handleclick(key)}
      />
    ) : (
      <BadgeAlert
        className="text-warning cursor-pointer"
        size={20}
        onClick={() => handleclick(key)}
      />
    );
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ minWidth: "200px" }}>Candidate Name</th>
            <th style={{ minWidth: "100px" }}>PAN</th>
            <th style={{ minWidth: "100px" }}>Passport</th>
            <th style={{ minWidth: "100px" }}>Aadhar</th>
            <th style={{ minWidth: "100px" }}>DL</th>
            <th style={{ minWidth: "100px" }}>EPIC</th>
            <th style={{ minWidth: "100px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3">{user?.candidate_name || "N/A"}</td>
            {[
              "pan_response",
              "passport_response",
              "aadhaar_response",
              "dl_response",
              "epic_response",
            ].map((key, index) => (
              <td key={index} className="py-3">
                {getStatusIcon(key)}
              </td>
            ))}
            <td className="py-3">
              {/* this should download the pdf */}
              <FileText className="text-primary cursor-pointer" size={20} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
