import React from "react";

const EpicDetails = () => {
  // Static data
  const epicResult = {
    epic_number: "WB123456789",
    user_name_english: "John Doe",
    user_gender: "Male",
    user_age: 35,
    status: "Active",
    relative_relation: "Father",
    relative_name_english: "Richard Doe",
    address: {
      district_name: "Kolkata",
      district_code: "KL01",
      state: "West Bengal",
      state_code: "WB",
    },
    assembly_constituency_name: "Kolkata North",
    assembly_constituency_number: "AC123",
    parliamentary_constituency_name: "Kolkata",
    parliamentary_constituency_number: "PC456",
    constituency_part_name: "Ward 12",
    constituency_part_number: "CP12",
  };

  return (
    <div className="container my-3">
      <div className="col-12 mx-auto" style={{ maxWidth: "900px" }}>
        <div className="p-3 shadow rounded bg-white border">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="fw-bold mb-0">EPIC</h5>
            <img
              src="/images/resource/verified.png"
              alt="Verified"
              style={{ width: "100px", height: "auto" }}
            />
          </div>

          <div className="row g-2">
            {/* Personal Info */}
            <div className="col-md-6">
              <div className="mb-2">
                <span className="fw-semibold text-secondary">EPIC ID:</span>{" "}
                <span className="fw-bold text-primary">
                  {epicResult.epic_number}
                </span>
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">Name:</span>{" "}
                <span className="fw-bold">{epicResult.user_name_english}</span>
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">Gender:</span>{" "}
                {epicResult.user_gender}
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">Age:</span>{" "}
                {epicResult.user_age}
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">Status:</span>{" "}
                {epicResult.status}
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">
                  {epicResult.relative_relation} Name:
                </span>{" "}
                {epicResult.relative_name_english}
              </div>
            </div>

            {/* Location Info */}
            <div className="col-md-6">
              <div className="mb-2">
                <span className="fw-semibold text-secondary">District:</span>{" "}
                {epicResult.address.district_name} (
                {epicResult.address.district_code})
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">State:</span>{" "}
                {epicResult.address.state} ({epicResult.address.state_code})
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">
                  Assembly Constituency:
                </span>{" "}
                {epicResult.assembly_constituency_name} (
                {epicResult.assembly_constituency_number})
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">
                  Parliamentary Constituency:
                </span>{" "}
                {epicResult.parliamentary_constituency_name} (
                {epicResult.parliamentary_constituency_number})
              </div>
              <div className="mb-2">
                <span className="fw-semibold text-secondary">
                  Constituency Part:
                </span>{" "}
                {epicResult.constituency_part_name} (
                {epicResult.constituency_part_number})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpicDetails;
