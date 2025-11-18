import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";

import PanDetails from "./documents/pancard";
import AdharDetails from "./documents/adharcard";
import DlDetails from "./documents/dlcard";
import PassDetails from "./documents/passportcard";
import EpicDetails from "./documents/epiccard";
import { DocumentsTable } from "./documents/table";

const WidgetContentBox = () => {
  const [userid, setUserid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  // Extract user ID on the client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setUserid(params.get("id"));
    }
  }, []);

  // API call
  useEffect(() => {
    if (!userid) return; // Avoid making a request if there's no user ID

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${apiurl}/api/verify/verifiedDetails`,
          {
            id: userid, // Send in req.body
          }
        );
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userid, apiurl]);

  // Handle null user case
  const userData = user
    ? [
        { label: "Full Name", value: user.candidate_name || "" },
        {
          label: "Date of Birth",
          value: user.candidate_dob
            ? new Date(user.candidate_dob).toLocaleDateString("en-GB")
            : "",
        },
        { label: "Phone Number", value: user.candidate_mobile || "" },
        { label: "Email", value: user.candidate_email || "" },
        { label: "Address", value: user.candidate_address || "" },
        {
          label: "Gender",
          value: user.candidate_gender
            ? user.candidate_gender.charAt(0).toUpperCase() +
              user.candidate_gender.slice(1)
            : "",
        },
      ]
    : [];

  const handleClick = async (documentType) => {
    console.log("Clicked on:", documentType);

    // Find the element by ID and scroll to its top
    const element = document.getElementById(documentType);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth", // Smooth scroll
        block: "start", // Align to the start (top) of the element
        inline: "start", // Align to the start (left) of the element (if horizontally scrolled)
      });
    }
  };

  return (
    <div className="widget-content p-4 border rounded shadow-sm bg-white">
      <h4 className="mb-3 text-primary">
        Candidate Information
        <small style={{ fontSize: "12px", color: "black" }}>
          {" "}
          ( Order ID:{user?.order_id} )
        </small>
      </h4>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && user && (
        <>
          <form className="default-form">
            <div className="row">
              {userData.map((field, index) => (
                <div key={index} className="form-group col-md-4 mb-3">
                  <label className="fw-bold">{field.label}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={field.value}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </form>
          <div className="row">
            <h4 className="text-primary mb-3">
              Verification Details
              <small style={{ fontSize: "12px", color: "black" }}>
                {" "}
                ( Verified at:{" "}
                {new Date(user.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true, // for AM/PM, optional
                })}{" "}
                )
              </small>
            </h4>

            <div className="col-md-12 mb-3">
              <DocumentsTable user={user} handleclick={handleClick} />
            </div>

            {/* PAN */}
            {/* {
               user?.pan_response && ( */}

            <PanDetails user={user} />
            {/*    ) 
            }
 */}
            {/* passport */}
            {/*    {
              user?.passport_response && ( */}

            <PassDetails user={user} />

            {/*  )
        } */}
            {/* adhare */}
            {/* {
              user?.aadhar_response && ( */}

            <AdharDetails user={user} />

            {/*   )
            }
 */}

            {/* dl */}
            {/*  {
              user?.dl_response && (
 */}
            <DlDetails user={user} />

            {/*    )
            } */}

            {/* Epic */}
            {/*  {
              user?.epic_response && ( */}

            <EpicDetails user={user} />

            {/*  )
            } */}
          </div>
        </>
      )}
    </div>
  );
};

export default WidgetContentBox;
