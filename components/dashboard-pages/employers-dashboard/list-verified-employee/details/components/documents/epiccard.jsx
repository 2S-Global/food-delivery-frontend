import React from "react";

const EpicDetails = ({ user }) => {
  const epicResult = user?.epic_response?.result || {};
  return (
    <div className="col-md-6 mb-4" id="epic_response">
      <div className="p-3 shadow-sm rounded bg-light">
        {" "}
        {/* Simple box with padding and background */}
        <div className="d-flex align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0 me-2">EPIC</h5>
          <img
            src={
              !user?.epic_response
                ? "/images/resource/na.png"
                : user?.epic_response?.response_code == 100
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt={
              !user?.epic_response
                ? "N/A"
                : user?.epic_response?.response_code == 100
                  ? "Verified"
                  : "Not Verified"
            }
            style={{ width: "100px", height: "20px" }}
          />
        </div>
        <div className="mt-2">
          {/* Personal Details */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">EPIC ID:</span>
              <span className="text-break">
                {epicResult?.epic_number || "N/A"}
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Name:</span>
              <span className="text-break">
                {epicResult?.user_name_english
                  ? epicResult.user_name_english
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())
                  : "N/A"}
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Gender:</span>
              <span className="text-break">
                {epicResult?.user_gender || "N/A"}
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Age:</span>
              <span className="text-break">
                {epicResult?.user_age || "N/A"}
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Status:</span>
              <span className="text-break">{epicResult?.status || "N/A"}</span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">
                {epicResult?.relative_relation || "Relative"} Name:
              </span>
              <span className="text-break">
                {epicResult?.relative_name_english || "N/A"}
              </span>
            </div>
          </div>

          {/* Location Details */}
          <div className="mb-3">
            <h5 className="fw-bold">Location Details</h5>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">District:</span>
              <span className="text-break">
                {epicResult?.address?.district_name || "N/A"} (
                {epicResult?.address?.district_code || "N/A"})
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">State:</span>
              <span className="text-break">
                {epicResult?.address?.state || "N/A"} (
                {epicResult?.address?.state_code || "N/A"})
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Assembly Constituency:</span>
              <span className="text-break">
                {epicResult?.assembly_constituency_name || "N/A"} (
                {epicResult?.assembly_constituency_number || "N/A"})
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Parliamentary Constituency:</span>
              <span className="text-break">
                {epicResult?.parliamentary_constituency_name || "N/A"} (
                {epicResult?.parliamentary_constituency_number || "N/A"})
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Constituency Part Name:</span>
              <span className="text-break">
                {epicResult?.constituency_part_name || "N/A"} (
                {epicResult?.constituency_part_number || "N/A"})
              </span>
            </div>
          </div>

          {/* Polling Booth Details */}
          <div className="mb-2">
            <h5 className="fw-bold">Polling Booth Details</h5>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Polling Booth:</span>
              <span className="text-break">
                {epicResult?.polling_booth?.name || "N/A"} (
                {epicResult?.polling_booth?.number || "N/A"})
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Location:</span>
              <span className="text-break">
                {epicResult?.polling_booth?.lat_long || "N/A"}
              </span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">
                Serial Number Applicable Part:
              </span>
              <span className="text-break">
                {epicResult?.serial_number_applicable_part || "N/A"}
              </span>
            </div>
            {/* Last Updated */}
            <div className="d-flex align-items-center mb-1">
              <span className="fw-bold me-2">Last Updated:</span>
              <span className="text-break">
                {epicResult?.voter_last_updated_date
                  ? new Date(epicResult.voter_last_updated_date).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      },
                    )
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EpicDetails;
