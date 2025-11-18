import React from "react";

const EmployeeInfoCard = ({ user }) => {
  return (
    <div
      className="card border shadow-sm mb-4"
      style={{ width: "100%", margin: "0 auto", height: "auto" }}
    >
      <div className="card-body p-3">
        <h5 className="card-title mb-3">Employment Information</h5>
        <div className="row g-2">
          <div className="col-sm-6">
            <strong>Designation:</strong> {user.designation}
          </div>
          <div className="col-sm-6">
            <strong>Employment Type:</strong>{" "}
            {user.employmenttype
              ? user.employmenttype.charAt(0).toUpperCase() +
                user.employmenttype.slice(1)
              : ""}
          </div>
          <div className="col-sm-6">
            <strong>Joining Date:</strong> {user.joiningdate}
          </div>
          <div className="col-sm-6">
            <strong>Leave Date:</strong> {user.leavedate}
          </div>
          <div className="col-sm-6">
            <strong>Currently Employed:</strong>{" "}
            {user.currentlyemployed ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
