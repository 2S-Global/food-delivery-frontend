import React from "react";

const DlDetails = ({ user }) => {
  const dl = user?.dl_response?.result || {};
  const permanentAddress = dl.user_address?.find(
    (addr) => addr.type === "Permanent"
  );
  const presentAddress = dl.user_address?.find(
    (addr) => addr.type === "Present"
  );
  return (
    <div className="col-md-6 mb-4" id="dl_response">
      <div className="p-3 shadow-sm rounded bg-light">
        {" "}
        {/* Simple box with padding and background */}
        <div className="d-flex align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0 me-2">Driving License</h5>
          <img
            src={
              !user?.dl_response
                ? "/images/resource/na.png"
                : user?.dl_response?.response_code == 100
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt={
              !user?.dl_response
                ? "N/A"
                : user?.dl_response?.response_code == 100
                  ? "Verified"
                  : "Not Verified"
            }
            style={{ width: "100px", height: "20px" }}
          />
        </div>
        <div className="mt-2">
          <div className="row">
            {/* Profile Image */}
            <div className="col-md-6 text-center mb-3">
              {user?.dl_response?.result?.user_image ? (
                <img
                  src={`data:image/jpeg;base64,${user?.dl_response?.result?.user_image}`}
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

            {/* Basic Details */}
            <div className="col-md-6 p-3">
              <div className="row ">
                <div className="col-md-12 mb-2">
                  <strong>Full Name:</strong>{" "}
                  {user?.dl_response?.result?.user_full_name || "N/A"}
                </div>
                <div className="col-md-12 mb-2">
                  <strong>DL Number:</strong>{" "}
                  {user?.dl_response?.result?.dl_number || "N/A"}
                </div>
                <div className="col-md-12 mb-2">
                  <strong>Date of Birth:</strong>{" "}
                  {user?.dl_response?.result?.user_dob || "N/A"}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3 ">
            <div className="col-md-6 mb-2">
              <strong>Father/Husband Name:</strong>{" "}
              {user?.dl_response?.result?.father_or_husband || "N/A"}
            </div>
            <div className="col-md-6 mb-2">
              <strong>License State:</strong>{" "}
              {user?.dl_response?.result?.state || "N/A"}
            </div>
            <div className="col-md-6 mb-2">
              <strong>License Status:</strong>{" "}
              {user?.dl_response?.result?.status || "N/A"}
            </div>
            <div className="col-md-6 mb-2">
              <strong>Blood Group:</strong>{" "}
              {user?.dl_response?.result?.user_blood_group || "N/A"}
            </div>
            <div className="col-md-6 mb-2">
              <strong>Expiry Date:</strong>{" "}
              {user?.dl_response?.result?.expiry_date || "N/A"}
            </div>
            <div className="col-md-6 mb-2">
              <strong>Issued Date:</strong>{" "}
              {user?.dl_response?.result?.issued_date || "N/A"}
            </div>
          </div>
          {/* Address Details */}
          <div className="row mt-3">
            {["Permanent", "Present"].map((type) => {
              const address =
                type === "Permanent" ? permanentAddress : presentAddress;
              return (
                <div className="col-md-6" key={type}>
                  <h6 className="fw-bold">{type} Address</h6>
                  {address ? (
                    <p className="small">
                      {address.completeAddress} <br />
                      <strong>District:</strong> {address.district} <br />
                      <strong>State:</strong> {address.state} <br />
                      <strong>Pin Code:</strong> {address.pin} <br />
                      <strong>Country:</strong> {address.country}
                    </p>
                  ) : (
                    <p className="text-muted">N/A</p>
                  )}
                </div>
              );
            })}
          </div>
          {/* Validity Details */}
          <div className="row mt-3" style={{ display: "none" }}>
            <div className="col-md-6 mb-2">
              <strong>Non-Transport Validity:</strong>{" "}
              {dl.non_transport_validity
                ? `${dl.non_transport_validity.from || "N/A"} to ${dl.non_transport_validity.to || "N/A"}`
                : "N/A"}
            </div>
            <div className="col-md-6 mb-2">
              <strong>Transport Validity:</strong>{" "}
              {dl.transport_validity && dl.transport_validity.from !== "NA"
                ? `${dl.transport_validity.from} to ${dl.transport_validity.to || "N/A"}`
                : "N/A"}
            </div>
          </div>
          {/* Endorsement Details */}
          <div className="row mt-3" style={{ display: "none" }}>
            <div className="col-md-6 mb-2">
              <strong>Endorsement Number:</strong>{" "}
              {dl.endorse_number !== "NA" ? dl.endorse_number : "N/A"}
            </div>
            <div className="col-md-6 mb-2">
              <strong>Endorsement Date:</strong>{" "}
              {dl.endorse_date !== "NA" ? dl.endorse_date : "N/A"}
            </div>
          </div>

          {/* Vehicle Categories */}
          <div className="mt-3" style={{ display: "none" }}>
            <h6 className="fw-bold mb-2">Vehicle Categories</h6>
            {dl.vehicle_category_details?.length > 0 ? (
              <ul className="list-group">
                {dl.vehicle_category_details.map((vehicle, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{vehicle.cov}:</strong> Valid from{" "}
                    {vehicle.issueDate} to {vehicle.expiryDate}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">N/A</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DlDetails;
