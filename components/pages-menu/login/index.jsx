"use client";

import FormContent2 from "../../common/form/login/FormContent2";
import MobileMenu from "../../header/MobileMenu";
import Header from "./Header";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Disable scrolling
    // document.body.style.overflow = "hidden";

    return () => {
      // Enable scrolling when component unmounts
      //   document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      {/*       <Header /> */}
      {/* <!--End Main Header -->  */}

      {/* <MobileMenu /> */}
      {/* End MobileMenu */}

      {/* <div className="login-section">
        <div
          className="image-layer"
          style={{ backgroundImage: "url(/images/background/12.jpg)" }}
        ></div>
        <div className="outer-box">
          <div className="login-form default-form">
            <FormContent2 />
          </div>
        </div>
      </div> */}

      <div
        style={{
          backgroundColor: "#EBE8E2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="flex-grow"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 0 60px",
            overflow: "auto",
          }}
        >
          <div
            className="login-form default-form"
            style={{ backgroundColor: "#FFFFFF", maxWidth: "600px" }}
          >
            <FormContent2 />
          </div>
        </div>
      </div>
      {/* <!-- End Info Section --> */}
    </>
  );
};

export default Index;
