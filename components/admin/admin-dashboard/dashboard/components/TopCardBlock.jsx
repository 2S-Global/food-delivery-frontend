"use client";
import React from "react";
import axios from "axios";

import { useState, useEffect } from "react";
const TopCardBlock = () => {
  const [TotalCompany, setTotalcompany] = useState();
  const [totalPayment, setTotalpayment] = useState();
  const [TotalCandidate, setTotalCandidate] = useState();
  const [TotalInstitution, setTotalInstitution] = useState();

  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("Super_token");

  useEffect(() => {
    // Temporary static values

    fetchData();

 
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiurl}/api/dashboard/getTotal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { totalCompany, TotalPayment, totalInstitution, totalCandidate } =response.data;
      setTotalcompany(totalCompany);
      setTotalpayment(TotalPayment);
      setTotalCandidate(totalCandidate);
      setTotalInstitution(totalInstitution);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${apiurl}/api/dashboard/getTotal`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log(response.data);

  //     if (response.data.success) {
  //       setTotalcompany(response.data.totalUsers);
  //       setTotalpayment(response.data.totalTransactionAmount);
  //       setTotalactiveverification(response.data.totalActiveVerification);
  //       setTotalpendingverification(response.data.totalPendingVerifications);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  //   setLoading(false);
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  const cardContent = [
    {
      id: 1,
      icon: "la-building", // Better for "Total Company"
      countNumber: TotalCompany,
      metaName: "Total Company",
      uiClass: "ui-green",
    },
    {
      id: 2,
      icon: "la-credit-card", // Better for "Total Payments"
      countNumber: TotalInstitution,
      metaName: "Total Institution",
      uiClass: "ui-blue",
    },
    {
      id: 3,
      icon: "la-file-alt", // "File/Document" type icon for "Active Verification"
      countNumber: TotalCandidate,
      metaName: "Total Candidate",
      uiClass: "ui-red",
    },
    {
      id: 4,
      icon: "la-hourglass-half", // "Pending" feeling for "Pending Verification"
      countNumber: `₹${Number(totalPayment).toFixed(2).toLocaleString("en-IN")}`,
      metaName: "Total Payment",
      uiClass: "ui-yellow",
    },
  ];

  return (
    <>
      {cardContent.map((item) => (
        <div
          className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className={`ui-item ${item.uiClass}`}>
            <div className="left">
              <i
                className={`icon la ${item.icon}`}
                style={{ height: "37px", width: "31px", lineHeight: "25px" }}
              ></i>
            </div>
            <div className="right">
              <h4>
                {(item.metaName === "Total Payments" ||
                  item.metaName === "Wallet Balance") && (
                  <span>&#8377;&nbsp;</span>
                )}
                {item.countNumber}
              </h4>
              <p>{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock;
