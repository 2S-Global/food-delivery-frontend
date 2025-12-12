"use client";
import React from "react";
import axios from "axios";
import Link from "next/link";

import { useState, useEffect } from "react";
const TopCardBlock = () => {
  const [totalMenus, setTotalMenus] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalOrders, setTotalOrders] = useState();
  const [totalCustomers, setTotalCustomers] = useState();
  const [totalDeliveryBoys, setTotalDeliveryBoys] = useState();
  const [totalAdditionalItems, setTotalAdditionalItems] = useState();

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
      const response = await axios.get(`${apiurl}/api/order/get-order-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { totalMenus, totalRevenue, totalOrders, totalCustomers, totalDeliveryBoys, totalAdditionalItems } = response.data.data;

      setTotalMenus(totalMenus);
      setTotalRevenue(totalRevenue);
      setTotalOrders(totalOrders);
      setTotalCustomers(totalCustomers);
      setTotalDeliveryBoys(totalDeliveryBoys);
      setTotalAdditionalItems(totalAdditionalItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const cardContent = [
    {
      id: 1,
      icon: "la-building", // Better for "Total Company"
      countNumber: totalMenus,
      metaName: " Total Menus",
      uiClass: "ui-green",
      pageUrl: "/admin/manage-menu",
    },
    {
      id: 2,
      icon: "la-credit-card", // Better for "Total Payments"
      // countNumber: totalRevenue,
      countNumber: `£${Number(totalRevenue).toFixed(2).toLocaleString("en-IN")}`,
      metaName: "Total Revenue",
      uiClass: "ui-purple",
      pageUrl: "/admin/list-order",
    },
    {
      id: 3,
      icon: "la-file-alt", // "File/Document" type icon for "Active Verification"
      countNumber: totalOrders,
      metaName: "Total Orders",
      uiClass: "ui-red",
      pageUrl: "/admin/list-order",
    },
    {
      id: 4,
      icon: "la-users", // "File/Document" type icon for "Active Verification"
      countNumber: totalCustomers,
      metaName: "Total Customers",
      uiClass: "ui-yellow",
      pageUrl: "/admin/manage-customer",
    },
    {
      id: 5,
      icon: "la-motorcycle", // "File/Document" type icon for "Active Verification"
      countNumber: totalDeliveryBoys,
      metaName: "Total Delivery Boys",
      uiClass: "ui-sky",
      pageUrl: "/admin/manage-delivery-boy",
    },
    {
      id: 6,
      icon: "la-plus-circle", // "File/Document" type icon for "Active Verification"
      countNumber: totalAdditionalItems,
      metaName: "Total Additional Items",
      uiClass: "ui-green",
      pageUrl: "/admin/additional-items",
    },
    // {
    //   id: 4,
    //   icon: "la-hourglass-half", // "Pending" feeling for "Pending Verification"
    //   countNumber: `₹${Number(totalPayment).toFixed(2).toLocaleString("en-IN")}`,
    //   metaName: "Total Payment",
    //   uiClass: "ui-yellow",
    // },
  ];

  return (
    <>
      {cardContent.map((item) => (
        <div
          className="ui-block col-xl-4 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <Link href={item.pageUrl} style={{ textDecoration: "none" }}>
            <div className={`ui-item ${item.uiClass}`} style={{ gap: "20px", padding: "15px" }}>
              <div className="left">
                <i
                  className={`icon la ${item.icon}`}
                  style={{ height: "37px", width: "31px", lineHeight: "25px", }}
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
          </Link>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock;
