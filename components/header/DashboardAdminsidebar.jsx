"use client";

import Link from "next/link";
import employerMenuData from "../../data/adminMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";

import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice.js";
import { usePathname } from "next/navigation";
import styles  from "./DashboardAdminSidebar.module.css"
const DashboardEmployerSidebar = () => {
  const { menu } = useSelector((state) => state.toggle || {}); // Safe destructuring

  const dispatch = useDispatch();
  const pathname = usePathname();

  // menu toggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  return (
    <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
      {/* Sidebar close icon for mobile */}
      <div className="pro-header text-end pb-0 mb-0 show-1023">
        <div className="fix-icon" onClick={menuToggleHandler}>
          <span className="flaticon-close"></span>
        </div>
      </div>

      <div>
        <p
          className={styles.adminTitle}
        >
          Admin Panel
        </p>
      </div>
      <div className="sidebar-inner">
        <ul className="navigation">
          {employerMenuData.map((item) => (
            <li
              className={`${
                isActiveLink(item.routePath, pathname) ? "active" : ""
              } mb-1`}
              key={item.id}
              onClick={menuToggleHandler}
            >
              <Link href={item.routePath}>
                <i className={`la ${item.icon}`}></i> {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardEmployerSidebar;
