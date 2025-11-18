"use client";
import React, { useState } from "react";

const TopCardBlock = () => {
  const [TotalCompany] = useState(12);
  const [totalPayment] = useState(158.75); // Large number example
  const [TotalCandidate] = useState(256);
  const [TotalInstitution] = useState(8);

  const cardContent = [
    {
      id: 1,
      icon: "la-building",
      countNumber: TotalCompany,
      metaName: "Total Company",
      uiClass: "bg-success text-white",
    },
    {
      id: 2,
      icon: "la-credit-card",
      countNumber: TotalInstitution,
      metaName: "Pending Request",
      uiClass: "bg-primary text-white",
    },
    {
      id: 3,
      icon: "la-file-alt",
      countNumber: TotalCandidate,
      metaName: "Approved Candidate",
      uiClass: "bg-danger text-white",
    },
    {
      id: 4,
      icon: "la-hourglass-half",
      countNumber: `₹${Number(totalPayment).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      metaName: "Total Transaction",
      uiClass: "bg-warning text-dark",
    },
  ];

  return (
    <div className="row">
      {cardContent.map((item) => (
        <div
          key={item.id}
          className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3"
        >
          <div className="d-flex flex-column h-100 p-3 rounded shadow-sm bg-white">
            <div className="d-flex align-items-center mb-2">
              {/* Icon Box */}
              <div
                className={`me-3 d-flex align-items-center justify-content-center rounded ${item.uiClass}`}
                style={{ width: "45px", height: "45px", fontSize: "20px" }}
              >
                <i className={`la ${item.icon}`}></i>
              </div>

              {/* Text Content */}
              <div className="flex-grow-1">
                <h4
                  className="mb-0 fw-bold fs-5"
                  style={{ wordBreak: "break-word" }}
                  title={item.countNumber}
                >
                  {item.countNumber}
                </h4>
                <p className="mb-0 small text-muted">{item.metaName}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCardBlock;
