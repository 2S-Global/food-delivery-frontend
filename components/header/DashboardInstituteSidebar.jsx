"use client";

import Link from "next/link";
import employerMenuData from "../../data/InstituteMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";

import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { usePathname } from "next/navigation";
import styles  from "./DashboardAdminSidebar.module.css"
const DashboardEmployerSidebar = () => {
  const { menu } = useSelector((state) => state.toggle);
  const dispatch = useDispatch();

  // menu toggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const pathname = usePathname();


  return (
    <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
      {/* Start sidebar close icon */}
      <div className="pro-header text-end pb-0 mb-0 show-1023">
        <div className="fix-icon" onClick={menuToggleHandler}>
          <span className="flaticon-close"></span>
        </div>
      </div>
      {/* End sidebar close icon */}
      <p
   className={styles.adminTitle}
      >
        Institute Panel
      </p>
      <div className="sidebar-inner">
        {/* Institute Panel heading */}

        {/* Navigation Menu */}
        <ul className="navigation">
          {employerMenuData.map((item) => (
            <li
              className={`${
                isActiveLink(item.routePath, usePathname()) ? "active" : ""
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
