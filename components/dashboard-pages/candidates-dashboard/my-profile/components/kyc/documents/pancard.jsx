import React from "react";

const PanDetails = () => {
  const user = {
    pan_response: {
      response_code: 100,
      response_message: "Verified",
      result: {
        pan_number: "BHRPB7921G",
        pan_status: "VALID",
        user_full_name: "MRINMOY BOSE",
        name_match_score: "100.00",
        pan_type: "Person",
      },
    },
  };

  return (
    <div className="container my-4">
      <div className="col-12">
        <div className="p-4 shadow rounded bg-white border">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="fw-bold text-dark mb-0">PAN Details</h4>
            <img
              src={
                !user?.pan_response
                  ? "/images/resource/na.png"
                  : user?.pan_response?.response_code === 100
                    ? "/images/resource/verified.png"
                    : "/images/resource/unverified.png"
              }
              alt={
                !user?.pan_response
                  ? "N/A"
                  : user?.pan_response?.response_code === 100
                    ? "Verified"
                    : "Not Verified"
              }
              style={{ width: "120px", height: "auto" }}
            />
          </div>

          {/* Info section */}
          <div className="mt-3">
            <div className="mb-2">
              <span className="fw-semibold text-secondary">Full Name:</span>{" "}
              <span className="fw-bold">
                {user?.pan_response?.result?.user_full_name || "N/A"}
              </span>
            </div>

            <div className="mb-2">
              <span className="fw-semibold text-secondary">PAN Number:</span>{" "}
              <span className="fw-bold text-primary">
                {user?.pan_response?.result?.pan_number || "N/A"}
              </span>
            </div>

            <div className="mb-2">
              <span className="fw-semibold text-secondary">Type:</span>{" "}
              <span className="fw-bold">
                {user?.pan_response?.result?.pan_type || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanDetails;
