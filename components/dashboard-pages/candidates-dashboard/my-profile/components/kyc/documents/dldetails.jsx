import React from "react";

const DlDetails = ({ user }) => {
  return (
    <div className="p-4">
      <div className="p-3 shadow-sm rounded bg-light row">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0 me-2">Driving License</h5>
          {user?.dl_response?.response_code === "100" ? (
            <img
              src="/images/resource/verified.png"
              alt="Verified"
              style={{ width: "100px", height: "20px" }}
            />
          ) : (
            <img
              src="/images/resource/unverified.png"
              alt="Not Verified"
              style={{ width: "100px", height: "20px" }}
            />
          )}
        </div>

        {/* Details */}
        <div className="row">
          <div className="col-12 col-md-4 mb-2">
            <span className="fw-bold me-2">Full Name:</span>
            <span className="text-break fw-normal">
              {user?.dl_response?.result?.user_full_name || "N/A"}
            </span>
          </div>
          <div className="col-12 col-md-4 mb-2">
            <span className="fw-bold me-2">DL Number:</span>
            <span className="text-break fw-normal">
              {user?.dl_response?.result?.dl_number || "N/A"}
            </span>
          </div>
          <div className="col-12 col-md-4 mb-2">
            <span className="fw-bold me-2">Verified At:</span>
            <span className="text-break fw-normal">
              {user?.pan_response?.response_timestamp
                ? new Date(
                    user.pan_response.response_timestamp,
                  ).toLocaleDateString("en-GB")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DlDetails;
