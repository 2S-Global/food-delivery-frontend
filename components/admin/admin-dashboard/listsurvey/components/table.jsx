"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Eye } from "lucide-react";
import MessageComponent from "@/components/common/ResponseMsg";
import SurveyViewModal from "./modals/SurveyViewModal";

const SurveyTable = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message_id, setMessage_id] = useState(null);
  const [errorId, setErrorId] = useState(null);

  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  /* ======================
     FETCH SURVEYS
  ======================= */
  const fetchSurveys = async () => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please login again.");
      setErrorId(Date.now());
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${apiurl}/api/survey`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setSurveys(res.data.data);
      } else {
        setError(res.data.message);
        setErrorId(Date.now());
      }
    } catch (err) {
      setError("Failed to fetch surveys");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [apiurl]);

  /* ======================
     SEARCH FILTER
  ======================= */
  const filteredSurveys = useMemo(() => {
    const search = searchText.toLowerCase();
    return surveys.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search)
    );
  }, [surveys, searchText]);

  /* ======================
     TABLE COLUMNS
  ======================= */
  const columns = [
    {
      name: "S/N",
      width: "60px",
      cell: (_, index) => index + 1,
    },
    {
      name: "Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Meal Type",
      selector: (row) => row.mealPreference || "-",
    },
    {
      name: "Submitted On",
      selector: (row) => new Date(row.createdAt).toLocaleDateString("en-GB"),
      sortable: true,
    },

    {
      name: "Action",
      center: true,
      cell: (row) => (
        <Eye
          size={20}
          color="green"
          style={{ cursor: "pointer" }}
          title="View Survey"
          onClick={() => {
            setSelectedSurvey(row);
            setIsViewOpen(true);
          }}
        />
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
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredSurveys}
          pagination
          highlightOnHover
          fixedHeader
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="Search by name or email"
              className="form-control w-25"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          }
        />
      )}

      {/* VIEW MODAL */}
      {isViewOpen && (
        <SurveyViewModal
          show={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          survey={selectedSurvey}
        />
      )}
    </>
  );
};

export default SurveyTable;
