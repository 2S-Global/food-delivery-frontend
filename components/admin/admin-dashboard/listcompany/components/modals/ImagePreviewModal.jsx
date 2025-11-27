"use client";
import React from "react";

const ImagePreviewModal = ({ show, onClose, images, allMenuDetails }) => {
  if (!show) return null;

  // console.log("Images in Modal:", images);
  // console.log("Name in Modal:", name);
  console.log("Here is my all data :", allMenuDetails);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">

          <div className="modal-header flex-column align-items-start">
            {/* Menu Name & Description */}
            {allMenuDetails && (
              <div className="mb-2">
                <h5 className="modal-title mb-4" style={{ fontSize: "25px" }}>{allMenuDetails.menuName}</h5>

                <div className="" style={{ display: "flex", gap: "60px", marginBottom: "10px" }}>
                  {/* Type */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h6 className="fw-bold mb-1">Type</h6>
                    <p className="mb-0">{allMenuDetails?.menuType}</p>
                  </div>
                  {/* Day */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h6 className="fw-bold mb-1">Day</h6>
                    <p className="mb-0">{allMenuDetails?.dayType}</p>
                  </div>
                  {/* Meal Type */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h6 className="fw-bold mb-1">Meal Type</h6>
                    <p className="mb-0">{allMenuDetails?.mealType}</p>
                  </div>
                </div>

                {/* Description Title */}
                <h6 className="fw-bold mb-1">Description</h6>

                {/* Description Value */}
                <p
                  className="mb-0"
                  style={{ fontSize: "0.9rem", color: "#555" }}
                  dangerouslySetInnerHTML={{ __html: allMenuDetails.description }}
                ></p>

              </div>
            )}

            {/* Modal Title */}
            {/* <h6 className="text-muted mt-2">Menu Images</h6> */}

            {/* Close Button */}
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              style={{ position: "absolute", right: "1rem", top: "1rem" }}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-3">
            {(!images || images.length === 0) ? (
              <p className="text-center mb-0">No images available</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "15px",
                }}
              >
                {images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={`menu-${index}`}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
