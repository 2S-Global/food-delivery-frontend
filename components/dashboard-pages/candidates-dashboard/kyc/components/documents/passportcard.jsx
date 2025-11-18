import React from "react";

const PassDetails = () => {
  // Static data
  const passportResult = {
    name_on_passport: "John",
    customer_last_name: "Doe",
    passport_number: "M1234567",
    passport_applied_date: "2020-05-10",
    status: "Verified",
  };

  return (
    <div className="container my-3">
      <div className="col-12 mx-auto">
        <div className="p-3 shadow rounded bg-white border">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="fw-bold mb-0">PASSPORT</h5>
            <img
              src="/images/resource/verified.png"
              alt="Verified"
              style={{ width: "100px", height: "auto" }}
            />
          </div>

          {/* Passport Details */}
          <div className="row g-2">
            <div className="col-md-6">
              <div className="mb-2">
                <span className="fw-semibold text-secondary">Full Name:</span>{" "}
                <span className="fw-bold">
                  {passportResult.name_on_passport}{" "}
                  {passportResult.customer_last_name}
                </span>
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">
                  Passport Number:
                </span>{" "}
                <span className="fw-bold text-primary">
                  {passportResult.passport_number}
                </span>
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">
                  Applied Date:
                </span>{" "}
                {passportResult.passport_applied_date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassDetails;
