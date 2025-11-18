import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

const EditplanModal = ({ show, onClose, field }) => {
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("Super_token") : null;

  const didFetch = useRef(false);

  const [formData, setFormData] = useState({
    discount_percent: "",
    selected_plan: [],
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessage_id] = useState(null);

  useEffect(() => {
    if (!show || !field?._id || didFetch.current) return;

    didFetch.current = true;
    setFormData((prev) => ({
      ...prev,
      companyId: field._id,
    }));

    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiurl}/api/pacakageRoute/getPackages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setPlans(response.data.data);
        } else {
          setError(response.data.message);
          setErrorId(Date.now());
        }
      } catch {
        setError("Error fetching plans. Please try again.");
        setErrorId(Date.now());
      } finally {
        setLoading(false);
      }
    };

    const fetchCompanyPlans = async () => {
      try {
        const response = await axios.post(
          `${apiurl}/api/companyPackageRoute/getCompanyPackagesByCompanyId`,
          { companyId: field._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setFormData((prev) => ({
            ...prev,
            selected_plan: response.data.data.selected_plan || [],
            discount_percent: response.data.data.discount_percent || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching plan details:", err);
      }
    };

    fetchPlans();
    fetchCompanyPlans();
  }, [show, field, apiurl, token]);

  useEffect(() => {
    if (!show) {
      // Reset on modal close
      setFormData({
        discount_percent: "",
        selected_plan: [],
        companyId: "",
      });
      setError(null);
      setSuccess(null);
      didFetch.current = false;
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "discount_percent") {
      const number = parseFloat(value);
      if (number > 100 || number < 0) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberTrim = (name, value) => {
    let trimmed = value.trim();
    if (!/^0\.\d+$/.test(trimmed)) {
      trimmed = trimmed.replace(/^0+(?=\d)/, "") || "0";
    }
    setFormData((prev) => ({ ...prev, [name]: trimmed }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.selected_plan, value]
        : prev.selected_plan.filter((id) => id !== value);
      return { ...prev, selected_plan: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyPackageRoute/createCompanyPackage`,
        {
          ...formData,
          selected_plan: formData.selected_plan.join(","),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      setMessage_id(Date.now());
      setTimeout(() => {
        window.location.reload();
        router.push("/admin/listcompany");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
      >
        <div className="modal-content shadow-lg border-0 rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">
              Edit Plan for <strong>{field?.name || "Company"}</strong>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body px-4 py-3">
            <MessageComponent
              error={error}
              success={success}
              errorId={errorId}
              message_id={message_id}
            />

            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div
                  className="spinner-border text-primary spinner-lg"
                  role="status"
                  style={{ width: "4rem", height: "4rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Select Plans
                    </label>
                    <div
                      className="border rounded p-2"
                      style={{ maxHeight: "220px", overflowY: "auto" }}
                    >
                      {plans.length === 0 ? (
                        <p className="text-muted">No plans available.</p>
                      ) : (
                        plans.map((plan) => (
                          <div key={plan._id} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`plan-${plan._id}`}
                              value={plan._id}
                              checked={formData.selected_plan.includes(
                                plan._id
                              )}
                              onChange={handleCheckboxChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`plan-${plan._id}`}
                            >
                              {plan.name} (₹ {plan.transaction_fee})
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="discount_percent"
                      className="form-label fw-semibold"
                    >
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="discount_percent"
                      name="discount_percent"
                      placeholder="e.g. 10"
                      value={formData.discount_percent}
                      onChange={handleChange}
                      onBlur={(e) =>
                        handleNumberTrim("discount_percent", e.target.value)
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Plan"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditplanModal;
