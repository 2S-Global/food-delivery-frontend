"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import AddCompanyModal from "./modals/addcompany";

import {
  Trash2,
  Settings,
  Pencil,
  PackageOpen,
  Send,
  FilePen,
  Mailbox,
  ShoppingCart,
  Eye,
} from "lucide-react";
import EditfieldModal from "./modals/editfield";
import EditplanModal from "./modals/planmodal";
import VerifiedlistModal from "./modals/verifiedlistModal";
import ImagePreviewModal from "./modals/ImagePreviewModal";
const Companytable = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [modalName, setModalName] = useState([]);
  const [modalDesc, setModalDesc] = useState([]);

  const openImageModal = (images, name, description) => {
    setPreviewImages(images);
    setModalName(name);
    setModalDesc(description);
    setIsImageModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setPreviewImages([]);
    document.body.style.overflow = "auto";
  };



  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
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

  const [emailloading, setEmailloading] = useState(false);
  const openModalRH = (companydetails) => {
    // setEditcompany(companydetails);
    setEditMenu(companydetails);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };
  const openModalPlanRH = (companydetails) => {
    setEditcompany(companydetails);
    setIsModalplanOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
    console.log("open modal plan");
  };
  const openModalVL = (companydetails) => {
    setEditcompany(companydetails);
    setIsModalvlOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
    console.log("open modal verified list");
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
  const handlecart = (company) => {
    router.push(`/admin/cart?id=${company._id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiurl}/api/userdata/list-all-menu`,
          // { role: 2 },
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
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Error fetching companies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [apiurl]);

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

    console.log("Token:", token);
    console.log("ID:", id);
    console.log("Current Status:", currentStatus);

    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/togglestatus-companies`,

        {
          companyId: id,
          status: !currentStatus,
          role: 2,
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
      } else {
        setError("Failed to toggle status.");
      }
    } catch (error) {
      setError("Something went wrong while toggling status.");
    }
  };

  const handleInvite = async (company) => {
    setEmailloading(true);
    console.log("Inviting company:", company.name);
    console.log("Inviting company email:", company.email);
    /* api/invite/invite */

    const token = localStorage.getItem("Super_token");

    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/invite/invite`,
        { email: company.email, name: company.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("invite response", response);

      if (response.data.success) {
        const time = Date.now();
        setMessage_id(time);
        setSuccess(response.data.message);
      }
    } catch (err) {
      setError(err.invite?.data?.message || "Invite failed. Try again.");
      const time = Date.now();
      setErrorId(time);
    } finally {
      setEmailloading(false);
    }
  };
  const handleSignupemail = async (company) => {
    const confirmed = window.confirm(
      "Are you sure you want to send the Sign Up Email?\nThis will also reset the password."
    );

    if (!confirmed) return; // Exit if user cancels

    setEmailloading(true);

    /* api/invite/invite */

    const token = localStorage.getItem("Super_token");

    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/auth/sendAccessEmail`,
        { companyId: company._id, email: company.email, name: company.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("invite response", response);

      if (response.data.success) {
        const time = Date.now();
        setMessage_id(time);
        setSuccess(response.data.message);
      }
    } catch (err) {
      setError(err.invite?.data?.message || "Invite failed. Try again.");
      const time = Date.now();
      setErrorId(time);
    } finally {
      setEmailloading(false);
    }
  };
  const handleplanmail = async (company) => {
    setEmailloading(true);

    /* api/invite/invite */

    const token = localStorage.getItem("Super_token");

    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyPackageRoute/resendCompanyPackageEmail`,
        { companyId: company._id, email: company.email, name: company.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("invite response", response);

      if (response.data.success) {
        const time = Date.now();
        setMessage_id(time);
        setSuccess(response.data.message);
      }
    } catch (err) {
      setError(err.invite?.data?.message || "Invite failed. Try again.");
      const time = Date.now();
      setErrorId(time);
    } finally {
      setEmailloading(false);
    }
  };

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
          <div className="row">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ textAlign: "center" }}>S/N</th>
                    <th style={{ textAlign: "center" }}>Image</th>
                    <th style={{ textAlign: "center" }}>Name</th>
                    <th style={{ textAlign: "center" }}>Type</th>
                    <th style={{ textAlign: "center" }} >Description</th>
                    {/*  <th style={{ textAlign: "center" }}>Total Verification</th> */}
                    <th style={{ textAlign: "center" }}>Day</th>
                    <th style={{ textAlign: "center" }}>Meal Type</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    menus.map((menu, index) => {

                      const cleanDescription = (() => {
                        if (!menu.description) return "";

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(menu.description, "text/html");

                        // Remove all inline styles
                        doc.querySelectorAll("*").forEach(el => el.removeAttribute("style"));

                        // Optional: set all text to black
                        doc.querySelectorAll("*").forEach(el => (el.style.color = "black"));

                        return doc.body.innerHTML;
                      })();



                      return (
                        <tr key={menu._id}>
                          <td style={{ textAlign: "center" }}>{index + 1}</td>
                          {/* <td style={{ textAlign: "center" }}>
                            <Eye
                              size={20}
                              style={{ cursor: "pointer", color: "blue" }}
                              onClick={() => openImageModal(menu?.images ?? [])}
                            />
                          </td> */}
                          <td style={{ textAlign: "center" }}>
                            {menu?.images && menu.images.length > 0 ? (
                              <img
                                src={menu.images[0]} // always first image
                                alt={menu.menuName}
                                style={{
                                  width: "50px",       // adjust size as needed
                                  height: "50px",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                  borderRadius: "4px", // optional, for rounded corners
                                }}
                                onClick={() => openImageModal(menu.images ?? [])} // open modal with all images
                              />
                            ) : (
                              <span>No Image</span> // fallback if images array is empty
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>{menu.menuName}</td>
                          <td style={{ textAlign: "center" }}>{menu.menuType}</td>
                          <td
                            style={{ textAlign: "center" }}
                            dangerouslySetInnerHTML={{ __html: cleanDescription }}
                          ></td>
                          {/*  <td style={{ textAlign: "center" }}>{menu.description}</td> */}
                          <td style={{ textAlign: "center" }}>{menu.dayType}</td>
                          <td style={{ textAlign: "center" }}>{menu.mealType}</td>

                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-3">
                              <span title="View Details">
                                <Eye
                                  color="green"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => openImageModal(menu?.images ?? [], menu?.menuName ?? [], menu?.description ?? [])}
                                  size={20}
                                />
                              </span>

                              {/* <Eye
                                size={20}
                                style={{ cursor: "pointer", color: "blue" }}
                                onClick={() => openImageModal(menu?.images ?? [])}
                              /> */}

                              <span title="Edit">
                                <Pencil
                                  className="text-primary"
                                  style={{ cursor: "pointer" }}
                                  // onClick={() => openModalRH(company)}
                                  onClick={() => openModalRH(menu)}
                                  size={20}
                                />
                              </span>
                              {/* 
                            <span title="Plan">
                              <PackageOpen
                                className="text-info"
                                style={{ cursor: "pointer" }}
                                onClick={() => openModalPlanRH(company)}
                                size={20}
                              />
                            </span> */}

                              <span title="Delete">
                                <Trash2
                                  size={20}
                                  className="text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    const confirmDelete = window.confirm(
                                      "Are you sure you want to delete this company?"
                                    );
                                    if (confirmDelete) {
                                      handleDelete(menu._id);
                                    }
                                  }}
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              <style jsx>{`
                .forceBlack,
                .forceBlack * {
                  color: black !important;
                }
              `}</style>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <AddCompanyModal
          show={isModalOpen}
          onClose={closeModalRH}
          // field={editcompany}
          field={editMenu}
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

      {isImageModalOpen && (
        <ImagePreviewModal
          show={isImageModalOpen}
          onClose={closeImageModal}
          images={previewImages}
          name={modalName}
          description={modalDesc}
        />
      )}

    </>
  );
};

export default Companytable;
