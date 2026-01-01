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
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const [industries, setIndustry] = useState([]);
  const [company_type_list, setCompanyTypeList] = useState([]);

  const [disableform, setDisableform] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message_id, setMessageId] = useState(null);

  const [needcin, setNeedcin] = useState(false);

  const [formdata, setFormdata] = useState({
    _id: "",
    email: "",
    phone: "",
    facebook_link: "",
    twitter_link: "",
    short_description: "",
    address: "",
    logo: null,
    logo_preview: null,
  });

  // =============================================================
  // Load token & fetch data only after token is available
  // =============================================================
  useEffect(() => {
    const token = localStorage.getItem("Super_token");
    if (!token) return;

    fetchindustries();
    fetchcompanylist();
    FetchCompanyDetails(token);
  }, []);

  // =============================================================
  // FETCH COMPANY CONTACT DATA
  // =============================================================
  const FetchCompanyDetails = async (token) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${apiurl}/api/userdata/list-contact-details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.data.length > 0) {

        const data = response.data.data[0];  // << Fix: take first object

        setFormdata((prev) => ({
          ...prev,
          _id: data._id || "",
          email: data.email || "",
          phone: data.phone_number || "",                 // map correctly
          facebook_link: data.social_links?.facebook || "",
          twitter_link: data.social_links?.twitter || "",
          short_description: data.short_description || "",
          address: data.address || "",
          logo_preview: data.logo || null,
        }));
      }

    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  // =============================================================
  // OTHER DATA FETCHING
  // =============================================================
  const fetchcompanylist = async () => {
    try {
      const response = await axios.get(`${apiurl}/api/companyprofile/get_company_types`);
      if (response.data.success) {
        setCompanyTypeList(response.data.data);
      }
    } catch (error) { }
  };

  const fetchindustries = async () => {
    try {
      const response = await axios.get(`${apiurl}/api/sql/dropdown/get_industry`);
      if (response.data.success) {
        setIndustry(response.data.data.map((i) => ({ value: i.id, label: i.job_industry })));
      }
    } catch (e) {
      console.log("Industries fetch error:", e);
    }
  };

  // =============================================================
  // HANDLE SUBMIT
  // =============================================================
  const handelsubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("Super_token");
    setLoading(true);
    setSubmitting(true);

    try {

      // const payload = new FormData();
      // Object.keys(formdata).forEach((key) => payload.append(key, formdata[key]));

      const payload = {
        email: formdata.email,
        phone_number: formdata.phone,                      // backend key
        address: formdata.address,
        short_description: formdata.short_description,
        // social_links: {
        //   facebook: formdata.facebook_link,
        //   twitter: formdata.twitter_link,
        // },
        facebook_link: formdata.facebook_link,
        twitter_link: formdata.twitter_link,
        logo: formdata.logo, // If file is uploaded handle separately
      };

      const response = await axios.put(
        `${apiurl}/api/userdata/edit-contact-details/${formdata._id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        setMessageId(Date.now());

        setTimeout(() => setActiveTab("account"), 2000);
      }
    } catch (e) {
      setError("Error Saving Details. Try Again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // =============================================================
  // UI STARTS
  // =============================================================

  return (
    <>
      <MessageComponent error={error} success={success} errorId={errorId} message_id={message_id} />

      {loading && (
        <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 1050 }}>
          <CustomizedProgressBars />
        </div>
      )}

      <form className="default-form" onSubmit={handelsubmit}>

        <div className="row" style={{ pointerEvents: disableform ? "none" : "auto", opacity: disableform ? 0.5 : 1 }}>

          <div className="form-group col-lg-6">
            <label>Email</label>
            <input type="email" value={formdata.email} onChange={(e) => setFormdata({ ...formdata, email: e.target.value })} required />
          </div>

          <div className="form-group col-lg-6">
            <label>Phone</label>
            <input type="text" value={formdata.phone} onChange={(e) => setFormdata({ ...formdata, phone: e.target.value })} required />
          </div>

          <div className="form-group col-lg-6">
            <label>Facebook Link</label>
            <input type="url" value={formdata.facebook_link} onChange={(e) => setFormdata({ ...formdata, facebook_link: e.target.value })} required />
          </div>

          <div className="form-group col-lg-6">
            <label>Twitter Link</label>
            <input type="url" value={formdata.twitter_link} onChange={(e) => setFormdata({ ...formdata, twitter_link: e.target.value })} required />
          </div>

          <div className="form-group col-lg-12">
            <label>Short Description</label>
            <textarea rows="2" value={formdata.short_description} onChange={(e) => setFormdata({ ...formdata, short_description: e.target.value })} required />
          </div>

          <div className="form-group col-lg-12">
            <label>Address</label>
            <textarea rows="2" value={formdata.address} onChange={(e) => setFormdata({ ...formdata, address: e.target.value })} required />
          </div>

          <LogoCoverUploader formdata={formdata} setFormdata={setFormdata} />

          <button className="theme-btn btn-style-one" disabled={loading || submitting}>
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>

      </form>
    </>
  );
};

export default FormInfoBox;
