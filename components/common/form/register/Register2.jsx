"use client";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LoginWithSocial from "./LoginWithSocial";
import FormContent2 from "./FormContent";
import FormContentcom from "./companyform";
import InstituteFormContent from "./InstituteRegister";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
const Register2 = () => {
  const handlecompanyclick = () => {
    handleExternalLink("https://2sglobal.co/");
  };
  const handleExternalLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="form-inner p-4">
      <div className="mb-3 d-flex justify-content-center pb-4 pt-4">
        <img
          alt="brand"
          src="/images/Gesil.png"
          /* width={200}
          height={60} */
          /*   style={{ height: "200px" }} */
          /*  priority */
        />
      </div>

      <Tabs>
        <div className="form-group register-dual">
          <TabList className="btn-box row">
            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-user"></i> Candidate
              </button>
            </Tab>

            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-briefcase"></i> Employer
              </button>
            </Tab>
            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-user"></i> Institute
              </button>
            </Tab>
          </TabList>
        </div>
        {/* End .form-group */}

        <TabPanel>
          <FormContent2 />
        </TabPanel>
        {/* End cadidates Form */}

        <TabPanel>
          <FormContentcom />
        </TabPanel>

        {/* Institute */}
        <TabPanel>
          <InstituteFormContent />
        </TabPanel>
      </Tabs>
      {/* End form-group */}

      <div className="bottom-box mt-1">
        <div className="text">
          Already have an account?{" "}
          <Link
            href="/login"
            className="call-modal login"
            style={{ color: "blue" }}
          >
            LogIn
          </Link>
        </div>
        {/* <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial /> */}
      </div>
      {/* End bottom-box LoginWithSocial */}

      <div className="mt-2 text-center">
        <p className="text-muted small">
          Developed and maintained by{" "}
          <strong
            className="text-dark"
            onClick={handlecompanyclick}
            style={{ cursor: "pointer" }}
          >
            2S Global Technologies Ltd
          </strong>
        </p>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-2">
        <button
          onClick={() =>
            handleExternalLink(
              "https://www.facebook.com/profile.php?id=61575548305003"
            )
          }
          className="btn btn-outline-primary rounded-circle"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </button>
        <button
          onClick={() =>
            handleExternalLink(
              "https://www.linkedin.com/company/global-employability-information-services-india-limited/"
            )
          }
          className="btn btn-outline-primary rounded-circle"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn />
        </button>
      </div>
    </div>
  );
};

export default Register2;
