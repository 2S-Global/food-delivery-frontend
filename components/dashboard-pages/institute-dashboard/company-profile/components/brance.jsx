"use client";
import React, { useState, useEffect } from "react";
import BranchModal from "./madals/branchModal";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import axios from "axios";
import { PencilLine, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
const BranchBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("employer_token");
  const [Branch, setBranch] = useState([]);
  const [edititem, setEditItem] = useState({});

  useEffect(() => {
    fetchbranch();
  }, [apiurl]);

  useEffect(() => {
    if (refresh) {
      fetchbranch();
      setRefresh(false);
    }
  }, [refresh]);

  const fetchbranch = async () => {
    const response = await axios.get(
      `${apiurl}/api/companyprofile/get_branches`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      setBranch(response.data.data);
    }
  };

  const HandelDelete = async (id) => {
    // Confirm before deleting
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This branch will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    // If user cancels, just return
    if (!result.isConfirmed) return;

    setLoading(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      const response = await axios.delete(
        `${apiurl}/api/companyprofile/delete_branch`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: { id }, // ✅ Correct way to send body with DELETE
        }
      );

      if (response.data.success) {
        setRefresh(true);
        setSuccess(response.data.message);
        setMessageId(Date.now());

        // Show success alert
        Swal.fire({
          title: "Deleted!",
          text: "Branch deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setError(response.data.message);
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
      setError("An error occurred while deleting the branch.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const openModalRH = (skill = {}) => {
    setIsModalOpen(true);
    setEditItem(skill);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        errorId={errorId}
        message_id={message_id}
      />
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <CustomizedProgressBars />
        </div>
      )}

      <div className="widget-title">
        <h4>Branch Information</h4>
        <span
          onClick={openModalRH}
          style={{
            cursor: "pointer",
            float: "right",
            color: "#275df5",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          Add details
        </span>
      </div>

      <div className="widget-content">
        <table className="table">
          <thead>
            <tr className="border-bottom">
              <th className="border-bottom ">S.No</th>
              <th className="border-bottom">Branch Details</th>
              <th className="border-bottom">Location</th>
              <th className="border-bottom">Full Address</th>

              <th className="border-bottom"></th>
            </tr>
          </thead>
          <tbody>
            {Branch.map((skill, index) => (
              <tr key={index}>
                {/* Serial Number */}
                <td className="align-middle text-center fw-bold">
                  {index + 1}
                </td>

                {/* Branch Info */}
                <td className="align-middle">
                  <div className="fw-semibold text-dark">
                    {skill.name || "-"}
                  </div>
                  <div className="text-muted small">
                    <i className="la la-envelope me-1"></i>
                    {skill.email || "-"}
                  </div>
                  <div className="text-muted small">
                    <i className="la la-phone me-1"></i>
                    {skill.phone || "-"}
                  </div>
                </td>

                {/* Location */}
                <td className="align-middle">
                  <div>
                    <span className="badge bg-light text-dark border">
                      {skill.country?.name || "-"}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="badge bg-light text-dark border">
                      {skill.state?.name || "-"}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="badge bg-light text-dark border">
                      {skill.city?.name || "-"}
                    </span>
                  </div>
                </td>

                {/* Full Address */}
                <td
                  className="align-middle text-muted small"
                  style={{ maxWidth: "250px" }}
                >
                  {skill.address || "-"}
                </td>

                {/* Actions */}
                <td className="align-middle text-center">
                  <PencilLine
                    onClick={() => openModalRH(skill)}
                    style={{ cursor: "pointer" }}
                    color="#275df5"
                    size={18}
                    className="me-2"
                  />
                  <Trash2
                    style={{ cursor: "pointer" }}
                    size={18}
                    color="red"
                    onClick={() => HandelDelete(skill._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <BranchModal
          show={isModalOpen}
          onClose={closeModalRH}
          setError={setError}
          setErrorId={setErrorId}
          setSuccess={setSuccess}
          setMessageId={setMessageId}
          setRefresh={setRefresh}
          item={edititem}
        />
      )}
    </>
  );
};

export default BranchBox;
