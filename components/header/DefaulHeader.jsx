"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";
import axios from "axios";

const DefaulHeader = () => {
  const [navbar, setNavbar] = useState(true);

  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token") || null;
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
    if (token) {
      fetchimage();
    }
  }, [token]);

  return (
    // <!-- Main Header-->
    <header
      className={`main-header  ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      {/* <!-- Main box --> */}
      <div className="main-box">
        {/* <!--Nav Outer --> */}
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                <Image
                  width={154}
                  height={50}
                  src="/images/logo.svg"
                  alt="brand"
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
              <li className={`mb-1`} key={0}>
                <Link href="/">
                  <i
                    className="la la-home
                    "
                    aria-hidden="true"
                  ></i>
                  Dashboard
                </Link>
              </li>{" "}
              <li className={` mb-1`} key={3}>
                <Link href="/" onClick={() => localStorage.clear()}>
                  <i className="la la-sign-out" aria-hidden="true"></i>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
          {/* End dropdown */}
        </div>
      </div>
    </header>
  );
};

export default DefaulHeader;
