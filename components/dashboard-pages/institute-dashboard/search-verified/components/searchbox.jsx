"use client";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import UsersList from "./UsersList";

const SearchBox = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("Admin_token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!searchQuery.trim()) {
      setError("Search query cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiurl}/api/verify/searchUserVerifiedList`,
        { keyword: searchQuery },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.users && response.data.users.length > 0) {
        setUsers(response.data.users);
        setSuccess("Results found!");
      } else {
        setUsers([]);
        setError("No results found.");
      }
    } catch (err) {
      setError("An error occurred while searching.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

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
                placeholder="Name, keywords, Email or Phone Number"
                className="form-control text-center"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
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

      {/* Child Component - Users List */}
      <UsersList users={users} />
    </div>
  );
};

export default SearchBox;
