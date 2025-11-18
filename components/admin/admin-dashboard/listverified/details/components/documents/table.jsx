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
              <FileText
                className="text-primary cursor-pointer"
                size={20}
                onClick={async () => {
                  const fileUrl =
                    "https://res.cloudinary.com/da4unxero/raw/upload/v1745228849/user_pdfs/user_67fd02d36b16e7a74feff539.pdf";
                  const fileName = "user_document.pdf";

                  try {
                    const response = await fetch(fileUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Clean up the blob URL
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Download failed:", error);
                    alert("Failed to download file.");
                  }
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
