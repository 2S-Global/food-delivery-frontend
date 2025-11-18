import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import { Eye, EyeOff } from "lucide-react"; // Or any icon library you prefer

const AddInstituteModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
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
    check_role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
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

  const [showPassword, setShowPassword] = useState(false);
  const [gstError, setGstError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
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
    // try {
    //   const invite = await axios.post(
    //     `${apiurl}/api/invite/invite`,
    //     {
    //       email: formData.email,
    //       name: formData.name,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   console.log("invite response", invite);
    // } catch (err) {
    //   setError(err.invite?.data?.message || "Invite failed. Try again.");
    // }

    try {
      const response = await axios.post(
        `${apiurl}/api/companyRoutes/register`,
        {
          ...formData,
          role: 3,
        },
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
      window.location.reload();
      // router.push("/admin/listcompany");
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
              <h5 className="modal-title">Add New Institute</h5>
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
                    <label htmlFor="name" className="form-label">
                      Institute Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Institute Name"
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
                      Official Email Address{" "}
                      <span style={{ color: "red" }}>*</span>
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

                  {/* <div className="mb-4 col-md-6 position-relative">
                    <label htmlFor="password" className="form-label">
                      Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control pe-5"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <span
                        onClick={togglePasswordVisibility}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "15px",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#6c757d",
                        }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </span>
                    </div>
                  </div> */}

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

                  <div className="mb-3 col-md-6">
                    <label htmlFor="extra-role" className="form-label">
                      Company Role Include
                    </label>
                    <select
                      className="form-select"
                      id="extra-role"
                      name="check_role"
                      value={formData.check_role}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                        check_role: e.target.value === "true",
                        }))
                      }
                    >
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || gstError}
                >
                  {loading ? "Registering..." : "Register"}
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

export default AddInstituteModal;
