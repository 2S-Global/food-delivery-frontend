import React, { useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

import { useRouter } from "next/navigation";

import MessageComponent from "@/components/common/ResponseMsg";

const SearchBox = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("Admin_token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    alert("Form submitted successfully!");
  };

  return (
    <div className="widget-content">
      <div className="row">
        <form className="default-form" onSubmit={handleSubmit}>
          <MessageComponent error={error} success={success} />
          <div className="row d-flex justify-content-center align-items-center">
            <div className="form-group col-md-4 text-center">
              <input
                type="text"
                name="listing-search"
                placeholder="Name, keywords,Email or Phone Number"
                className="form-control text-center" // Center text inside input
              />
              <span
                className="icon flaticon-search-3"
                onClick={handleSubmit}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              ></span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;
