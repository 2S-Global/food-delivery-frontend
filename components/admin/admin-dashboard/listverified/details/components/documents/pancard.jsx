import React from "react";

const PanDetails = ({ user }) => {
  return (
    <div className="col-md-4 mb-4 " id="pan_response">
      <div className="p-3 shadow-sm rounded bg-light">
        {/* Simple box with padding and background */}
        <div className="d-flex align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0 me-2">PAN</h5>
          <img
            src={
              !user?.pan_response
                ? "/images/resource/na.png"
                : user?.pan_response?.response_code == 100
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt={
              !user?.pan_response
                ? "N/A"
                : user?.pan_response?.response_code == 100
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
              {user?.pan_response?.result?.user_full_name || "N/A"}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">PAN Number:</span>
            <span className="text-break">
              {user?.pan_response?.result?.pan_number || "N/A"}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">Type:</span>
            <span className="text-break">
              {user?.pan_response?.result?.pan_type || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PanDetails;
