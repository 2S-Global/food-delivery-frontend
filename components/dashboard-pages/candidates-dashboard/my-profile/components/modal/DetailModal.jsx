import React from "react";

const EducationDetails = ({ item }) => {
  return (
    <div className="modal-body">
      {["tenth", "twelfth"].includes(item.level) && (
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Institute name:</strong> {item.data.schoolName}
            </p>
            <p>
              <strong>Board:</strong> {item.data.board}
            </p>
            <p>
              <strong>State:</strong> {item.data.state}
            </p>
            <p>
              <strong>Year of Passing:</strong> {item.data.year}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Total Marks:</strong> {item.data.totalMarks}
            </p>
            <p>
              <strong>Marks Obtained:</strong> {item.data.marksObtain}
            </p>
            <p>
              <strong>Percentage:</strong> {item.data.percentage}%
            </p>
            <div className="document-links">
              <p>
                <strong>Documents:</strong>
                <a href="#" className="ml-2 text-decoration-none">
                  {" "}
                  📄 Transcript
                </a>
                <a href="#" className="ml-2 text-decoration-none">
                  {" "}
                  📄 Certificate
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {["diploma", "undergraduate", "postgraduate"].includes(item.level) && (
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>State name:</strong> {item.data.state}
            </p>
            <p>
              <strong>University name:</strong> {item.data.university}
            </p>
            <p>
              <strong>Institute name:</strong> {item.data.college}
            </p>
            <p>
              <strong>Course:</strong> {item.data.course}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Year of Completion:</strong> {item.data.year}
            </p>
            <p>
              <strong>CGPA:</strong> {item.data.cgpa}
            </p>
            <p>
              <strong>Percentage:</strong> {item.data.percentage}%
            </p>
            <div className="document-links">
              <p>
                <strong>Documents:</strong>
                <a href="#" className="ml-2 text-decoration-none">
                  {" "}
                  📄 Transcript
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-3">
        <span className="badge badge-success p-2">
          <i className="fa fa-check"></i> Verified
        </span>
      </div>
    </div>
  );
};

const DetailModal = ({ item, show, onClose }) => {
  if (!show || !item) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          width: "80%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "20px",
        }}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            {item.level.charAt(0).toUpperCase() + item.level.slice(1)} Details
          </h3>
          <button type="button" className="close" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        <EducationDetails item={item} />
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
