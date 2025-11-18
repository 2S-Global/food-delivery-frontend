import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import { useSearchParams } from "next/navigation";
const AddfieldModal = ({ show, onClose }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    company_id: id,
    name: "",
    field_type: "",
    field_values: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    try {
      const response = await axios.post(
        `${apiurl}/api/fields/add_fields`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }

      setSuccess(response.data.message);
      router.push(`/admin/company-setting?id=${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
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
              <h5 className="modal-title">Add New Field</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Response Message */}
                <MessageComponent error={error} success={success} />

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Field Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your Field Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="field_type" className="form-label">
                    Field Type
                  </label>
                  <select
                    name="field_type"
                    className="form-control"
                    required
                    value={formData.field_type}
                    onChange={handleChange}
                  >
                    <option value="">Select Field Type</option>
                    <option value="text">Text</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="select">Drop Down</option>
                    <option value="textarea">Textarea</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="field_values" className="form-label">
                    Field Values (comma separated for multiple values)
                  </label>
                  <input
                    type="text"
                    name="field_values"
                    className="form-control"
                    placeholder="Enter your Field Values"
                    value={formData.field_values}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "ADD FIELD"}
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

export default AddfieldModal;
