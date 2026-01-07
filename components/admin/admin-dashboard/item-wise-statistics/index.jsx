"use client";

import { useState } from "react";

import MobileMenu from "../../../header/AdminMobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

import "./item-wise-statistics.css";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

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

          {/* MENU DETAILS */}
          <div className="menu-table-card">
            <div className="menu-title">
              {selectedDate
                ? `Menu Details For : ${formattedDate}`
                : "Menu Details"}
            </div>

            <div className="menu-details-wrapper">
              {/* VEG MENU */}
              <table className="menu-details-table">
                <thead>
                  <tr>
                    <th colSpan="2" className="veg">
                      Veg Menu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width="90">
                      <img
                        src="no-image160x160.png"
                        className="menu-cover"
                      />
                    </td>
                    <td>
                      <ul className="menu-list">
                        <li>Paneer Butter Masala</li>
                        <li>Dal Tadka</li>
                        <li>Veg Biryani</li>
                        <li>Mix Veg</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* NON-VEG MENU */}
              <table className="menu-details-table">
                <thead>
                  <tr>
                    <th colSpan="2" className="nonveg">
                      Non-Veg Menu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width="90">
                      <img
                        src="https://via.placeholder.com/80/dc2626/ffffff?text=NON+VEG"
                        className="menu-cover"
                      />
                    </td>
                    <td>
                      <ul className="menu-list">
                        <li>Chicken Curry</li>
                        <li>Chicken Biryani</li>
                        <li>Egg Masala</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* STATS */}
          <div className="stats">
            <div className="stat-card veg">
              <div className="stat-title">Total Veg Items</div>
              <div className="stat-value">10</div>
            </div>

            <div className="stat-card nonveg">
              <div className="stat-title">Total Non-Veg Items</div>
              <div className="stat-value">7</div>
            </div>
          </div>

          {/* ADDITIONAL ITEMS */}
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
                <tr>
                  <td>
                    <img src="https://via.placeholder.com/50" />
                  </td>
                  <td>Cold Drink</td>
                  <td>
                    <span className="quantity-badge">1</span>
                  </td>
                </tr>

                <tr>
                  <td>
                    <img src="https://via.placeholder.com/50" />
                  </td>
                  <td>Extra Roti</td>
                  <td>
                    <span className="quantity-badge">2</span>
                  </td>
                </tr>

                <tr>
                  <td>
                    <img src="https://via.placeholder.com/50" />
                  </td>
                  <td>Sweet Dish</td>
                  <td>
                    <span className="quantity-badge">1</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CopyrightFooter />
      <MenuToggler />
    </div>
  );
};

export default Index;
