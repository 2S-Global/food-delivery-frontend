"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import employerMenuData from "../../data/adminHeadermenuData";
/* import HeaderNavContent from "./HeaderNavContent"; */
import { isActiveLink } from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";
import { color } from "framer-motion";

const DashboardHeader = () => {
  const [navbar, setNavbar] = useState(true);
  const name = localStorage.getItem("Super_name");

  const changeBackground = () => {
    if (window.scrollY >= 0) {
      setNavbar(true);
    } else {
      setNavbar(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    // <!-- Main Header-->
    <header
      className={`main-header header-shaddow  ${navbar ? "fixed-header " : ""}`}
    >
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                {/*  <Link href="/"> */}
                <Image
                  alt="brand"
                  src="/images/Logo3.png"
                  width={154}
                  height={50}
                  priority
                />
                {/*  </Link> */}
              </div>
            </div>
            {/* End .logo-box */}

            {/*    <HeaderNavContent /> */}
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}
          <p
            className="text-center fw-bold"
            style={{
              color: "#224990",
              fontSize: "1.4rem",
              textTransform: "uppercase",
            }}
          >
            <span>
              <span style={{ color: "red" }}>G</span>LOBAL
            </span>{" "}
            <span>
              <span style={{ color: "red" }}>E</span>MPLOYABILITY
            </span>{" "}
            <span>
              <span style={{ color: "red" }}>I</span>NFORMATION
            </span>{" "}
            <span>
              <span style={{ color: "red" }}>S</span>ERVICES
            </span>{" "}
            <span>
              <span style={{ color: "red" }}>I</span>NDIA
            </span>{" "}
            <span>
              <span style={{ color: "red" }}>L</span>IMITED
            </span>{" "}
          </p>{" "}
          <div className="outer-box">
            {/* End notification-icon */}

            {/* <!-- Dashboard Option --> */}
            <div className="dropdown dashboard-option">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  alt="avatar"
                  className="thumb"
                  src="/images/resource/company-6.png"
                  width={50}
                  height={50}
                />
                <span className="name">My Account</span>
              </a>

              <ul className="dropdown-menu">
                {employerMenuData.map((item) => (
                  <li
                    className={`${
                      isActiveLink(item.routePath, usePathname())
                        ? "active"
                        : ""
                    } mb-1`}
                    key={item.id}
                  >
                    <Link href={item.routePath}>
                      <i className={`la ${item.icon}`}></i> {item.name}
                    </Link>
                  </li>
                ))}

                <li
                  className={`${
                    isActiveLink("/", usePathname()) ? "active" : ""
                  } mb-1`}
                  key={11}
                >
                  <Link href="/" onClick={() => localStorage.clear()}>
                    <i className={`la la-sign-out`}></i>Logout
                  </Link>
                </li>
              </ul>
            </div>
            {/* End dropdown */}
          </div>
          {/* End outer-box */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
