"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import employerMenuData from "../../data/employerMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const [navbar, setNavbar] = useState(true);
  const [userData, setUserData] = useState();
  const changeBackground = () => {
    if (window.scrollY >= 0) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);

    const fetchSwitchedRoleUser = async () => {
      try {
        const apiurl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("employer_token"); // Or whichever token you're using
        const response = await axios.get(
          `${apiurl}/api/companyRoutes/switched-role-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data.check_role);
        console.log("Switched user data:", response.data);
      } catch (error) {
        console.error("Failed to fetch switched role user:", error);
      }
    };

    //  fetchSwitchedRoleUser();
  }, []);

  const router = useRouter();

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
                    height={50}
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
              <span className="count">1</span>
              <span className="icon la la-heart-o"></span>
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
                {employerMenuData
                  .filter((item) => [16, 17, 18].includes(item.id))
                  .map((item) => (
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

                {/*    <li
                  className={`${
                    isActiveLink("/", usePathname()) ? "active" : ""
                  } mb-1`}
                  key={11}
                >
                  <Link href="/" onClick={() => localStorage.clear()}>
                    <i className={`la la-sign-out`}></i>Logout
                  </Link>
                </li> */}
                {userData && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          const token = localStorage.getItem("employer_token");

                          localStorage.setItem("Institute_token", token);
                          //  console.log(localStorage.getItem("employer_token"));
                          router.replace("/institute-dashboard/dashboard");
                        }}
                      >
                        Switch to Institute
                      </button>
                    </li>
                  </>
                )}
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
