"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

import MobileMenu from "../../../header/AdminMobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const isMonday = (date) => date.getDay() === 1;

const getWeekFromMonday = (monday) =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

const Index = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [startDate, setStartDate] = useState(null);
  const [menus, setMenus] = useState([]);
  const [vegMenus, setVegMenus] = useState([]);
  const [nonVegMenus, setNonVegMenus] = useState([]);

  const [loadingWeek, setLoadingWeek] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH DROPDOWN MENUS ================= */
  const fetchMenus = async (type, setter) => {
    const res = await axios.get(
      `${apiurl}/api/usermenu/list-menu?type=${type}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setter(Array.isArray(res.data?.data) ? res.data.data : []);
  };

  useEffect(() => {
    fetchMenus("veg", setVegMenus);
    fetchMenus("non-veg", setNonVegMenus);
  }, []);

  /* ================= FETCH WEEK DATA ================= */
  const fetchWeekData = async (dates) => {
  setLoadingWeek(true);
  const weekData = [];

  for (let i = 0; i < dates.length; i++) {
    const dateStr = dates[i].toLocaleDateString("en-CA");

    try {
      const res = await axios.get(
        `${apiurl}/api/weeklymenu/weekly-menu?date=${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success && res.data.data) {
        const d = res.data.data;

        weekData.push({
          day: DAYS[i],
          date: dates[i],

          // ✅ convert OBJECT → ID (required for <select>)
          vegLunch: d.vegLunch?._id || "",
          vegDinner:
            DAYS[i] === "Sunday" ? null : d.vegDinner?._id || "",
          nonVegLunch: d.nonVegLunch?._id || "",
          nonVegDinner:
            DAYS[i] === "Sunday" ? null : d.nonVegDinner?._id || "",
        });
      } else {
        weekData.push(createEmptyDay(dates[i], i));
      }
    } catch {
      weekData.push(createEmptyDay(dates[i], i));
    }
  }

  setMenus(weekData);
  setLoadingWeek(false);
};


  const createEmptyDay = (date, index) => ({
    day: DAYS[index],
    date,
    vegLunch: "",
    vegDinner: DAYS[index] === "Sunday" ? null : "",
    nonVegLunch: "",
    nonVegDinner: DAYS[index] === "Sunday" ? null : "",
  });

  /* ================= DATE CHANGE ================= */
  const handleDateChange = async (date) => {
    setStartDate(date);
    const weekDates = getWeekFromMonday(date);
    await fetchWeekData(weekDates);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index, field, value) => {
    const updated = [...menus];
    updated[index][field] = value;
    setMenus(updated);
  };

  /* ================= SAVE WEEK ================= */
const handleSave = async () => {
  try {
    setSaving(true);

    for (const menu of menus) {
      await axios.post(
        `${apiurl}/api/weeklymenu/weekly-menu`,
        {
          // ✅ FIX: send LOCAL date string, not Date object
          date: menu.date.toLocaleDateString("en-CA"),
          day: menu.day,
          vegLunch: menu.vegLunch,
          vegDinner: menu.vegDinner,
          nonVegLunch: menu.nonVegLunch,
          nonVegDinner: menu.nonVegDinner,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    alert("Weekly menu saved successfully ✅");
  } catch (error) {
    console.error(error);
    alert("Failed to save weekly menu ❌");
  } finally {
    setSaving(false);
  }
};


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
          <BreadCrumb title="Weekly Menu Settings" />

          {/* CALENDAR */}
          <div className="mb-4" style={{ marginTop: "25px" }}>
            <label>Select Monday</label>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              filterDate={isMonday}
              placeholderText="Select Monday"
              className="form-control"
              dateFormat="dd MMM yyyy"
            />
          </div>

          {/* LOADER */}
          {loadingWeek && (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2">Loading weekly menu...</p>
            </div>
          )}

          {/* WEEKLY MENUS */}
          {!loadingWeek &&
            menus.map((menu, index) => (
              <div key={menu.day} className="ls-widget mb-4">
                <div className="widget-title">
                  <h4>
                    {menu.day} —{" "}
                    {menu.date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </h4>
                </div>

                <div className="widget-content">
                  <div className="row">
                    <div className="col-md-3">
                      <label>Veg Lunch</label>
                      <select
                        className="form-control"
                        value={menu.vegLunch}
                        onChange={(e) =>
                          handleChange(index, "vegLunch", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {vegMenus.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.menuName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {menu.vegDinner !== null && (
                      <div className="col-md-3">
                        <label>Veg Dinner</label>
                        <select
                          className="form-control"
                          value={menu.vegDinner}
                          onChange={(e) =>
                            handleChange(index, "vegDinner", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {vegMenus.map((v) => (
                            <option key={v._id} value={v._id}>
                              {v.menuName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="col-md-3">
                      <label>Non-Veg Lunch</label>
                      <select
                        className="form-control"
                        value={menu.nonVegLunch}
                        onChange={(e) =>
                          handleChange(index, "nonVegLunch", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {nonVegMenus.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.menuName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {menu.nonVegDinner !== null && (
                      <div className="col-md-3">
                        <label>Non-Veg Dinner</label>
                        <select
                          className="form-control"
                          value={menu.nonVegDinner}
                          onChange={(e) =>
                            handleChange(index, "nonVegDinner", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {nonVegMenus.map((v) => (
                            <option key={v._id} value={v._id}>
                              {v.menuName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {menus.length > 0 && (
            <button
              className="theme-btn btn-style-one mt-3"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Weekly Menu"}
            </button>
          )}
        </div>
      </section>

      <CopyrightFooter />
      <MenuToggler />
    </div>
  );
};

export default Index;
