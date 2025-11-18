import React from "react";

const AdharDetails = ({ user }) => {
  return (
    <div id="aadhaar_response" className="col-md-6 mb-4">
      <div className="p-3 shadow-sm rounded bg-light">
        {" "}
        {/* Simple box with padding and background */}
        <div className="d-flex align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0 me-2">Aadhaar With OTP</h5>
        </div>
        <div className="mt-2">
          <div className="col-md-6 text-center mb-3">
            {user?.aadhaar_response?.data?.profile_image ||
            user?.aadhaar_response?.result?.user_profile_image ? (
              <img
                src={`data:image/jpeg;base64,${
                  user?.aadhaar_response?.data?.profile_image ||
                  user?.aadhaar_response?.result?.user_profile_image
                }`}
                alt="Profile"
                className="img-thumbnail rounded"
                style={{ maxWidth: "150px", maxHeight: "150px" }}
              />
            ) : (
              <img
                src="/images/resource/no_user.png"
                alt="Profile"
                className="img-thumbnail rounded"
                style={{ maxWidth: "150px", maxHeight: "150px" }}
              />
            )}
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">Full Name:</span>
            <span className="text-break">
              {user?.aadhaar_response?.data?.full_name ||
                user?.aadhaar_response?.result?.user_full_name ||
                "N/A"}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">Aadhaar Number:</span>
            <span className="text-break">
              {user?.aadhaar_response?.data?.aadhaar_number ||
                user?.aadhaar_response?.result?.user_aadhaar_number ||
                "N/A"}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">DOB:</span>
            <span className="text-break">
              {user?.aadhaar_response?.data?.dob ||
                user?.aadhaar_response?.result?.user_dob ||
                "N/A"}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">Gender:</span>
            <span className="text-break">
              {user?.aadhaar_response?.data?.gender ||
                user?.aadhaar_response?.result?.user_gender ||
                "N/A"}
            </span>
          </div>
          <div className="d-flex mb-1">
            <span className="fw-bold me-2">Address:</span>
            <span className="text-break flex-grow-1">
              {[
                user?.aadhaar_response?.data?.address?.house ||
                  user?.aadhaar_response?.result?.user_address?.house,

                user?.aadhaar_response?.data?.address?.street ||
                  user?.aadhaar_response?.result?.user_address?.street,
                user?.aadhaar_response?.data?.address?.landmark ||
                  user?.aadhaar_response?.result?.user_address?.landmark,
                user?.aadhaar_response?.data?.address?.loc ||
                  user?.aadhaar_response?.result?.user_address?.loc,
                user?.aadhaar_response?.data?.address?.po ||
                  user?.aadhaar_response?.result?.user_address?.po,
                user?.aadhaar_response?.data?.address?.vtc ||
                  user?.aadhaar_response?.result?.user_address?.vtc,
                user?.aadhaar_response?.data?.address?.subdist ||
                  user?.aadhaar_response?.result?.user_address?.subdist,
                user?.aadhaar_response?.data?.address?.dist ||
                  user?.aadhaar_response?.result?.user_address?.dist,
                user?.aadhaar_response?.data?.address?.state ||
                  user?.aadhaar_response?.result?.user_address?.state,
                user?.aadhaar_response?.data?.address?.country ||
                  user?.aadhaar_response?.result?.user_address?.country,
              ]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </span>
          </div>

          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold me-2">Zipcode:</span>
            <span className="text-break">
              {user?.aadhaar_response?.data?.zip ||
                user?.aadhaar_response?.result?.address_zip ||
                "N/A"}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            {user.aadhar_image && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => window.open(user.aadhar_image, "_blank")}
              >
                View Document
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdharDetails;
