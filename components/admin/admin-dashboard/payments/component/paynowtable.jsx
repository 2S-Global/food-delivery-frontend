import React, { useEffect, useState } from "react";
import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import MessageComponent from "@/components/common/ResponseMsg";
import styles from "./paynowtable.module.css";
import DatePickerComponent from "../component/DatePickerComponent";
import { FileText } from "lucide-react";
import { Autocomplete, TextField } from "@mui/material";

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("Super_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.post(
        `${apiurl}/api/auth/list-companies_all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setCompanyList(response.data.data);
      } else {
        setCompanyList([]);
        setError("Invalid company data format received.");
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to fetch company list.");
    }
  };

  const fetchPayments = async (filters = {}) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${apiurl}/api/usercart/list_all_transaction_company_admin`,
        filters,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setPayments(response.data.data || []);
        setSuccess(response.data.message || "Data fetched successfully");
        setShowTable(true);
      } else {
        setPayments([]);
        setError(response.data.message || "No data found.");
        setShowTable(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setError(null);
    setSuccess(null);

    if (!startDate || !endDate || !selectedCompany) {
      setError("Please select start date, end date, and company.");
      setErrorId(Date.now());
      return;
    }

    if (endDate < startDate) {
      setError("End date cannot be before start date.");
      setErrorId(Date.now());
      return;
    }

    fetchPayments({
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      company_id: selectedCompany._id,
    });
  };

  const handleReset = () => {
    setSelectedCompany(null);
    setStartDate(null);
    setEndDate(null);
    setPayments([]);
    setShowTable(false);
    setError(null);
    setSuccess(null);
  };

  const handledownload = async (id, name) => {
    setLoadingRowId(id);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `https://quikchek-backend.onrender.com/api/pdf/invoice-pdf`,
        { order_id: id },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}_INVOICE.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess("PDF downloaded successfully!");
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("Failed to download PDF. Please try again.");
    } finally {
      setLoadingRowId(null);
    }
  };

  return (
    <div className="widget-content">
      <MessageComponent error={error} success={success} errorId={errorId} />

      <div className="row">
        <div className="col-md-4">
          <Autocomplete
            value={selectedCompany}
            options={companyList}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => setSelectedCompany(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Company" />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                {option.name}
              </li>
            )}
          />
        </div>
        <div className="col-md-4">
          <DatePickerComponent
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />
        </div>
        <div className="col-md-4">
          <DatePickerComponent
            label="End Date"
            value={endDate}
            onChange={setEndDate}
          />
        </div>
      </div>

      <div className="text-center mb-4 mt-5">
        <button className="btn btn-primary me-2" onClick={handleSearch}    disabled={!selectedCompany || !startDate || !endDate}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        showTable && (
          <>
            <h4 className="fw-bold mb-4 mt-4">
              {selectedCompany?.name}&nbsp;Transaction Details
            </h4>

            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Order No</th>
                  <th className="text-center">Invoice No</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Total User</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        {payment.order_number || "N/A"}
                      </td>
                      <td className="text-center">
                        {payment.invoice_number || "N/A"}
                      </td>
                      <td className="text-center">
                        {format(new Date(payment.date), "dd-MM-yyyy")}
                      </td>
                      <td className="text-center">
                        ₹{payment.total_amount || "N/A"}
                      </td>
                      <td className="text-center">
                        {payment.total_users || "N/A"}
                      </td>
                      <td className="text-center">
                        {loadingRowId === payment.id ? (
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <FileText
                            size={18}
                            className="text-success"
                            onClick={() =>
                              handledownload(payment.id, payment.employer_name)
                            }
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )
      )}
    </div>
  );
};

export default PaymentDetails;
