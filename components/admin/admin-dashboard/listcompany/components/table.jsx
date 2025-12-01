"use client";
import React, { useMemo, useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import DataTable from "react-data-table-component";
import { Trash2, Pencil, Eye, FileDown } from "lucide-react";
import ImagePreviewModal from "./modals/ImagePreviewModal";
import AddCompanyModal from "./modals/addcompany";
// import EditfieldModal from "./modals/editfield";
// import EditplanModal from "./modals/planmodal";
// import VerifiedlistModal from "./modals/verifiedlistModal";
// import CandidateformModal from "./modals/formmodal";
// import CircularProgress from "@mui/material/CircularProgress";
// import { se } from "date-fns/locale/se";
// import { set } from "date-fns/set";

const Companytable = ({ setRefresh, refresh }) => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingid, setDownloadingid] = useState(null);
  const [companies, setCompanies] = useState([]);
  // Should remove deliveryPartner
  const [deliveryPartner, setDeliveryPartner] = useState([]);

  const [menus, setMenus] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editcompany, setEditcompany] = useState(null);
  const [editMenu, setEditMenu] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalplanOpen, setIsModalplanOpen] = useState(false);
  const [isModalvlOpen, setIsModalvlOpen] = useState(false);
  /*  const  */
  const [message_id, setMessage_id] = useState(null);
  const [errorId, setErrorId] = useState(null);

  // Actual working modal start------

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [allMenuDetails, setAllMenuDetails] = useState([]);

  const openImageModal = (menu) => {
    setPreviewImages(menu.images || []);
    setAllMenuDetails(menu);
    // setModalName(name);
    // setModalDesc(description);
    setIsImageModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setPreviewImages([]);
    document.body.style.overflow = "auto";
  };

  const openModalRH = (menudetails) => {
    setEditMenu(menudetails);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };



  // Actual working modal end------

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
    fetchMenus();
  }, [apiurl]);

  useEffect(() => {
    if (refresh) {
      fetchCompanies();
      setRefresh(false);
    }
  }, [refresh]);

  const fetchMenus = async () => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      setErrorId(Date.now());
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${apiurl}/api/userdata/list-all-menu`,
        // { role: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // setCompanies(response.data.data);
        setMenus(response.data.data);
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

  // const handleDelete = async (id) => {
  //   const token = localStorage.getItem("Super_token");
  //   if (!token) {
  //     setError("Token not found. Please log in again.");
  //     setErrorId(Date.now());
  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(
  //       `${apiurl}/api/userdata/delete-menu`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params: {
  //           _id: id,
  //         }
  //       }
  //     );

  //     if (response.data.success) {
  //       // setCompanies((prev) => prev.filter((company) => company._id !== id));
  //       setRefresh(true);
  //       setMenus((prev) => prev.filter((menu) => menu._id !== id));
  //       setSuccess(response.data.message);
  //       setMessage_id(Date.now());
  //     } else {
  //       setError(response.data.message);
  //       setErrorId(Date.now());
  //     }
  //   } catch (err) {
  //     setError("Error deleting menu. Please try again.");
  //     setErrorId(Date.now());
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async (id) => {
    setLoading(true);
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.delete(
        `${apiurl}/api/userdata/delete-menu`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            _id: id,
          }
        }
      );

      if (response.data.success) {
        // setCompanies((prev) => prev.filter((company) => company._id !== id));
        setMenus((prev) => prev.filter((menu) => menu._id !== id));
        setSuccess(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error deleting menu. Please try again.");
    } finally {
      setLoading(false);
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
        `${apiurl}/api/userdata/toggle-status`,
        {
          user_id: id,
          // status: !currentStatus,
          // role: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setDeliveryPartner((prev) =>
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

  const [searchText, setSearchText] = useState("");

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const search = searchText.toLowerCase();
      return (
        menu.menuName?.toLowerCase().includes(search) ||
        menu.menuType?.toLowerCase().includes(search) ||
        menu.mealType?.toLowerCase().includes(search)
      );
    });
  }, [fetchMenus, searchText]);


  const columns = [
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>
          S/N
        </div>
      ),
      // selector: (row, index) => index + 1,
      width: "55px",
      sortable: false,
      cell: (row, index) => (
        <div style={{ width: "100%", textAlign: "center" }}>
          {index + 1}
        </div>
      ),
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>
          Image
        </div>
      ),
      width: "80px",
      cell: (row) => (
        <div style={{ width: "100%", textAlign: "center" }}>
          {row?.images && row.images.length > 0 ? (
            <img
              src={row.images[0]} // always first image
              alt={row.menuName}
              style={{
                width: "50px",       // adjust size as needed
                height: "50px",
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: "4px", // optional, for rounded corners
                marginTop: "5px",          // ⭐ add margin top
                marginBottom: "5px",       // ⭐ add margin bottom
              }}
              onClick={() => openImageModal(row ?? [])} // open modal with all images
            />
          ) : (
            <span>No Image</span> // fallback if images array is empty
          )}
        </div>
      ),
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>
          Name
        </div>
      ),
      selector: (row) => row.menuName,
      sortable: true,
      width: "",
      cell: (row) => (
        <div style={{ width: "100%", textAlign: "center" }}>
          {row.menuName}
        </div>
      )
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>
          Type
        </div>
      ),
      selector: (row) => row.menuType,
      sortable: true,
      cell: (row) => (
        <div style={{ width: "100%", textAlign: "center" }}>
          {row.menuType}
        </div>
      )
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>
          Meal Type
        </div>
      ),
      // center: true,
      selector: (row) => row.mealType,
      sortable: true,
      cell: (row) => (
        <div style={{ width: "100%", textAlign: "center" }}>
          {row.mealType}
        </div>
      ),
    },
    {
      name: (
        <div style={{ width: "100%", textAlign: "center" }}>
          Action
        </div>
      ),
      style: { textAlign: "center" },
      cell: (row) => (
        <div className="text-center" style={{ width: "100%", textAlign: "center" }}>
          <div className="d-flex justify-content-center gap-3">
            <span title="View Details">
              <Eye
                color="green"
                style={{ cursor: "pointer" }}
                onClick={() => openImageModal(row ?? [])}
                size={20}
              />
            </span>

            <span title="Edit">
              <Pencil
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => openModalRH(row)}
                size={20}
              />
            </span>

            <span title="Delete">
              <Trash2
                size={20}
                className="text-danger"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this Menu?"
                  );
                  if (confirmDelete) {
                    handleDelete(row._id);
                  }
                }}
              />
            </span>
          </div>
        </div>
      ),
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
              data={filteredMenus}
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

      {isImageModalOpen && (
        <ImagePreviewModal
          show={isImageModalOpen}
          onClose={closeImageModal}
          images={previewImages}
          allMenuDetails={allMenuDetails}
        />
      )}

      {isModalOpen && (
        <AddCompanyModal
          show={isModalOpen}
          onClose={closeModalRH}
          // field={editcompany}
          field={editMenu}
        />
      )}

    </>
  );
};

export default Companytable;
