"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

const Header = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = useCallback(() => {
    setNavbar(window.scrollY >= 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, [changeBackground]);

  return (
    <header
      className={`main-header ${navbar ? "fixed-header animated slideInDown" : ""}`}
    >
      <div className="container-fluid">
        {/* Main box */}
        <div className="main-box">
          {/* Nav Outer */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/" className="noSticky">
                  <Image
                    width={154}
                    height={50}
                    src="/images/Logo3.png"
                    alt="logo"
                    title="brand"
                  />
                </Link>
                <Link href="/" className="isSticky">
                  <Image
                    width={154}
                    height={50}
                    src="/images/logo.svg"
                    alt="logo"
                    title="brand"
                  />
                </Link>
              </div>
            </div>
          </div>
          {/* End nav-outer */}

          <div className="outer-box">
            {/* Login/Register */}
            <div className="btn-box">
              <Link
                href="/employers-dashboard/post-jobs"
                className="theme-btn btn-style-one"
              >
                <span className="btn-title">Job Post</span>
              </Link>
            </div>
          </div>
          {/* End outer-box */}
        </div>
      </div>
    </header>
  );
};

export default Header;
