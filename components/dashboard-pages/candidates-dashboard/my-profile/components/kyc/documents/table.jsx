"use client"; // Required in Next.js App Router
import React, { useState } from "react";
import {
  Download,
  BadgeAlert,
  BadgeCheck,
  FileText,
  OctagonAlert,
} from "lucide-react";
import axios from "axios";
import MessageComponent from "@/components/common/ResponseMsg";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Toast } from "@capacitor/toast";
export const DocumentsTable = ({ user, handleclick }) => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const handleDownload = async (id, name) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post(
        `${apiurl}/api/pdf/otp-generate-pdf`,
        { order_id: id },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      if (Capacitor.isNativePlatform()) {
        // Mobile (iOS/Android) with Capacitor
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result.split(",")[1]; // Remove metadata prefix

          await Filesystem.writeFile({
            path: `${name}.pdf`,
            data: base64Data,
            directory: Directory.Documents,
          });

          await Toast.show({
            text: "PDF downloaded successfully!",
          });

          setSuccess("PDF downloaded successfully!");
        };
        reader.readAsDataURL(blob);
      } else {
        // Web fallback
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setSuccess("PDF downloaded successfully!");
      }
      /*  const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess("PDF downloaded successfully!"); */
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("Failed to download PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (key) => {
    if (!user?.[key]) {
      return <OctagonAlert className="text-danger" size={20} />;
    }
    return user[key]?.response_code == 100 || user[key]?.status_code == 200 ? (
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
    <>
      <MessageComponent error={error} success={success} />

      <div className="d-flex justify-content-center">
        <div
          className="card shadow-sm border-primary rounded-4 h-auto"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div className="card-body px-3 py-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold text-primary mb-0">
                {user?.candidate_name || "N/A"}
              </h6>
              {loading ? (
                <div
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <Download
                  className="text-primary cursor-pointer"
                  size={18}
                  title="Download Invoice"
                  onClick={() => handleDownload(user._id, user.candidate_name)}
                />
              )}
            </div>

            {[
              { label: "PAN", key: "pan_response" },
              { label: "Passport", key: "passport_response" },
              { label: "Aadhar", key: "aadhaar_response" },
              { label: "DL", key: "dl_response" },
              { label: "EPIC", key: "epic_response" },
            ].map(({ label, key }) => (
              <div
                key={key}
                className="d-flex justify-content-between align-items-center small py-1 border-bottom"
              >
                <span className="fw-medium">{label}</span>
                <span>{getStatusIcon(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
