"use client";

import { useState } from "react";

import MobileMenu from "../../../header/AdminMobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

import "./location-wise-statistics.css";

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
                        src="https://via.placeholder.com/80/16a34a/ffffff?text=VEG"
                        className="menu-cover"
                        alt="Veg Menu"
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
                        alt="Non Veg Menu"
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

          {/* ZIP WISE STATS */}
          <div className="card">
            <h3>Zip Wise Stats (Veg & Non-Veg)</h3>

            <table className="zip-table">
              <thead>
                <tr>
                  <th>Zip Code</th>
                  <th className="center">Veg Quantity</th>
                  <th className="center">Non-Veg Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>560001</td>
                  <td className="center">
                    <span className="qty-badge">2</span>
                  </td>
                  <td className="center">
                    <span className="qty-badge">3</span>
                  </td>
                </tr>

                <tr>
                  <td>560034</td>
                  <td className="center">
                    <span className="qty-badge">3</span>
                  </td>
                  <td className="center">
                    <span className="qty-badge">5</span>
                  </td>
                </tr>

                <tr>
                  <td>560076</td>
                  <td className="center">
                    <span className="qty-badge">5</span>
                  </td>
                  <td className="center">
                    <span className="qty-badge">7</span>
                  </td>
                </tr>

                <tr className="total-row">
                  <td>Total</td>
                  <td className="center">10</td>
                  <td className="center">15</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ZIP WISE ADDITIONAL ITEMS */}
          <div className="card">
            <h3>Zip Wise Stats (Additional Items)</h3>

            <table className="zip-table">
              <thead>
                <tr>
                  <th>Zip Code</th>
                  <th>Item Image</th>
                  <th>Item Name</th>
                  <th className="center">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>560001</td>
                  <td>
                    <img
                      src="https://via.placeholder.com/50"
                      className="item-img"
                      alt="Item"
                    />
                  </td>
                  <td>Cold Drink</td>
                  <td className="center">
                    <span className="qty-badge">4</span>
                  </td>
                </tr>

                <tr>
                  <td>560034</td>
                  <td>
                    <img
                      src="https://via.placeholder.com/50"
                      className="item-img"
                      alt="Item"
                    />
                  </td>
                  <td>Extra Roti</td>
                  <td className="center">
                    <span className="qty-badge">6</span>
                  </td>
                </tr>

                <tr>
                  <td>560076</td>
                  <td>
                    <img
                      src="https://via.placeholder.com/50"
                      className="item-img"
                      alt="Item"
                    />
                  </td>
                  <td>Sweet Dish</td>
                  <td className="center">
                    <span className="qty-badge">3</span>
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
