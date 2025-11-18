"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import { Download, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { se } from "date-fns/locale/se";

const ResumeBox = () => {
  const [loading, setLoading] = useState(false);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [uploadDate, setUploadDate] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const fetchResume = useCallback(async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      if (!token) {
        console.log("No token found");
        setError("Authentication token missing");
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `${apiurl}/api/candidate/resumefile/get_resume_details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { fileUrl, fileName, updatedAt } = response.data.data;
      console.log("response", response.data.data.fileUrl);
      if (fileUrl && fileName) {
        setTranscriptFile({ name: fileName });
        setResumeUrl(fileUrl);
        const formattedDate = new Date(updatedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setUploadDate(formattedDate);

        console.log("uploadedAt:", updatedAt);
      }
    } catch (err) {
      console.error("Failed to fetch resume:", err);
    } finally {
      setLoading(false);
    }
  }, [apiurl]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setTranscriptFile(file);
      setUploadDate(
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      );

      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = localStorage.getItem("candidate_token");
        if (!token) {
          setError("Authentication token missing");
          return;
        }
        setLoading(true);
        setMessage(null);

        const response = await axios.post(
          `${apiurl}/api/candidate/resumefile/upload-pdf`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.data.success) {
          setError(response.data.message);
          return;
        }

        setSuccess(response.data.message);

        setMessage({ type: "success", text: "Resume uploaded successfully!" });
        setResumeUrl(response.data.pdfUrl?.fileUrl || "updated link"); // replace with actual value if backend returns it
      } catch (error) {
        setMessage({ type: "error", text: "Upload failed. Please try again." });
        console.error("Upload error:", error);
      } finally {
        setLoading(false);
      }
    },
    [apiurl]
  );

  const UploadButton = ({
    label,
    id,
    file,
    onChange,
    accept,
    width = "340px",
  }) => (
    <div className="form-group">
      <div className="uploadButton">
        <input
          className="uploadButton-input"
          type="file"
          id={id}
          accept={accept}
          onChange={onChange}
          ref={fileInputRef}
          required
        />
        <label
          className="uploadButton-button ripple-effect"
          style={{ width }}
          htmlFor={id}
        >
          {file ? file.name : `Browse ${label}..`}
        </label>
      </div>
    </div>
  );

  const handleDelete = useCallback(async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      if (!token) {
        setError("Authentication token missing");
        return;
      }

      setLoading(true);
      setMessage(null);

      const response = await axios.delete(
        `${apiurl}/api/candidate/resumefile/delete_resume_details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        setError(response.data.message || "Delete failed.");
        return;
      }

      setSuccess(response.data.message);
      setTranscriptFile(null);
      setUploadDate(null);
      setResumeUrl(null);
      setMessage({
        type: "success",
        text: response.data.message || "Resume deleted successfully!",
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to delete resume:", error);
      setMessage({ type: "error", text: "Failed to delete resume." });
    } finally {
      setLoading(false);
    }
  }, [apiurl]);
  const confirmDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };
  const handledownloadfullpdf = async () => {
    console.log("Download Full PDF clicked");
    setDownloadLoading(true);
    try {
      const token = localStorage.getItem("candidate_token");
      if (!token) {
        setError("Authentication token missing");
        return;
      }

      const response = await axios({
        url: `${apiurl}/api/candidate/resume/get_resume`,
        method: "GET",
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Read custom header (after backend exposes it)
      console.log("Response headers:", response.headers);
      console.log("data: ", response.headers["filename"]);
      let filename = response.headers["filename"] || "My_Resume.pdf";
      console.log("Detected filename:", filename);

      // ✅ Create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading full PDF:", error);
      setError("Failed to download resume");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="ls-widget">
      <div className="tabs-box">
        <div className="widget-title">
          <h4>Resume</h4>
        </div>

        {loading ? (
          <CustomizedProgressBars />
        ) : (
          <div className="widget-content">
            <MessageComponent
              error={error}
              success={success}
              setError={setError}
              setSuccess={setSuccess}
            />

            {transcriptFile ? (
              <>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <p className="resume-file fw-semibold mb-1">
                      {transcriptFile.name}
                    </p>
                    {uploadDate && (
                      <p className="upload-date text-muted">
                        Uploaded on {uploadDate}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6 d-flex gap-3 justify-content-md-end mt-3 mt-md-0">
                    {resumeUrl && (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                      >
                        <Download size={16} />
                        Download
                      </a>
                    )}
                    <button
                      onClick={handledownloadfullpdf}
                      className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                      disabled={downloadLoading}
                      style={{ opacity: downloadLoading ? 0.5 : 1 }}
                    >
                      <Download size={16} />
                      {downloadLoading
                        ? "Downloading..."
                        : "Download Report PDF"}
                    </button>

                    <button
                      onClick={confirmDelete}
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={handledownloadfullpdf}
                className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                disabled={downloadLoading}
                style={{ opacity: downloadLoading ? 0.5 : 1 }}
              >
                <Download size={16} />
                {downloadLoading ? "Downloading..." : "Download Report PDF"}
              </button>
            )}

            <div
              className="upload-wrapper d-flex justify-content-center mt-4"
              style={{ width: "100%" }}
            >
              <UploadButton
                label="Upload Resume"
                id="resume"
                file={transcriptFile}
                onChange={handleFileChange}
                accept="image/*, .pdf"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBox;
