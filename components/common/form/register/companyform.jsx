import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
//new component
import MessageComponent from "../../ResponseMsg";
import { Search } from "lucide-react";
import AutoDetectPhoneInput from "../phonenumber";
const FormContentcom = () => {
  const [formData, setFormData] = useState({
    cin_id: "",
    cin: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    setErrorId(null);
    setMessageId(null);

    try {
      const response = await axios.post(
        `${apiurl}/api/auth/company-register`,
        formData
      );
      console.log("Response:", response);
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
    } finally {
      setLoading(false);
    }
  };

  const handelcinsubmit = async () => {
    const regex =
      /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;
    if (regex.test(formData.cin)) {
      try {
        setLoading(true);
        setError(null);
        setErrorId(null);
        setSuccess(null);
        setMessageId(null);

        const response = await axios.post(
          `${apiurl}/api/companyprofile/search_company_by_cin`,
          {
            cin: formData.cin,
          }
        );
        if (response.data.success) {
          setFormData({
            ...formData,
            cin_id: response.data.data._id,
            cin: response.data.data.cinnumber,
            name: response.data.data.companyname,
            email: response.data.data.companyemail,
            phone_number: response.data.data.companyphone,
            address: response.data.data.companyaddress,
          });

          setError(null);
          setErrorId(null);
          setSuccess(response.data.message);
          setMessageId(Date.now());
        } else {
          setError("No Details Found Please Enter Valid CIN or Enter Manually");
          setErrorId(Date.now());
        }
      } catch (e) {
        setError("No Details Found Please Enter Valid CIN or Enter Manually");
        setErrorId(Date.now());
      } finally {
        setLoading(false);
      }
    } else {
      setError("Invalid CIN Please Enter Valid CIN or Enter Manually");
      setErrorId(Date.now());
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
        <label>Company CIN Number </label>
        <span className="text-danger ms-2">*</span>
        <div className="d-flex align-items-stretch gap-2">
          <input
            type="text"
            name="cin"
            placeholder="Enter company CIN"
            required
            value={formData.cin}
            onChange={handleChange}
            className="form-control"
            pattern="^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handelcinsubmit()}
          >
            <Search />
          </button>
        </div>
      </div>

      <div className="form-group mb-1">
        <label>Company Name</label>
        <span className="text-danger ms-2">*</span>
        <input
          type="text"
          name="name"
          placeholder="Name as per PAN"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      {/* name */}
      <div className="form-group mb-1">
        <label>Official Email Address</label>
        <span className="text-danger ms-2">*</span>
        <input
          type="email"
          name="email"
          placeholder="
        Enter your Official Email address"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      {/* Email */}

      <AutoDetectPhoneInput
        phone={formData.phone_number}
        setPhone={setPhone}
        setDisableSubmit={setDisableSubmit} // 👈 pass it down
      />
      {/* Phone */}

      <div className="form-group ">
        <label>Password</label>
        <span className="text-danger ms-2">*</span>
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
      {/* password */}

      <div className="form-group">
        <button
          className="theme-btn btn-style-one"
          type="submit"
          disabled={loading || disablesubmit} // 👈 still disables click
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
      {/* login */}
    </form>
  );
};

export default FormContentcom;
