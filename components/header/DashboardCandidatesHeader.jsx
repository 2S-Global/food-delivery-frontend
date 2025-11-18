"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import candidatesMenuData from "../../data/candidatesMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import axios from "axios";
import { usePathname } from "next/navigation";
const DashboardCandidatesHeader = () => {
  const [navbar, setNavbar] = useState(true);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  const [image, setImage] = useState("/images/resource/no_user.png");

  const fetchimage = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/api/userdata/get_candidate_img`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setImage(response.data.data.profilePicture);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchimage();
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
                <Link href="/">
                  <Image
                    alt="brand"
                    src="/images/Logo3.png"
                    width={154}
                    height={60}
                    style={{ height: "60px" }}
                    priority
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <HeaderNavContent />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            <button className="menu-btn">
              {/* <span className="count"></span> */}
              <Link href="/candidates-dashboard/cart">
                <span className="icon la la-shopping-cart"></span>
              </Link>
            </button>
            {/* wishlisted menu */}

            <button className="menu-btn">
              <span className="icon la la-bell"></span>
            </button>
            {/* End notification-icon */}

            {/* <!-- Dashboard Option --> */}
            <div className="dropdown dashboard-option">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  alt="avatar"
                  className="thumb"
                  src={image}
                  width={50}
                  height={50}
                />
                <span className="name">My Account</span>
              </a>

              <ul className="dropdown-menu">
                <li
                  className={`${
                    isActiveLink(
                      "/candidates-dashboard/dashboard",
                      usePathname()
                    )
                      ? "active"
                      : ""
                  } mb-1`}
                  key={0}
                >
                  <Link href="/candidates-dashboard/dashboard">
                    <i
                      className="la la-home
                    "
                      aria-hidden="true"
                    ></i>
                    Dashboard
                  </Link>
                </li>{" "}
                <li
                  className={`${
                    isActiveLink(
                      "/candidates-dashboard/my-profile",
                      usePathname()
                    )
                      ? "active"
                      : ""
                  } mb-1`}
                  key={1}
                >
                  <Link href="/candidates-dashboard/my-profile">
                    <i
                      className="la la-user
                    "
                      aria-hidden="true"
                    ></i>
                    My Profile
                  </Link>
                </li>{" "}
                <li
                  className={`${
                    isActiveLink(
                      "/candidates-dashboard/change-password",
                      usePathname()
                    )
                      ? "active"
                      : ""
                  } mb-1`}
                  key={2}
                >
                  <Link href="/candidates-dashboard/change-password">
                    <i className="la la-key" aria-hidden="true"></i>
                    Change Password
                  </Link>
                </li>
                <li
                  className={`${
                    isActiveLink("/", usePathname()) ? "active" : ""
                  } mb-1`}
                  key={3}
                >
                  <Link href="/" onClick={() => localStorage.clear()}>
                    <i className="la la-sign-out" aria-hidden="true"></i>
                    Logout
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

export default DashboardCandidatesHeader;
