import { useState, useEffect } from "react";
import axios from "axios";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
const ContactInfoBox = ({ setActiveTab }) => {
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("employer_token");

  useEffect(() => {
    FetchDetails();
  }, [apiurl]);
  const FetchDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/companyprofile/get_contact_person`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setFormData({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          phone: response.data.data.phone || "",
          address: response.data.data.address || "",
        });
      } else {
        console.error("Failed to fetch details:", response.data.message);
      }
    } catch (error) {
      console.error("Error while fetching account details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "phone") {
      if (formData.phone.length !== 10) {
        setValidationErrors((prev) => ({
          ...prev,
          phone: "Phone number must be 10 digits.",
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let errorMsg = "";

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
      if (updatedValue.length !== 10) {
        errorMsg = "Phone number must be 10 digits.";
      }
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      const response = await axios.post(
        `${apiurl}/api/companyprofile/add_or_update_contact_person`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setError(null);
        setErrorId(null);
        setSuccess(response.data.message);
        setMessageId(Date.now());

        FetchDetails();

        setTimeout(() => {
          setActiveTab("kyc");
        }, 2000);
      } else {
        setError(response.data.message || "Something went wrong.");
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setErrorId(Date.now());
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = loading || submitting || validationErrors.phone;

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        errorId={errorId}
        message_id={message_id}
      />
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <CustomizedProgressBars />
        </div>
      )}
      <form className="default-form" onSubmit={handleSubmit}>
        <div className="row">
          {/* Name */}
          <div className="form-group col-lg-4 col-md-4">
            <label>
              Name{" "}
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Full Name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group col-lg-4 col-md-4">
            <label>
              Email{" "}
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="abcd@gmail.com"
              required
            />
          </div>

          {/* Your original Phone input block — unchanged */}
          <div className="form-group col-lg-4 col-md-4">
            <label>Phone Number</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <input
              type="text"
              name="phone"
              className={`form-control ${
                touched.phone && formErrors.phone ? "is-invalid" : ""
              }`}
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="1234567890"
              required
            />
            {validationErrors.phone && (
              <small className="text-danger">{validationErrors.phone}</small>
            )}
          </div>

          {/* Address */}
          <div className="form-group col-lg-12 col-md-12">
            <label>
              Complete Address{" "}
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </label>
            <textarea
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              style={{
                padding: "10px",
                resize: "vertical",
                minHeight: "2.5em",
                height: "auto",
              }}
              rows="2"
              placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="form-group col-lg-12 col-md-12">
            <button
              type="submit"
              className="theme-btn btn-style-one"
              disabled={isDisabled}
              style={{
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ContactInfoBox;
