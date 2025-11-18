"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import LogoCoverUploader from "./LogoCoverUploader";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import axios from "axios";

import CourseSelect from "./CourseSelect";

const FormInfoBox = ({ setActiveTab }) => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("Institute_token");

  useEffect(() => {
    FetchCompanyDetails();
  }, [apiurl]);

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    established: "",
    courses: [],
    allowinsearch: true,
    about: "",
    logo: null,
    cover: null,
    logo_preview: null,
    cover_preview: null,
  });

  const FetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/instituteprofile/get_company_details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const data = response.data.data;

        const updatedFormData = {
          ...formdata,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          website: data.website || "",
          established: data.established || "",

          courses: data.courses || [],
          allowinsearch: data.allowinsearch || true,
          about: data.about || "",
          logo_preview: data.logo || "",
          cover_preview: data.cover || "",
        };

        setFormdata(updatedFormData);

        setDisableform(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formdata.logo_preview) {
      console.log("Updated formdata.logo_preview:", formdata.logo_preview); // ✅ Correct place
    }
  }, [formdata.logo_preview]);

  const handelsubmit = async (e) => {
    e.preventDefault();
    console.log("FormData before submit:", formdata);

    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      const payload = new FormData();

      for (const key in formdata) {
        const value = formdata[key];

        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            // Arrays (like courses) → stringify
            payload.append(key, JSON.stringify(value));
          } else if (value instanceof Date) {
            // Date objects → ISO string
            payload.append(key, value.toISOString());
          } else if (value instanceof File || value instanceof Blob) {
            // Files → append directly
            payload.append(key, value);
          } else if (typeof value === "object") {
            // Any other plain object → stringify
            payload.append(key, JSON.stringify(value));
          } else {
            // Primitives (string, number, boolean) → append directly
            payload.append(key, value);
          }
        }
      }

      const response = await axios.post(
        `${apiurl}/api/instituteprofile/add_or_update_company`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setError(null);
        setErrorId(null);
        setSuccess(response.data.message);
        setMessageId(Date.now());

        // wait for 2 seconds then setActiveTab= "account"
        setTimeout(() => {
          setActiveTab("account");
        }, 2000);
      }
    } catch (error) {
      setError("Error Saving Details Please Try Again");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const Deletecover = async () => {
    // Reset previous states
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);
    setLoading(true);

    try {
      const response = await axios.delete(
        `${apiurl}/api/companyprofile/delete_cover_photo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update the form state
        setFormdata((prev) => ({
          ...prev,
          cover_preview: null,
        }));

        // Show success
        setSuccess("Cover photo deleted");
        setMessageId(Date.now());
      } else {
        setError("Failed to delete cover photo");
        setErrorId(Date.now());
      }
    } catch (error) {
      setError("Failed to delete cover photo Please Try Again");
      setMessageId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || submitting || (!formdata.logo && !formdata.logo_preview);

  return (
    <>
      <style>
        {`
  .custom-textarea::placeholder {
    color: #c7c5c5!important;
    font-size: 15px !important;
  
  }
      .suggestion-btn {
            
            bottom: -0px;
            left: 10;
            display: flex;
            align-items: center;
            gap: 5px;
            background-color: #e8f0fe;
            color: #1a73e8;
            border-radius: 20px;
            padding: 6px 12px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }

          .suggestion-btn:hover {
            background-color: #d2e3fc;
          }

          .suggestion-btn svg {
            width: 16px;
            height: 16px;
          }
`}
      </style>
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

      <form
        className="default-form"
        onSubmit={handelsubmit}
        type="multipart/form-data"
        method="post"
      >
        <div className="row">
          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Institute Name</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <input
              type="text"
              name="name"
              placeholder="Enter institute name"
              value={formdata.name}
              onChange={(e) =>
                setFormdata({ ...formdata, name: e.target.value })
              }
              required
            />
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Email Address</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formdata.email}
              onChange={(e) =>
                setFormdata({ ...formdata, email: e.target.value })
              }
              required
            />
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Phone</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <input
              type="text"
              name="mobile"
              placeholder="0 123 456 7890"
              value={formdata.phone}
              onChange={(e) =>
                setFormdata({ ...formdata, phone: e.target.value })
              }
              required
            />
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Website</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <input
              type="url"
              name="website"
              placeholder="https://www.example.com"
              value={formdata.website}
              onChange={(e) =>
                setFormdata({ ...formdata, website: e.target.value })
              }
              required
            />
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12 d-flex flex-column">
            <label>
              Est. Since
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </label>

            <DatePicker
              selected={
                formdata.established ? new Date(formdata.established) : null
              }
              onChange={(date) =>
                setFormdata({ ...formdata, established: date })
              }
              dateFormat="dd/MM/yyyy"
              className="form-control"
              required
            />
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Allow In Search & Listing</label>
            <select
              className="chosen-single form-select"
              value={formdata.searchlisting}
              onChange={(e) =>
                setFormdata({ ...formdata, searchlisting: e.target.value })
              }
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          {/* <!-- Search Select --> */}
          <CourseSelect formdata={formdata} setFormdata={setFormdata} />

          {/* <!-- About Company --> */}
          <div className="form-group col-lg-12 col-md-12">
            <label>About Institute</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <textarea
              className="form-control"
              name="about"
              required
              style={{
                padding: "10px",
                minheight: "2.5em",
                height: "auto",
                resize: "vertical", // allow only vertical resizing
                minHeight: "2.5em", // ensures 1 row minimum height (adjust as needed)
              }}
              rows="2"
              value={formdata.about}
              onChange={(e) =>
                setFormdata({ ...formdata, about: e.target.value })
              }
              placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present"
            ></textarea>
          </div>
          {/* Company  Address*/}
          <div className="form-group col-lg-12 col-md-12">
            <label>Institute Address</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <textarea
              className="form-control"
              required
              name="address"
              style={{
                padding: "10px",
                minheight: "2.5em",
                height: "auto",
                resize: "vertical", // allow only vertical resizing
                minHeight: "2.5em", // ensures 1 row minimum height (adjust as needed)
              }}
              rows="2"
              value={formdata.address}
              onChange={(e) =>
                setFormdata({ ...formdata, address: e.target.value })
              }
              placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present"
            ></textarea>
          </div>

          <LogoCoverUploader
            formdata={formdata}
            setFormdata={setFormdata}
            Deletecover={Deletecover}
          />
          {/* End logo and cover photo components */}

          <button
            className="theme-btn btn-style-one"
            type="submit"
            disabled={isDisabled}
            style={{
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
          >
            {loading || submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default FormInfoBox;
