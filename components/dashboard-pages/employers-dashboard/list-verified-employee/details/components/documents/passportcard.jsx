import React from "react";

const PassDetails = ({ user }) => {
  return (
    <div id="passport_response" className="col-md-4 mb-4 ">
      <div className="p-3 shadow-sm rounded bg-light">
        {" "}
        {/* Simple box with padding and background */}
        <div className="d-flex align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0 me-2">PASSPORT</h5>
          <img
            src={
              !user?.passport_response
                ? "/images/resource/na.png"
                : user?.passport_response?.response_code == 100
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt={
              !user?.passport_response
                ? "N/A"
                : user?.passport_response?.response_code == 100
                  ? "Verified"
                  : "Not Verified"
            }
            style={{ width: "100px", height: "20px" }}
          />
        </div>
        <div className="mt-2">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">Full Name:</span>
            <span className="text-break">
              {user?.passport_response?.result.name_on_passport}
              {user?.passport_response?.result.customer_last_name || "N/A"}
            </span>
          </div>

          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">Passport File Number:</span>
            <span className="text-break">
              {user?.passport_response?.result.passport_number || "N/A"}
            </span>
          </div>

          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">Passport Applied Date:</span>
            <span className="text-break">
              {user?.passport_response?.result.passport_applied_date || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PassDetails;
