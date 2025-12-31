"use client";
import React, { useState } from "react";

const EditedImagePreviewModal = ({ show, onClose, images, allMenuDetails }) => {
  if (!show) return null;

  console.log("Here is my all data :", allMenuDetails);
  images = Array.isArray(images) ? images : images ? [images] : [];

  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images && images.length > 0;
  const mainImage = hasImages ? images[activeIndex] : null;

  const handlePrev = () => {
    if (!hasImages) return;
    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!hasImages) return;
    setActiveIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content" style={{ overflow: "hidden" }}>
          {/* HEADER – just close button */}
          <div className="modal-header border-0 p-2">
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* BODY – LEFT: image carousel, RIGHT: details */}
          <div className="modal-body pt-0 pb-3 px-3">
            <div className="d-flex flex-column flex-md-row">
              {/* LEFT: IMAGE CAROUSEL */}
              <div
                className="d-flex flex-column align-items-center justify-content-center bg-light"
                style={{
                  flex: 1,
                  padding: "16px",
                  minHeight: "260px",
                  position: "relative",
                }}
              >
                {mainImage ? (
                  <>
                    {/* Main image */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "360px",
                      }}
                    >

                      {/* This is main Image which css styles is replaced */}
                      <img
                        src={mainImage}
                        alt={allMenuDetails?.menuName || `menu-${activeIndex}`}
                        style={{
                          width: "300px",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      // style={{
                      //   width: "100%",
                      //   height: "auto",
                      //   objectFit: "contain",
                      //   borderRadius: "8px",
                      //   boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      // }}
                      />

                      {/* Prev / Next controls */}
                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={handlePrev}
                            style={{
                              position: "absolute",
                              left: "-10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              border: "none",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            style={{
                              position: "absolute",
                              right: "-10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              border: "none",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div
                        className="d-flex flex-wrap justify-content-center mt-3"
                        style={{ gap: "8px" }}
                      >
                        {images.map((img, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            style={{
                              border:
                                index === activeIndex
                                  ? "2px solid #000"
                                  : "1px solid #ccc",
                              padding: 0,
                              borderRadius: "6px",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                          >
                            {/* This is thumbnail image replaced by new CSS */}
                            <img
                              src={img}
                              alt={`thumb-${index}`}
                              //   style={{
                              //     width: "60px",
                              //     height: "60px",
                              //     objectFit: "cover",
                              //     borderRadius: "4px",
                              //     display: "block",
                              //   }}
                              style={{
                                width: "70px",
                                height: "70px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                display: "block",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted mb-0">No images available</p>
                )}
              </div>

              {/* RIGHT: REQUIRED DETAILS / DOCUMENTS */}
              <div
                className="d-flex flex-column"
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {allMenuDetails && (
                  <>
                    {/* Title */}
                    <h5
                      className="mb-2"
                      style={{ fontSize: "24px", fontWeight: 700 }}
                    >
                      {allMenuDetails.menuName}
                      {allMenuDetails.itemName ? ` ${allMenuDetails.itemName}` : ""}
                    </h5>

                    {/* Basic info row */}
                    <div
                      className="mb-3"
                      style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}
                    >
                      {/* TYPE (only if exists) */}
                      {allMenuDetails.menuType && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span className="fw-bold mb-1" style={{ fontSize: "13px" }}>
                            Type
                          </span>
                          <span style={{ fontSize: "13px" }}>
                            {allMenuDetails.menuType || "-"}
                          </span>
                        </div>
                      )}

                      {/* <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="fw-bold mb-1" style={{ fontSize: "13px" }}>
                          Day
                        </span>
                        <span style={{ fontSize: "13px" }}>
                          {allMenuDetails.dayType || "-"}
                        </span>
                      </div> */}

                      {/* MEAL TYPE (only if exists) */}
                      {allMenuDetails.mealType && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span className="fw-bold mb-1" style={{ fontSize: "13px" }}>
                            Meal Type
                          </span>
                          <span style={{ fontSize: "13px" }}>
                            {allMenuDetails.mealType || "-"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Main description */}
                    <h6 className="fw-bold mb-1" style={{ fontSize: "14px" }}>
                      Slug
                    </h6>
                    <div
                      className="mb-3"
                      style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{
                        __html: allMenuDetails.slug || "",
                      }}
                    />

                    {/* Main description */}
                    <h6 className="fw-bold mb-1" style={{ fontSize: "14px" }}>
                      Summary
                    </h6>
                    <div
                      className="mb-3"
                      style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{
                        __html: allMenuDetails.summary || "",
                      }}
                    />

                    {/* Main description */}
                    <h6 className="fw-bold mb-1" style={{ fontSize: "14px" }}>
                      Description
                    </h6>
                    <div
                      style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{
                        __html: allMenuDetails.description || "",
                      }}
                    />

                    {/* Example: Required docs / item-wise description */}
                    {/* Show Items & Details only if at least one item exists */}
                    {(allMenuDetails.item1 ||
                      allMenuDetails.item2 ||
                      allMenuDetails.item3 ||
                      allMenuDetails.item4) && (
                        <div className="mt-3">
                          <h6 className="fw-bold mb-2" style={{ fontSize: "14px" }}>
                            Items & Details
                          </h6>
                          <ul
                            className="mb-0"
                            style={{ fontSize: "13px", paddingLeft: "18px" }}
                          >
                            {allMenuDetails.item1 && (
                              <li>
                                <strong>{allMenuDetails.item1}:</strong>{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: allMenuDetails.description1 || "",
                                  }}
                                />
                              </li>
                            )}
                            {allMenuDetails.item2 && (
                              <li>
                                <strong>{allMenuDetails.item2}:</strong>{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: allMenuDetails.description2 || "",
                                  }}
                                />
                              </li>
                            )}
                            {allMenuDetails.item3 && (
                              <li>
                                <strong>{allMenuDetails.item3}:</strong>{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: allMenuDetails.description3 || "",
                                  }}
                                />
                              </li>
                            )}
                            {allMenuDetails.item4 && (
                              <li>
                                <strong>{allMenuDetails.item4}:</strong>{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: allMenuDetails.description4 || "",
                                  }}
                                />
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0 pt-0 pb-3 px-3">
            <button
              type="button"
              className="btn btn-secondary ms-auto"
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

export default EditedImagePreviewModal;