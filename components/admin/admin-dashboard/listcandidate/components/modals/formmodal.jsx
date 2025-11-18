import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import AutoDetectPhoneInput from "@/components/common/form/phonenumber";

const CandidateformModal = ({
  show,
  onClose,
  data = {},
  setRefresh = () => {},
}) => {
  const [formData, setFormData] = useState({
    _id: data._id || "",
    name: data.name || "",
    email: data.email || "",
    phone_number: data.phone_number || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [disableSubmit, setDisableSubmit] = useState(false);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  if (!show) return null;

  // ------------------------------
  // VALIDATION
  // ------------------------------
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Please enter a valid email.";

      case "name":
        return value ? "" : "Name is required.";

      default:
        return "";
    }
  };

  // ------------------------------
  // HANDLE INPUT CHANGE
  // ------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, newValue),
    }));
  };

  const setPhone = (phone) => {
    setFormData((prev) => ({ ...prev, phone_number: phone }));
    setFormErrors((prev) => ({
      ...prev,
      phone_number: validateField("phone_number", phone),
    }));
  };

  // ------------------------------
  // FORM SUBMIT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    // Validate before submit
    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      validationErrors[key] = validateField(key, formData[key]);
    });

    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) {
      setFormErrors(validationErrors);
      setTouched({
        name: true,
        email: true,
        phone_number: true,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/register123`,
        { ...formData, role: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) throw new Error(response.data.message);

      setSuccess(response.data.message);
      setRefresh(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              {formData._id ? "Update Candidate" : "Add New Candidate"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <MessageComponent error={error} success={success} />

              <div className="row">
                {/* Name */}
                <div className="mb-3 col-md-6">
                  <label className="form-label">Candidate Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      touched.name && formErrors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Candidate Name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, name: true }))
                    }
                  />
                  {touched.name && formErrors.name && (
                    <div className="invalid-feedback">{formErrors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3 col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      touched.email && formErrors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email Address"
                    value={formData.email || ""}
                    onChange={handleChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, email: true }))
                    }
                  />
                  {touched.email && formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="mb-3 col-md-12">
                  <AutoDetectPhoneInput
                    phone={formData.phone_number}
                    setPhone={setPhone}
                    setDisableSubmit={setDisableSubmit}
                  />
                  {touched.phone_number && formErrors.phone_number && (
                    <div className="invalid-feedback">
                      {formErrors.phone_number}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading || disableSubmit}
                style={{
                  pointerEvents: loading || disableSubmit ? "none" : "auto",
                  opacity: loading || disableSubmit ? 0.5 : 1,
                }}
              >
                {loading ? (
                  <>{formData._id ? "Updating" : "Registering"}</>
                ) : (
                  <>{formData._id ? "Update" : "Register"}</>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateformModal;
