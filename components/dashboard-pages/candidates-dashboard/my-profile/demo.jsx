"use client";

import { useState } from "react";
import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
import KycBox from "./components/KycBox";
import AcademicBox from "./components/academicBox2";
import SocialNetworkBox from "./components/SocialNetworkBox";
import ContactInfoBox from "./components/ContactInfoBox";
import CopyrightFooter from "../../CopyrightFooter";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";

const steps = ["Profile", "KYC", "Academic ", "Social Network", "Contact Info"];

const CanProfile = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleSubmit = () => {
    alert("Company Profile submitted successfully!");
  };

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      <LoginPopup />
      <DashboardCandidatesHeader />
      <MobileMenu />
      <DashboardCandidatesSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Company Profile!" />
          <MenuToggler />

          {/* Stepper Navigation */}
          <div className="container my-4">
            <div className="stepper">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`step ${index <= activeStep ? "active" : ""}`}
                  onClick={() => setActiveStep(index)}
                  style={{ cursor: "pointer" }} // Makes it clickable
                >
                  <div className="step-content">
                    <div className="step-icon">
                      {index < activeStep ? "✔" : index + 1}
                    </div>
                    <span className="step-label">{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  {activeStep === 0 && (
                    <div>
                      <div className="widget-title">
                        <h4>My Profile</h4>
                      </div>
                      <MyProfile />
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div>
                      <div className="widget-title">
                        <h4>KYC</h4>
                      </div>
                      <div className="widget-content">
                        <KycBox />
                      </div>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div>
                      <div className="widget-title">
                        <h4>Academic</h4>
                      </div>
                      <div className="widget-content">
                        <AcademicBox />
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div>
                      <div className="widget-title">
                        <h4>Social Network</h4>
                      </div>
                      <div className="widget-content">
                        <SocialNetworkBox />
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div>
                      <div className="widget-title">
                        <h4>Contact Information</h4>
                      </div>
                      <div className="widget-content">
                        <ContactInfoBox />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4 container">
            <button
              className="btn btn-outline-primary"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              Previous
            </button>

            {activeStep === steps.length - 1 ? (
              <button className="btn btn-success" onClick={handleSubmit}>
                Submit
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() =>
                  setActiveStep(Math.min(steps.length - 1, activeStep + 1))
                }
              >
                Next
              </button>
            )}
          </div>
        </div>
      </section>

      <CopyrightFooter />
    </div>
  );
};

export default CanProfile;
