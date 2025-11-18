import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
//new component
import MessageComponent from "../../ResponseMsg";
import AutoDetectPhoneInput from "../phonenumber";
const FormContent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    setErrorId(null);
    setMessageId(null);

    //console.log(formData);

    try {
      const response = await axios.post(
        `${apiurl}/api/auth/register`,
        formData
      );

      //check if response is successful
      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }
      setSuccess(response.data.message || "Registration successful!");
      setMessageId(Date.now());
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const setPhone = (phone) => {
    setFormData({ ...formData, phone_number: phone });
  };
  const [disablesubmit, setDisableSubmit] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {/* display error */}
      <MessageComponent
        error={error}
        success={success}
        errorId={errorId}
        message_id={message_id}
      />

      <div className="form-group mb-1">
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group mb-1">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      {/* <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
      </div> */}

      <AutoDetectPhoneInput
        phone={formData.phone_number}
        setPhone={setPhone}
        setDisableSubmit={setDisableSubmit}
      />
      {/* Phone */}

      <div className="form-group ">
        <label>Password</label>
        <input
          id="password-field"
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {/*  {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>} */}

      <div className="form-group">
        <button
          className="theme-btn btn-style-one"
          type="submit"
          disabled={loading || disablesubmit}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
};

export default FormContent;
