import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import DocumentUpload from "./document";
import { useRouter } from "next/navigation";
import { format } from "date-fns"; // Import from date-fns

import MessageComponent from "@/components/common/ResponseMsg";

const WidgetContentBox = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: null,
    phone: "",
    email: "",
    address: "",
    gender: "",
    panname: "",
    aadhaarname: "",
    votername: "",
    licensename: "",
    passportname: "",
    pannumber: "",
    aadhaarnumber: "",
    voternumber: "",
    licensenumber: "",
    passportnumber: "",
    pandoc: null,
    aadhaardoc: null,
    voterdoc: null,
    licensenumdoc: null,
    passportdoc: null,
  });

  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("Admin_token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData({ ...formData, dob: date }); // Store raw Date object
    }
  };

  const handleFileChange = (docType, file) => {
    setFormData((prevData) => ({
      ...prevData,
      [`${docType}doc`]: file || null, // Ensure null when file is removed
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else if (formData[key] instanceof Date) {
        formDataToSend.append(key, format(formData[key], "yyyy-MM-dd")); // Convert Date to string
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `${apiurl}/api/usercart/add_user_cart`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess(response.data.message);
        router.push("/employers-dashboard/paynow");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fileId = "upload-passport";

  const [documentData, setDocumentData] = useState({
    docName: "",
    docNumber: "",
    file: null,
    filePreview: null,
  });
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setDocumentData({
        ...documentData,
        file,
        filePreview: fileURL,
      });

      if (onFileChange) {
        onFileChange(name, file);
      }
    }
  };

  return (
    <div className="widget-content">
      <div className="col-lg-12 col-md-12 py-2">
        <h5>
          <strong>Add Employee Details</strong>
        </h5>
      </div>

      <div className="row">
        <form className="default-form" onSubmit={handleSubmit}>
          <MessageComponent error={error} success={success} />
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <h5
                className="text-center mb-2"
                style={{ textDecoration: "underline" }}
              >
                Personal Details
              </h5>
            </div>

            {/* Full Name */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label>
                Full Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label>
                Date of Birth <span style={{ color: "red" }}>*</span>
              </label>
              <DatePicker
                selected={formData.dob ? new Date(formData.dob) : null}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label>Phone Number</label>
              <input
                type="number"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label>
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label>Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Gender */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label>Gender</label>
              <select
                className="form-control"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Document Uploads */}
          <DocumentUpload
            label="PAN"
            name="pan"
            fileId="upload-pan"
            valuename={formData.panname}
            numbername={formData.pannumber}
            onFileChange={handleFileChange}
            onfieldChange={handleChange}
          />

          <div className="row">
            {/* Heading */}
            {/* Name Input */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label>Passport Name</label>
              <input
                type="text"
                name="passportname"
                placeholder="Enter Name on Passport"
                className="form-control"
                value={formData.passportname}
                onChange={handleChange}
              />
            </div>

            {/* Document Number Input passportnumber */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label>Passport File Number</label>
              <input
                type="text"
                name="passportnumber"
                placeholder="Enter Name on Passport"
                className="form-control"
                value={formData.passportnumber}
                onChange={handleChange}
              />
            </div>

            {/* File Upload */}
            <div className="form-group col-lg-4 col-md-4 d-flex flex-column">
              <label htmlFor={fileId}>Upload Passport File</label>
              <div className="uploadButton d-flex align-items-center">
                <input
                  className="uploadButton-input"
                  type="file"
                  name="file"
                  accept="image/*,application/pdf"
                  id={fileId}
                  onChange={handleFileSelect}
                />
                <label
                  className="uploadButton-button ripple-effect"
                  htmlFor={fileId}
                  style={{ width: "100%", height: "40px", cursor: "pointer" }}
                >
                  {documentData.file ? (
                    <span
                      onClick={() =>
                        window.open(documentData.filePreview, "_blank")
                      }
                    >
                      {documentData.file.name}
                    </span>
                  ) : (
                    `Browse Passport File`
                  )}
                </label>
              </div>
            </div>
          </div>

          <DocumentUpload
            label="Aadhaar"
            name="aadhaar"
            fileId="upload-aadhaar"
            valuename={formData.aadhaarname}
            numbername={formData.aadhaarnumber}
            onFileChange={handleFileChange}
            onfieldChange={handleChange}
          />
          <DocumentUpload
            label="Driving License"
            name="license"
            fileId="upload-license"
            valuename={formData.licensename}
            numbername={formData.licensenumber}
            onFileChange={handleFileChange}
            onfieldChange={handleChange}
          />

          <DocumentUpload
            label="Epic (Voter)"
            name="voter"
            fileId="upload-voter"
            valuename={formData.votername}
            numbername={formData.voternumber}
            onFileChange={handleFileChange}
            onfieldChange={handleChange}
          />

          {/* Submit Button */}
          <div className="form-group">
            <button
              className="theme-btn btn-style-one"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WidgetContentBox;
