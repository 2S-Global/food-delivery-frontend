import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import TermsModal from "@/components/dashboard-pages/footermodal/termsmodal";

const AadhaarForm = ({
  loading,
  setLoading,
  error,
  setError,
  success,
  setSuccess,
  setRenderBill,
  setRenderForm,
  setFormsubmitted,
  formsubmitted,
  setPaymentvalues,
  setErrorId,
  setMessage_id,
}) => {
  const company_name = localStorage.getItem("Admin_name");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("Admin_token");

  const [formData, setFormData] = useState({
    aadhar_number: "",
    aadhar_name: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let errorMsg = "";

    if (name === "aadhar_name") {
      const onlyLetters = /^[A-Za-z\s]*$/;
      if (!onlyLetters.test(value)) return;
      if (!value.trim()) errorMsg = "Name is required.";
    }

    if (name === "aadhar_number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
      if (updatedValue.length !== 12)
        errorMsg = "Aadhaar number must be exactly 12 digits.";
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Blur handler
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Checkbox toggle
  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

  // Terms modal
  const handleShowTermsModal = () => {
    setShowTermsModal(true);
    document.body.style.overflow = "hidden";
  };
  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
    document.body.style.overflow = "auto";
  };

  // Form validation
  const isFormValid = () =>
    formData.aadhar_number.length === 12 &&
    formData.aadhar_name.trim() &&
    !formErrors.aadhar_number &&
    !formErrors.aadhar_name;

  // Handle submit (unchanged)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const formPayload = new FormData();
      for (let key in formData) formPayload.append(key, formData[key]);

      const response = await axios.post(
        `${apiurl}/api/usercart/add_user_cart_aadhao_otp`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess(response.data.message || "Submitted successfully");
        setMessage_id(Date.now());
        setRenderBill(true);
        setRenderForm(false);
        setFormsubmitted(true);
        setPaymentvalues();
        setError("");
      } else {
        setError(
          response.data.message || "Submission failed. Please try again."
        );
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" ">
        <form
          className="default-form"
          onSubmit={handleSubmit}
          /*   style={{
            pointerEvents: formsubmitted ? "none" : "auto",
            opacity: formsubmitted ? 0.5 : 1,
          }} */
        >
          <div className="row">
            {/* Aadhaar Number */}
            <div className="form-group col-md-6 d-flex flex-column">
              <label htmlFor="aadhar_number" className="form-label">
                Aadhaar Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="aadhar_number"
                id="aadhar_number"
                className={`form-control ${
                  touched.aadhar_number && formErrors.aadhar_number
                    ? "is-invalid"
                    : ""
                }`}
                value={formData.aadhar_number}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={12}
              />
              {touched.aadhar_number && formErrors.aadhar_number && (
                <div className="invalid-feedback">
                  {formErrors.aadhar_number}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="form-group col-md-6 d-flex flex-column">
              <label htmlFor="aadhar_name" className="form-label">
                Full Name (as per Aadhaar){" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="aadhar_name"
                id="aadhar_name"
                className={`form-control ${
                  touched.aadhar_name && formErrors.aadhar_name
                    ? "is-invalid"
                    : ""
                }`}
                value={formData.aadhar_name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {touched.aadhar_name && formErrors.aadhar_name && (
                <div className="invalid-feedback">{formErrors.aadhar_name}</div>
              )}
            </div>
          </div>

          {/* Checkbox + Submit */}
          {!formsubmitted && (
            <div className="form-group mt-3">
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="termsCheck"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="termsCheck">
                  This KYC verification is being done as per the request from "
                  {company_name}". The result is not for any promotional &
                  commercial purposes. I agree to all{" "}
                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={handleShowTermsModal}
                  >
                    Terms and Conditions
                  </span>
                </label>
              </div>

              <button
                className="theme-btn btn-style-one"
                type="submit"
                disabled={!isFormValid() || !isChecked || loading}
                style={{
                  backgroundColor:
                    !isFormValid() || !isChecked || loading ? "red" : "",
                  cursor:
                    !isFormValid() || !isChecked || loading
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {loading ? "Please wait..." : "Submit"}
              </button>
            </div>
          )}
        </form>
      </div>

      {showTermsModal && (
        <TermsModal show={showTermsModal} onClose={handleCloseTermsModal} />
      )}
    </>
  );
};

export default AadhaarForm;
