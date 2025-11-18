import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import { Eye, EyeOff } from "lucide-react"; // Or any icon library you prefer
import DatePicker from "react-datepicker";
const AddCompanyModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    transaction_fee: 0,
    transaction_gst: 18,
    allowed_verifications: "",
    discount_percent: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const handleDateChange = (date) => {
    if (date) {
      setFormData({ ...formData, expiryDate: date }); // Store raw Date object
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let current = formData.allowed_verifications
      ? formData.allowed_verifications.split(",")
      : [];

    if (checked) {
      current.push(value);
    } else {
      current = current.filter((item) => item !== value);
    }

    setFormData({
      ...formData,
      allowed_verifications: current.join(","),
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
      return;
    }

      if (!formData.allowed_verifications || formData.allowed_verifications.split(",").length === 0) {
    setError("Please select at least one allowed verification.");
    setLoading(false);
    return;
  }

    try {
      const response = await axios.post(
        `${apiurl}/api/pacakageRoute/addPackage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
      window.location.reload();
      router.push("/admin/listpackage");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Modal Overlay */}
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
              <h5 className="modal-title">Add New Package</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body row">
              <form onSubmit={handleSubmit}>
                {/* Response Message */}
                <MessageComponent error={error} success={success} />
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Package Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Package Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/*     <div className="mb-3 col-md-6">
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
                    <label htmlFor="description" className="form-label">
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      placeholder="Description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <div className="mb-3 text-center col-md-12">
                    <strong className="d-block mb-2">
                      Allowed Verification <span style={{ color: "red" }}>*</span>
                    </strong>
                    <div className="d-flex justify-content-center flex-wrap gap-3">
                      {["PAN", "Aadhaar", "EPIC", "DL", "Passport", "UAN"].map(
                        (item, index) => (
                          <div className="form-check" key={index}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`check-${index}`}
                              value={item}
                              onChange={handleCheckboxChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`check-${index}`}
                            >
                              {item}
                            </label>
                          </div>
                        )
                      )}
                    </div>
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
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add New Package"}
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
    </>
  );
};

export default AddCompanyModal;
