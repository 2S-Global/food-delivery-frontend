import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

const EditfieldModal = ({ show, onClose, field }) => {
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  console.log("data sent to edit", field);
  const [formData, setFormData] = useState({
    name: "",
    allowed_verifications: "",
    transaction_fee: "",
    transaction_gst: 18,
    description: "",
    package_id: "2",
    discount_percent: "",
    expiryDate: "",
    id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name || "",
        allowed_verifications: field.allowed_verifications || "",
        transaction_fee: field.transaction_fee || "",
        transaction_gst: field.transaction_gst || 18,
        description: field.description || "",
        package_id: field.package_id || "2",
        discount_percent: field.discount_percent || "",
        id: field._id || "",
        expiryDate: field.expiryDate || "",
      });
    }
  }, [field]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumberTrim = (name, value) => {
    let trimmed = value.trim();
    if (!/^0\.\d+$/.test(trimmed)) {
      trimmed = trimmed.replace(/^0+(?=\d)/, "") || "0";
    }
    setFormData((prev) => ({
      ...prev,
      [name]: trimmed,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const current = formData.allowed_verifications
      ? formData.allowed_verifications.split(",").map((v) => v.trim())
      : [];

    const updated = checked
      ? [...new Set([...current, value])]
      : current.filter((item) => item !== value);

    setFormData((prev) => ({
      ...prev,
      allowed_verifications: updated.join(", "),
    }));
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

    if (
      !formData.allowed_verifications ||
      formData.allowed_verifications.split(",").length === 0
    ) {
      setError("Please select at least one allowed verification.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiurl}/api/pacakageRoute/updatePackage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      window.location.reload();
      router.push("/admin/listcompany");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const verificationOptions = [
    "PAN",
    "Aadhaar",
    "EPIC",
    "DL",
    "Passport",
    "UAN",
  ];
  const selectedVerifications = formData.allowed_verifications
    .split(",")
    .map((item) => item.trim());

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Package</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <MessageComponent error={error} success={success} />

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    Package Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="mb-3 col-md-6">
                  <label className="form-label" htmlFor="expiryDate">
                    Validity Days
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="expiryDate"
                    value={formData.expiryDate}
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

                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    Description <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="mb-3 text-center">
                  <strong className="d-block mb-2">
                    Allowed Verifications{" "}
                    <span style={{ color: "red" }}>*</span>
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

                <div className="mb-3 col-md-6">
                  <label className="form-label">Transaction Fee</label>
                  <input
                    type="number"
                    name="transaction_fee"
                    className="form-control"
                    required
                    value={formData.transaction_fee}
                    onChange={handleChange}
                    onBlur={(e) =>
                      handleNumberTrim("transaction_fee", e.target.value)
                    }
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">Transaction GST (%)</label>
                  <input
                    type="number"
                    name="transaction_gst"
                    className="form-control"
                    required
                    value={formData.transaction_gst}
                    onChange={handleChange}
                    onBlur={(e) =>
                      handleNumberTrim("transaction_gst", e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>

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
