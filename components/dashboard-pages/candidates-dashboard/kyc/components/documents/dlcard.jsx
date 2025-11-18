import React from "react";

const DlDetails = () => {
  // ✅ Static sample data
  const user = {
    dl_response: {
      response_code: 100,
      response_message: "Verified",
      result: {
        user_full_name: "Jane Doe",
        dl_number: "WB1234567890",
        user_dob: "1995-06-15",
        father_or_husband: "Mr. Doe",
        state: "West Bengal",
        status: "Active",
        user_blood_group: "O+",
        expiry_date: "2035-06-14",
        issued_date: "2015-06-15",
        user_image: `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`, // base64 or leave empty
        user_address: [
          {
            type: "Permanent",
            completeAddress: "123 Park Street, Kolkata",
            district: "Kolkata",
            state: "West Bengal",
            pin: "700016",
            country: "India",
          },
          {
            type: "Present",
            completeAddress: "456 Lake Town, Kolkata",
            district: "Kolkata",
            state: "West Bengal",
            pin: "700048",
            country: "India",
          },
        ],
      },
    },
    dl_image: "/images/resource/sample_dl.png",
  };

  const dl = user?.dl_response?.result || {};
  const permanentAddress = dl.user_address?.find((a) => a.type === "Permanent");
  const presentAddress = dl.user_address?.find((a) => a.type === "Present");

  return (
    <div className="container my-4">
      <div className="col-12 mx-auto" style={{ maxWidth: "900px" }}>
        <div className="p-3 shadow rounded bg-white border">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="fw-bold text-dark mb-0">Driving License</h4>
            <img
              src={
                !user?.dl_response
                  ? "/images/resource/na.png"
                  : user?.dl_response?.response_code === 100
                    ? "/images/resource/verified.png"
                    : "/images/resource/unverified.png"
              }
              alt={
                !user?.dl_response
                  ? "N/A"
                  : user?.dl_response?.response_code === 100
                    ? "Verified"
                    : "Not Verified"
              }
              style={{ width: "120px", height: "auto" }}
            />
          </div>

          <div className="row g-2">
            {/* Profile Image */}
            <div className="col-md-3 text-center">
              <img
                src={
                  dl.user_image
                    ? `data:image/jpeg;base64,${dl.user_image}`
                    : "/images/resource/no_user.png"
                }
                alt="Profile"
                className="img-thumbnail rounded"
                style={{ maxWidth: "150px", maxHeight: "150px" }}
              />
            </div>

            {/* Basic Details */}
            <div className="col-md-9">
              <div className="row g-1">
                <div className="col-6">
                  <span className="fw-semibold text-secondary">Full Name:</span>{" "}
                  <span className="fw-bold">{dl.user_full_name || "N/A"}</span>
                </div>
                <div className="col-6">
                  <span className="fw-semibold text-secondary">DL Number:</span>{" "}
                  <span className="fw-bold text-primary">
                    {dl.dl_number || "N/A"}
                  </span>
                </div>
                <div className="col-6">
                  <span className="fw-semibold text-secondary">
                    Date of Birth:
                  </span>{" "}
                  {dl.user_dob || "N/A"}
                </div>
                <div className="col-6">
                  <span className="fw-semibold text-secondary">
                    Father/Husband:
                  </span>{" "}
                  {dl.father_or_husband || "N/A"}
                </div>
                <div className="col-6">
                  <span className="fw-semibold text-secondary">
                    License State:
                  </span>{" "}
                  {dl.state || "N/A"}
                </div>
                <div className="col-6">
                  <span className="fw-semibold text-secondary">Status:</span>{" "}
                  {dl.status || "N/A"}
                </div>
                <div className="col-6">
                  <span className="fw-semibold text-secondary">
                    Blood Group:
                  </span>{" "}
                  {dl.user_blood_group || "N/A"}
                </div>
                <div className="col-6">
                  <span className="fw-semibold text-secondary">
                    Issued Date:
                  </span>{" "}
                  {dl.issued_date || "N/A"}
                </div>
                <div className="col-6">
                  <span className="fw-semibold text-secondary">
                    Expiry Date:
                  </span>{" "}
                  {dl.expiry_date || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="row mt-3 g-2">
            {["Permanent", "Present"].map((type) => {
              const address =
                type === "Permanent" ? permanentAddress : presentAddress;
              return (
                <div className="col-md-6" key={type}>
                  <h6 className="fw-bold small mb-1">{type} Address</h6>
                  {address ? (
                    <p className="small mb-0">
                      {address.completeAddress} <br />
                      <strong>District:</strong> {address.district} <br />
                      <strong>State:</strong> {address.state} <br />
                      <strong>Pin Code:</strong> {address.pin} <br />
                      <strong>Country:</strong> {address.country}
                    </p>
                  ) : (
                    <p className="text-muted small mb-0">N/A</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DlDetails;
