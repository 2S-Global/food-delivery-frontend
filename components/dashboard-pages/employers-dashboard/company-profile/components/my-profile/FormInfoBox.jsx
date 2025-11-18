"use client";

import Select from "react-select";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import LogoCoverUploader from "./LogoCoverUploader";
import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg";
import axios from "axios";

import { Search } from "lucide-react";

const FormInfoBox = ({ setActiveTab }) => {
  const [industries, setIndustry] = useState([]);
  const [disableform, setDisableform] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("employer_token");

  useEffect(() => {
    fetchindustries();
    FetchCompanyDetails();
  }, [apiurl]);

  const [formdata, setFormdata] = useState({
    cin_id: "",
    cin: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    established: "",
    teamsize: "",

    industry_type: [],
    allowinsearch: true,
    about: "",
    logo: null,
    cover: null,
    logo_preview: null,
    cover_preview: null,
  });
  const fetchindustries = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/get_industry `
      );
      if (response.data.success) {
        const formatted = response.data.data.map((item) => ({
          value: item.id,
          label: item.job_industry,
        }));
        setIndustry(formatted);
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };
  const handelcinsubmit = async () => {
    const regex =
      /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;
    if (regex.test(formdata.cin)) {
      try {
        setDisableform(true);
        setLoading(true);
        setError(null);
        setErrorId(null);
        setSuccess(null);
        setMessageId(null);

        const response = await axios.post(
          `${apiurl}/api/companyprofile/search_company_by_cin`,
          {
            cin: formdata.cin,
          }
        );
        if (response.data.success) {
          setFormdata({
            ...formdata,
            cin_id: response.data.data._id,
            cin: response.data.data.cinnumber,
            name: response.data.data.companyname,
            email: response.data.data.companyemail,
            phone: response.data.data.companyphone,
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
        setDisableform(false);
      }
    } else {
      setError("Invalid CIN Please Enter Valid CIN or Enter Manually");
      setErrorId(Date.now());
    }
  };

  const FetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/companyprofile/get_company_details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const data = response.data.data;

        const updatedFormData = {
          ...formdata,
          cin_id: data.cin_id || "",
          cin: data.cin || "",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          website: data.website || "",
          established: data.established || "",
          teamsize: data.teamsize || "",
          industry_type: data.industry_type
            ?.split(",")
            .map((item) => parseInt(item.trim(), 10)),
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
    console.log(formdata);
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);
    try {
      const payload = new FormData();
      for (const key in formdata) {
        if (formdata[key] !== null && formdata[key] !== undefined) {
          payload.append(key, formdata[key]);
        }
      }

      const response = await axios.post(
        `${apiurl}/api/companyprofile/add_or_update_company`,
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

        //wait for 2 seconds then setActiveTab= "account"
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
        <div className="form-group">
          <label className="mb-1">CIN</label>
          <span className="text-danger ms-1">*</span>
          <div className="d-flex align-items-stretch gap-2">
            <input
              type="text"
              name="cin"
              placeholder="Enter company CIN"
              value={formdata.cin}
              onChange={(e) =>
                setFormdata({ ...formdata, cin: e.target.value })
              }
              required
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

            <button
              type="button"
              className="btn btn-warning"
              onClick={() => setDisableform(false)}
            >
              Enter Manually
            </button>
          </div>
        </div>

        <div
          className="row"
          style={{
            pointerEvents: disableform ? "none" : "auto",
            opacity: disableform ? 0.5 : 1,
          }}
        >
          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Company name</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <input
              type="text"
              name="name"
              placeholder="Enter company name"
              value={formdata.name}
              onChange={(e) =>
                setFormdata({ ...formdata, name: e.target.value })
              }
              required
            />
          </div>

          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Email address</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <input
              type="email"
              name="name"
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
              name="name"
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
              name="name"
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
            <label>Team Size</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <select
              className="chosen-single form-select"
              required
              value={formdata.teamsize}
              onChange={(e) =>
                setFormdata({ ...formdata, teamsize: e.target.value })
              }
            >
              <option value="less_than_50">Less than 50</option>
              <option value="50_100">50 - 100</option>
              <option value="101_500">101 - 500</option>
              <option value="501_1000">501 - 1000</option>
              <option value="more_than_1000">More than 1000</option>
            </select>
          </div>

          {/* <!-- Search Select --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Industry Type</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <Select
              isMulti
              required
              name="industry"
              options={industries}
              className="basic-multi-select"
              classNamePrefix="select"
              value={industries.filter((opt) =>
                formdata.industry_type?.includes(opt.value)
              )}
              onChange={(selectedOptions) =>
                setFormdata({
                  ...formdata,
                  industry_type: selectedOptions.map((option) => option.value),
                })
              }
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

          {/* <!-- About Company --> */}
          <div className="form-group col-lg-12 col-md-12">
            <label>About Company</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <textarea
              className="form-control"
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
            <label>Company Address</label>
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
            <textarea
              className="form-control"
              required
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
