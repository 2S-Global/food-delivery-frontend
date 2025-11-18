import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

const EditfieldModal = ({ show, onClose, field }) => {
  const [formData, setFormData] = useState({
    name: field?.name || "",
    field_type: field?.field_type || "",
    field_values: field?.field_values || "",
    id: field?._id || "",
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
        `${apiurl}/api/fields/edit_fields`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setSuccess(response.data.message);

      if (response.status == 200) {
        window.location.reload();
        console.log("200 st");
        onClose;
      }

      //router.push(`/admin/company-setting?id=${field.company_id}`);
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
              <h5 className="modal-title">Edit Field</h5>
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
                    <option value="select">Select</option>
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
                  {loading ? "Updating..." : "Update FIELD"}
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

export default EditfieldModal;
