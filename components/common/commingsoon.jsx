import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ComingSoon = ({ children }) => {
  return (
    <div className="position-relative" style={{ minHeight: "100vh" }}>
      {/* Background content (dimmed + flex wrapper for X-axis center) */}
      <div
        className="d-flex justify-content-center"
        style={{ opacity: 0.3, pointerEvents: "none" }}
      >
        {children}
      </div>

      {/* Fullscreen Overlay */}
      <div
        className="d-flex justify-content-center"
        style={{ background: "rgba(255, 255, 255, 0.6)" }}
      >
        <div className="position-relative d-flex justify-content-center w-auto">
          <div className="card shadow-lg p-4 text-center position-fixed top-50 translate-middle-y glass-card">
            <h2 className="mb-3">🚀 Coming Soon</h2>
            <p>We are working hard to launch this feature. Stay tuned!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
