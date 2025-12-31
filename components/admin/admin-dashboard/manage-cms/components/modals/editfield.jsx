import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

const EditfieldModal = ({ show, onClose, field = {} }) => {
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    allowed_verifications: "",
    transaction_fee: 0,
    transaction_gst: 18,
    phone_number: "",
    address: "",
    gst_no: "",
    package_id: "",
    email: "",
    discount_percent: "",
    id: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    transaction_fee: 0,
    transaction_gst: 18,
    allowed_verifications: "",
    phone_number: "",
    address: "",
    gst_no: "",
    package_id: "",
    discount_percent: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    transaction_fee: false,
    transaction_gst: false,
    allowed_verifications: false,
    phone_number: false,
    address: false,
    gst_no: false,
    package_id: false,
    discount_percent: false,
  });
  const [gstError, setGstError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Populate form when `field` changes
  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name || "",
        allowed_verifications: field.allowed_verifications || "",
        transaction_fee: field.transaction_fee || "",
        transaction_gst: field.transaction_gst || "",
        id: field._id || "",
        phone_number: field.phone_number || "",
        address: field.address || "",
        gst_no: field.gst_no || "",
        package_id: field.package_id || "",
        discount_percent: field.discount_percent || "",
        email: field.email || "",
      });
    }
  }, [field]);

  const isValidGST = (gst) => {
    const regex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/;

    if (!regex.test(gst)) return false;

    let chars = gst.split("");
    let factor = [1, 2];
    let sum = 0;
    const modulus = 36;
    const codePointBase = "0".charCodeAt(0);
    const lettersBase = "A".charCodeAt(0);

    for (let i = 0; i < 14; i++) {
      let char = chars[i];
      let code = char.match(/[0-9]/)
        ? char.charCodeAt(0) - codePointBase
        : char.charCodeAt(0) - lettersBase + 10;

      let product = code * factor[i % 2];
      sum += Math.floor(product / modulus) + (product % modulus);
    }

    const checksumChar = (36 - (sum % 36)) % 36;
    const expected =
      checksumChar < 10
        ? String(checksumChar)
        : String.fromCharCode(lettersBase + checksumChar - 10);

    return chars[14] === expected;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;
    let errorMsg = "";

    switch (name) {
      case "email":
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          errorMsg = "Please enter a valid email address.";
        }
        break;

      case "phone_number":
        updatedValue = value.replace(/\D/g, ""); // Remove non-digits
        if (updatedValue.length > 10) {
          updatedValue = updatedValue.slice(0, 10); // Limit to 10 digits
        }
        if (updatedValue && updatedValue.length !== 10) {
          errorMsg = "Phone number must be exactly 10 digits.";
        }
        break;

      default:
        break;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const current = formData.allowed_verifications
      ? formData.allowed_verifications.split(",")
      : [];

    const updated = checked
      ? [...new Set([...current, value])]
      : current.filter((item) => item !== value);

    setFormData({
      ...formData,
      allowed_verifications: updated.join(","),
    });
  };

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

    try {
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/edit_user`,
        {
          ...formData, 
          role: 2, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
      window.location.reload();
      // router.push("/admin/listcompany");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const verificationOptions = ["PAN", "Aadhaar", "EPIC", "DL", "Passport"];
  const selectedVerifications = formData.allowed_verifications.split(",");

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Edit Company</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Response Message */}
              <MessageComponent error={error} success={success} />
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="name" className="form-label">
                    Company Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Company Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">{formErrors.name}</div>
                  )}
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="email" className="form-label">
                    Official Email Address <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${touched.email && formErrors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your Official Email address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, email: true }))
                    }
                  />
                  {touched.email && formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="phone_number" className="form-label">
                    Phone Number
                  </label>
                  <input
                    name="phone_number"
                    className={`form-control ${formErrors.phone_number ? "is-invalid" : ""}`}
                    value={formData.phone_number}
                    onChange={handleChange}
                    maxLength={10}
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        phone_number: true,
                      }))
                    }
                  />
                  {touched.phone_number && formErrors.phone_number && (
                    <div className="invalid-feedback">
                      {formErrors.phone_number}
                    </div>
                  )}
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="address" className="form-label">
                    Address <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    name="address"
                    className="form-control"
                    placeholder="Address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="gst_no" className="form-label">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gst_no"
                    className={`form-control ${gstError ? "is-invalid" : ""}`}
                    placeholder="GST Number"
                    value={formData.gst_no}
                    onChange={handleChange}
                    onBlur={(e) => {
                      const { name, value } = e.target;
                      const trimmed = value.trim().toUpperCase(); // Convert to uppercase for validation

                      setFormData({
                        ...formData,
                        [name]: trimmed,
                      });

                      // Set error if invalid GST
        if (trimmed === "") {
    setGstError(false); // No error for empty field
  } else {
    setGstError(!isValidGST(trimmed));
  }
                    }}
                  />
                  {gstError && (
                    <div className="invalid-feedback d-block">
                      Invalid GST Number. Please enter a valid one.
                    </div>
                  )}
                </div>

                {/*   <div className="mb-3 col-md-6">
                  <label htmlFor="package_id" className="form-label">
                    Package
                  </label>
                  <select
                    name="package_id"
                    className="form-select"
                    required
                    value={formData.package_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Package</option>
                    <option value="1">
                      All( PAN, Aadhaar, EPIC, Driving License, Passport )
                    </option>
                    <option value="2">Individual</option>
                  </select>
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="transaction_fee" className="form-label">
                    Transaction Fee
                  </label>
                  <input
                    type="number"
                    name="transaction_fee"
                    className="form-control"
                    placeholder="Transaction Fee"
                    required
                    value={formData.transaction_fee}
                    onChange={handleChange}
                    onBlur={(e) => {
                      const { name, value } = e.target;

                      let trimmedValue = value.trim();

                      // If it's a decimal like 0.1234, keep the leading 0
                      if (/^0\.\d+$/.test(trimmedValue)) {
                        // do nothing, keep as is
                      } else {
                        // Remove leading zeros, but preserve decimal portion
                        trimmedValue =
                          trimmedValue.replace(/^0+(?=\d)/, "") || "0";
                      }

                      setFormData({
                        ...formData,
                        [name]: trimmedValue,
                      });
                    }}
                  />
                </div>
                {formData.package_id === "" ? null : formData.package_id ==
                  2 ? (
                  <div className="mb-3 text-center">
                    <strong className="d-block mb-2">
                      Allowed Verifications
                    </strong>
                    <div className="d-flex justify-content-center flex-wrap gap-3">
                      {verificationOptions.map((item, index) => (
                        <div className="form-check" key={index}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`check-${index}`}
                            value={item}
                            checked={selectedVerifications.includes(item)}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`check-${index}`}
                          >
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 text-center col-md-12">
                    <span className="fw-semibold fs-5 text-success">
                      All verifications are selected by default ( PAN, Aadhaar,
                      EPIC, Driving License, Passport )
                    </span>
                  </div>
                )}

                <div className="mb-3 col-md-6">
                  <label htmlFor="discount_percent" className="form-label">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="discount_percent"
                    className="form-control"
                    placeholder="Discount Percentage"
                    required
                    value={formData.discount_percent}
                    onChange={handleChange}
                    onBlur={(e) => {
                      const { name, value } = e.target;

                      let trimmedValue = value.trim();

                      // If it's a decimal like 0.1234, keep the leading 0
                      if (/^0\.\d+$/.test(trimmedValue)) {
                        // do nothing, keep as is
                      } else {
                        // Remove leading zeros, but preserve decimal portion
                        trimmedValue =
                          trimmedValue.replace(/^0+(?=\d)/, "") || "0";
                      }

                      setFormData({
                        ...formData,
                        [name]: trimmedValue,
                      });
                    }}
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="transaction_gst" className="form-label">
                    Transaction GST (%)
                  </label>
                  <input
                    type="number"
                    name="transaction_gst"
                    className="form-control"
                    placeholder="Transaction GST"
                    required
                    value={formData.transaction_gst}
                    onChange={handleChange}
                    onBlur={(e) => {
                      const { name, value } = e.target;

                      let trimmedValue = value.trim();

                      // If it's a decimal like 0.1234, keep the leading 0
                      if (/^0\.\d+$/.test(trimmedValue)) {
                        // do nothing, keep as is
                      } else {
                        // Remove leading zeros, but preserve decimal portion
                        trimmedValue =
                          trimmedValue.replace(/^0+(?=\d)/, "") || "0";
                      }

                      setFormData({
                        ...formData,
                        [name]: trimmedValue,
                      });
                    }}
                  />
                </div> */}
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading ||gstError}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
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

export default EditfieldModal;
