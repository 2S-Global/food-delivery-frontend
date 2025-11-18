"use client";
import React, { useMemo, useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import DataTable from "react-data-table-component";
import { Trash2, Pencil, Eye, FileDown } from "lucide-react";
import EditfieldModal from "./modals/editfield";
import EditplanModal from "./modals/planmodal";
import VerifiedlistModal from "./modals/verifiedlistModal";
import CandidateformModal from "./modals/formmodal";
import CircularProgress from "@mui/material/CircularProgress";
import { se } from "date-fns/locale/se";
import { set } from "date-fns/set";

const Companytable = ({ setRefresh, refresh }) => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingid, setDownloadingid] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editcompany, setEditcompany] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalplanOpen, setIsModalplanOpen] = useState(false);
  const [isModalvlOpen, setIsModalvlOpen] = useState(false);
  /*  const  */
  const [message_id, setMessage_id] = useState(null);
  const [errorId, setErrorId] = useState(null);

  const openModalRH = (companydetails) => {
    setEditcompany(companydetails);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalVL = () => {
    setIsModalvlOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
    console.log("close modal verified list");
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  const closeModalPlanRH = () => {
    setIsModalplanOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
    console.log("close modal plan");
  };

  useEffect(() => {
    fetchCompanies();
  }, [apiurl]);

  useEffect(() => {
    if (refresh) {
      fetchCompanies();
      setRefresh(false);
    }
  }, [refresh]);

  const fetchCompanies = async () => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      setErrorId(Date.now());
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/list-companies`,
        { role: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCompanies(response.data.data);
        setSuccess(response.data.message);
        setMessage_id(Date.now());
      } else {
        setError(response.data.message);
        setErrorId(Date.now());
      }
    } catch (err) {
      setError("Error fetching companies. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      setErrorId(Date.now());
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/delete-companies`,
        { companyId: id, role: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // setCompanies((prev) => prev.filter((company) => company._id !== id));
        setRefresh(true);
        setSuccess(response.data.message);
        setMessage_id(Date.now());
      } else {
        setError(response.data.message);
        setErrorId(Date.now());
      }
    } catch (err) {
      setError("Error deleting company. Please try again.");
      setErrorId(Date.now());
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("Super_token");

    // console.log("Token:", token);
    // console.log("ID:", id);
    // console.log("Current Status:", currentStatus);

    if (!token) {
      setError("Token not found. Please log in again.");
      setErrorId(Date.now());
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/togglestatus-companies`,
        {
          companyId: id,
          status: !currentStatus,
          role: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCompanies((prev) =>
          prev.map((comp) =>
            comp._id === id ? { ...comp, is_active: !currentStatus } : comp
          )
        );
        setSuccess(response.data.message);
        setMessage_id(Date.now());
      } else {
        setError("Failed to toggle status.");
        setErrorId(Date.now());
      }
    } catch (error) {
      setError("Something went wrong while toggling status.");
      setErrorId(Date.now());
    }
  };

  const handleDownload = async (id, name = "user") => {
    setDownloading(true);
    setDownloadingid(id);
    try {
      const token = localStorage.getItem("Super_token");
      if (!token) {
        setError("Token not found. Please log in again.");
        setErrorId(Date.now());
        return;
      }

      const response = await axios({
        url: `${apiurl}/api/candidate/resume/get_resume_admin`,
        method: "GET",
        params: { userId: id },
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading resume:", error);

      if (error.response) {
        // Server responded with an error status
        setError(
          `Download failed: ${error.response.data.message || "Server error"}`
        );
        setErrorId(Date.now());
      } else if (error.request) {
        // Request made but no response received
        setError("No response from server. Please try again later.");
        setErrorId(Date.now());
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
        setErrorId(Date.now());
      }
    } finally {
      setDownloading(false);
      setDownloadingid(null);
    }
  };

  const [searchText, setSearchText] = useState("");

  // 🔎 Filter data based on search text
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const search = searchText.toLowerCase();
      return (
        company.name?.toLowerCase().includes(search) ||
        company.email?.toLowerCase().includes(search) ||
        (company.is_active ? "active" : "inactive").includes(search)
      );
    });
  }, [companies, searchText]);

  const columns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      width: "55px",
      center: true,
      sortable: false,
    },
    {
      name: "Candidate Name",
      selector: (row) => row.name,
      sortable: true,
      width: "",
      center: true,
    },
    {
      name: "Candidate Email",
      selector: (row) => row.email,
      sortable: true,
      width: "",
      center: true,
      cell: (row) => (
        <div
          title={row.email} // ✅ native tooltip on hover
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "140px",
          }}
        >
          {row.email}
        </div>
      ),
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="form-check form-switch d-flex mt-2 ">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={row.is_active}
            onChange={() => toggleStatus(row._id, row.is_active)}
          />
          <label
            className={`form-check-label ms-2 fw-semibold ${
              row.is_active ? "text-success" : "text-danger"
            }`}
          >
            {row.is_active ? "Active" : "Inactive"}
          </label>
        </div>
      ),
      center: true,
      width: "100px",
    },
    {
      name: "Created Date",
      selector: (row) =>
        new Date(row.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }),
      sortable: true,
      center: true,
      width: "150px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex  gap-3">
          <Eye
            color="green"
            style={{ cursor: "pointer" }}
            onClick={() =>
              window.open(
                `/candidates-details/${row._id}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
            size={20}
          />
          {downloading && downloadingid === row._id ? (
            <>
              <>
                <svg width="0" height="0" style={{ position: "absolute" }}>
                  <defs>
                    <linearGradient
                      id="my_gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#e01cd5" />
                      <stop offset="100%" stopColor="#1CB5E0" />
                    </linearGradient>
                  </defs>
                </svg>

                <CircularProgress
                  size={20}
                  sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
                />
              </>
            </>
          ) : (
            <FileDown
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => handleDownload(row._id, row.name)}
              size={20}
            />
          )}

          <Pencil
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => openModalRH(row)}
            size={20}
          />
          <Trash2
            size={20}
            className="text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => {
              const confirmDelete = window.confirm(
                "Are you sure you want to delete this candidate?"
              );
              if (confirmDelete) handleDelete(row._id);
            }}
          />
        </div>
      ),
      center: true,
      width: "150px",
    },
  ];

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        message_id={message_id}
        errorId={errorId}
      />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="widget-content">
          <div className="table-wrapper">
            <DataTable
              columns={columns}
              data={filteredCompanies}
              pagination
              highlightOnHover
              dense
              fixedHeader
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control w-25"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)} // ✅ Live filtering
                />
              }
              customStyles={{
                table: {
                  style: {
                    borderRadius: "5px",
                    overflow: "hidden",
                    border: "1px solid #e5e5e5",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  },
                },
                rows: {
                  style: {
                    minHeight: "58px",
                    borderBottom: "1px solid #f3f3f3",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
                  },
                },
                head: {
                  style: {
                    borderBottom: "2px solid #e5e5e5",
                  },
                },
                headCells: {
                  style: {
                    backgroundColor: "#f8f9fa",
                    fontWeight: "700",
                    fontSize: "10px",
                    color: "#343a40",
                    paddingTop: "14px",
                    paddingBottom: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    borderBottom: "1px solid #dee2e6",
                    borderRight: "1px solid #e0e0e0",
                  },
                },
                cells: {
                  style: {
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    fontSize: "10px",
                    color: "#212529",
                    lineHeight: "1.5",
                    borderRight: "1px solid #e0e0e0",
                  },
                },
                pagination: {
                  style: {
                    borderTop: "1px solid #dee2e6",
                    padding: "10px 20px",
                  },
                  pageButtonsStyle: {
                    borderRadius: "5px",
                    height: "35px",
                    width: "35px",
                    padding: "6px",
                    margin: "2px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover:not(:disabled)": {
                      backgroundColor: "#46b171",
                      color: "#fff",
                    },
                    "&:focus": {
                      outline: "none",
                      backgroundColor: "#46b171",
                      color: "#fff",
                    },
                  },
                },
                subHeader: {
                  style: {
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #f1f1f1",
                    padding: "10px 15px",
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        /*   <EditfieldModal
          show={isModalOpen}
          onClose={closeModalRH}
          field={editcompany}
          refresh={refresh}
          setRefresh={setRefresh}
        /> */
        <CandidateformModal
          show={isModalOpen}
          onClose={closeModalRH}
          field={editcompany}
          refresh={refresh}
          setRefresh={setRefresh}
          data={editcompany}
        />
      )}

      {isModalplanOpen && (
        <EditplanModal
          show={isModalplanOpen}
          onClose={closeModalPlanRH}
          field={editcompany}
        />
      )}

      {isModalvlOpen && (
        <VerifiedlistModal
          show={isModalvlOpen}
          onClose={closeModalVL}
          company={editcompany}
        />
      )}
    </>
  );
};

export default Companytable;
