"use client";

import { useState, useEffect } from "react";

import MobileMenu from "../../../header/AdminMobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

import "./item-wise-statistics.css";
import { set } from "date-fns";

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/order/daily-order-summary?date=${selectedDate}`,
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

  const additionalItems = data?.additionalItemsBreakdown
    ? Object.values(data.additionalItemsBreakdown)
    : [];

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
                src={menu?.images?.[0] || "no-image160x160.png"}
                className="menu-cover"
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
          marginTop: "20px",
          textAlign: "center",
          background: "#f9fafb",
          border: "1px dashed #d1d5db",
          borderRadius: "12px",
        }}
      >
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>📭</div>
        <h4 style={{ marginBottom: "8px", color: "#374151" }}>{title}</h4>
        <p style={{ color: "#6b7280", margin: 0 }}>{description}</p>
      </div>
    );
  };

  const isMenuEmpty = !vegLunch && !vegDinner && !nonVegLunch && !nonVegDinner;

  const vegCount = Number(data?.vegSubscriptions || 0);
  const nonVegCount = Number(data?.nonVegSubscriptions || 0);

  const isStatsEmpty = vegCount === 0 && nonVegCount === 0;

  const isAdditionalItemsEmpty = additionalItems.length === 0;

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
          <BreadCrumb title="Item Wise Statistics" />

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
                  title="Menu not published for this date"
                  description="No veg or non-veg menu has been set for the selected date."
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

          {/* STATS */}
          {!loading && data && (
            <>
              {isStatsEmpty ? (
                <EmptyState
                  title="No subscriptions found"
                  description="No veg or non-veg subscriptions were placed for this date."
                />
              ) : (
                <div className="stats">
                  <div className="stat-card veg">
                    <div className="stat-title">Total Veg Subscriptions</div>
                    <div className="stat-value">{vegCount}</div>
                  </div>

                  <div className="stat-card nonveg">
                    <div className="stat-title">
                      Total Non-Veg Subscriptions
                    </div>
                    <div className="stat-value">{nonVegCount}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ADDITIONAL ITEMS */}
          {!loading && data && (
            <>
              {isAdditionalItemsEmpty ? (
                <EmptyState
                  title="No additional items ordered"
                  description="Customers did not add any extra items on this date."
                />
              ) : (
                <div className="table-card">
                  <h3>Additional Items</h3>

                  <table>
                    <thead>
                      <tr>
                        <th>Item Image</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalItems.map((item) => (
                        <tr key={item.itemId}>
                          <td>
                            <img src={item.image} width="50" />
                          </td>
                          <td>{item.name}</td>
                          <td>
                            <span className="quantity-badge">
                              {item.totalQuantity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
