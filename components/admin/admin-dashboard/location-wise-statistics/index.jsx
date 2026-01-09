"use client";

import { useState, useEffect } from "react";

import MobileMenu from "../../../header/AdminMobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

import "./location-wise-statistics.css";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  /* ---------------- API CALL ---------------- */
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSummary = async () => {
      setLoading(true);
      setData(null);

      try {
        const token = localStorage.getItem("Super_token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/order/daily-order-summary-zipcode?date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await res.text();

        if (!res.ok) {
          console.error("Backend error:", text);
          throw new Error(`API failed with ${res.status}`);
        }

        const json = JSON.parse(text);
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedDate]);

  const vegLunch = data?.menus?.veg?.lunch;
  const vegDinner = data?.menus?.veg?.dinner;
  const nonVegLunch = data?.menus?.nonVeg?.lunch;
  const nonVegDinner = data?.menus?.nonVeg?.dinner;

  const summaryByZipCode = data?.summaryByZipCode || {};

  /* ---------------- Menu Block Component ---------------- */
  const MenuBlock = ({ title, menu, typeClass }) => {
    if (!menu) return null;

    return (
      <table className="menu-details-table">
        <thead>
          <tr>
            <th colSpan="2" className={typeClass}>
              {title}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="90">
              <img
                src={menu?.images?.[0] || "https://via.placeholder.com/80"}
                className="menu-cover"
                alt={menu.menuName}
              />
            </td>
            <td>
              <ul className="menu-list">
                {menu?.item1 && <li>{menu.item1}</li>}
                {menu?.item2 && <li>{menu.item2}</li>}
                {menu?.item3 && <li>{menu.item3}</li>}
                {menu?.item4 && <li>{menu.item4}</li>}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const EmptyState = ({ title, description }) => {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          background: "#f9fafb",
          border: "1px dashed #d1d5db",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        <div style={{ fontSize: "42px", marginBottom: "10px" }}>📭</div>
        <h4 style={{ marginBottom: "8px", color: "#374151" }}>{title}</h4>
        <p style={{ color: "#6b7280", marginBottom: 0 }}>{description}</p>
      </div>
    );
  };

  const isMenuEmpty = !vegLunch && !vegDinner && !nonVegLunch && !nonVegDinner;

  const isZipStatsEmpty = Object.keys(summaryByZipCode).length === 0;

  const isAdditionalItemsEmpty = Object.values(summaryByZipCode).every(
    (zip) =>
      !zip.additionalItemsBreakdown ||
      Object.keys(zip.additionalItemsBreakdown).length === 0
  );

  return (
    <div className="page-wrapper dashboard">
      <DashboardHeader />
      <MobileMenu />
      <DashboardEmployerSidebar />

      <section
        className="user-dashboard"
        style={{ minHeight: "calc(100vh - 150px)" }}
      >
        <div className="dashboard-outer">
          <BreadCrumb title="Location Wise Statistics" />

          {/* DATE PICKER */}
          <div className="date-box">
            <label>
              <strong>Select Menu Date:</strong>
            </label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ maxWidth: "250px" }}
            />
          </div>

          {/* LOADING */}
          {loading && (
            <div className="loader-wrapper">
              <div className="spinner" />
              <p className="mt-2">Loading menu & statistics...</p>
            </div>
          )}

          {/* MENU DETAILS */}
          {!loading && data && (
            <>
              {isMenuEmpty ? (
                <EmptyState
                  title="Menu not set yet"
                  description="No lunch or dinner menu has been configured for this date."
                />
              ) : (
                <div className="menu-table-card">
                  <div className="menu-title">
                    Menu Details For : {formattedDate}
                  </div>

                  <div className="menu-details-wrapper">
                    {/* VEG Lunch */}
                    <MenuBlock
                      title="Veg Lunch"
                      menu={vegLunch}
                      typeClass="veg"
                    />

                    {/* NON-VEG Lunch */}
                    <MenuBlock
                      title="Non-Veg Lunch"
                      menu={nonVegLunch}
                      typeClass="nonveg"
                    />

                    {/* VEG Dinner */}
                    <MenuBlock
                      title="Veg Dinner"
                      menu={vegDinner}
                      typeClass="veg"
                    />

                    {/* NON-VEG Dinner */}
                    <MenuBlock
                      title="Non-Veg Dinner"
                      menu={nonVegDinner}
                      typeClass="nonveg"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ZIP WISE STATS */}
          {!loading && data && (
            <>
              <div className="card">
                <h3>Zip Wise Stats (Veg & Non-Veg)</h3>

                {isZipStatsEmpty ? (
                  <EmptyState
                    title="No zip-wise data available"
                    description="No orders have been placed for this date."
                  />
                ) : (
                  <table className="zip-table">
                    <thead>
                      <tr>
                        <th>Zip Code</th>
                        <th className="center">Veg Quantity</th>
                        <th className="center">Non-Veg Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summaryByZipCode).map(([zip, stats]) => (
                        <tr key={zip}>
                          <td>{zip}</td>
                          <td className="center">
                            <span className="qty-badge">
                              {stats.vegSubscriptions}
                            </span>
                          </td>
                          <td className="center">
                            <span className="qty-badge">
                              {stats.nonVegSubscriptions}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {/* Total Row */}
                      <tr className="total-row">
                        <td>Total</td>
                        <td className="center">
                          <span>
                            {Object.values(summaryByZipCode).reduce(
                              (acc, curr) => acc + curr.vegSubscriptions,
                              0
                            )}
                          </span>
                        </td>
                        <td className="center">
                          <span>
                            {Object.values(summaryByZipCode).reduce(
                              (acc, curr) => acc + curr.nonVegSubscriptions,
                              0
                            )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              {/* ZIP WISE ADDITIONAL ITEMS */}
              <div className="card">
                <h3>Zip Wise Stats (Additional Items)</h3>

                {isAdditionalItemsEmpty ? (
                  <EmptyState
                    title="No additional items found"
                    description="No extra items were ordered for this date."
                  />
                ) : (
                  <table className="zip-table">
                    <thead>
                      <tr>
                        <th>Zip Code</th>
                        <th className="center">Item Image</th>
                        <th>Item Name</th>
                        <th className="center">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summaryByZipCode).flatMap(
                        ([zip, stats]) => {
                          const breakdown =
                            stats.additionalItemsBreakdown || {};

                          return Object.entries(breakdown).map(
                            ([key, value]) => {
                              const isObject =
                                typeof value === "object" && value !== null;

                              const itemName =
                                typeof value === "object" ? value.name : key;

                              const quantity =
                                typeof value === "object"
                                  ? value.totalQuantity
                                  : value;

                              const itemImage = isObject ? value.image : null;

                              if (!quantity || quantity === 0) return null;

                              return (
                                <tr key={`${zip}-${itemName}`}>
                                  <td>{zip}</td>
                                  <td className="center">
                                    <img
                                      src={
                                        itemImage ||
                                        "https://via.placeholder.com/40"
                                      }
                                      alt={itemName}
                                      style={{
                                        width: "48px",
                                        height: "48px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                      }}
                                    />
                                  </td>
                                  <td>{itemName}</td>
                                  <td className="center">
                                    <span className="qty-badge">
                                      {quantity}
                                    </span>
                                  </td>
                                </tr>
                              );
                            }
                          );
                        }
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <CopyrightFooter />
      <MenuToggler />
    </div>
  );
};

export default Index;
