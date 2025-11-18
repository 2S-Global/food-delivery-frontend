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
              <h5 className="modal-title">Add New Customer</h5>
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
                        Customer Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Customer Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3 col-md-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Customer Email <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Email Address"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3 col-md-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Customer phone Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Phone Number"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="description" className="form-label">
                      Customer Address <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      placeholder="Address"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add New Customer"}
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
