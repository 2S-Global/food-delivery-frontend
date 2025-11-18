"use client";

import CustomizedProgressBars from "@/components/common/loader";

import React from "react";
const Underdev = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light"
      style={{
        color: "#333",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        className="p-4 rounded shadow"
        style={{
          background: "white",
          maxWidth: "400px",
          border: "1px solid #eee",
        }}
      >
        <h2 className="mb-3" style={{ color: "#007bff" }}>
          🚧 Under Development
        </h2>
        <p style={{ fontSize: "1rem", color: "#666" }}>
          We’re working hard to bring you this page soon.
          <br />
          Please check back later!
        </p>
        <div className="w-75 mx-auto mt-3">
          <CustomizedProgressBars />
        </div>
      </div>
    </div>
  );
};

export default Underdev;
