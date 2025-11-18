"use client";

import { useState } from "react";
import MobileMenu from "../../../header/InstituteMobileMenu";
import DashboardHeader from "../../../header/InstituteDashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardInstituteSidebar from "../../../header/DashboardInstituteSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
import SocialNetworkBox from "./components/SocialNetworkBox";
//
import ContactInfoBox from "./components/ContactInfoBox";

import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

/* component */
import AccountBox from "./components/account";
import KycBox from "./components/KycBox";
import BranchBox from "./components/brance";

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState("profile"); // Default active tab

  const companyDetails = {
    kycStatus: "Pending",
    name: "XYZ Technologies Pvt. Ltd.",
    addressLabel: "Primary Address",
    address: "1234 MG Road, Gurgaon, Haryana - 122002, India",
    country: "India",
    state: "Haryana",
    city: "Gurgaon",
    pincode: "122002",
    gstin: "29ABCDE1234F1Z5",
  };
  const tabs = [
    { key: "profile", label: "Institute Profile" },
    { key: "account", label: "Account Details" },
    { key: "contact", label: "Contact Person Details" },
    { key: "kyc", label: "KYC (Work Pending)" },
    { key: "social", label: "Social Network" },
    /*  { key: "brance", label: "Branch" }, */
  ];

  return (
    <>
      <style>{`.uploadButton .uploadButton-button {
    display: flex
;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    height: 60px;
    width: 120px;
    border-radius: 5px;
    transition: 0.3s;
    margin: 0;
    color: #1b2032;
    font-size: 16px;
    border: 2px dashed #ced4e1;
}`}</style>
      <div className="page-wrapper dashboard">
        <span className="header-span"></span>
        {/* Header Span for height */}

        <LoginPopup />
        <DashboardHeader />
        <MobileMenu />
        <DashboardInstituteSidebar />

        {/* Dashboard Section */}
        <section className="user-dashboard">
          <div className="dashboard-outer">
            <BreadCrumb title="Institute Profile!" />
            <MenuToggler />

            {/* Tabs Navigation */}

            <div className="mb-3">
              <div
                className="d-flex flex-wrap justify-content-start gap-2"
                style={{
                  borderBottom: "2px solid #ddd",
                  paddingBottom: "10px",
                }}
              >
                {tabs.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`btn ${
                      activeTab === key ? "btn-primary" : "btn-outline-primary"
                    }`}
                    style={{
                      minWidth: "120px",
                      fontWeight: "bold",
                      borderRadius: "20px",
                    }}
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="row">
              <div className="col-lg-12">
                <div className="ls-widget">
                  <div className="tabs-box">
                    {activeTab === "profile" && (
                      <div>
                        <div className="widget-title">
                          <h4>Institute Profile</h4>
                        </div>
                        <MyProfile setActiveTab={setActiveTab} />
                      </div>
                    )}

                    {activeTab === "kyc" && (
                      <div>
                        <div className="widget-title">
                          <h4>KYC</h4>
                        </div>
                        <div className="widget-content">
                          <KycBox
                            companyDetails={companyDetails}
                            setActiveTab={setActiveTab}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === "social" && (
                      <div>
                        <div className="widget-title">
                          <h4>Social Network</h4>
                        </div>
                        <div className="widget-content">
                          <SocialNetworkBox setActiveTab={setActiveTab} />
                        </div>
                      </div>
                    )}

                    {activeTab === "account" && (
                      <div>
                        <div className="widget-title">
                          <h4>Account Details</h4>
                        </div>
                        <div className="widget-content">
                          <AccountBox setActiveTab={setActiveTab} />
                        </div>
                      </div>
                    )}

                    {activeTab === "contact" && (
                      <div>
                        <div className="widget-title">
                          <h4>Contact Person Information</h4>
                        </div>
                        <div className="widget-content">
                          <ContactInfoBox setActiveTab={setActiveTab} />
                        </div>
                      </div>
                    )}

                    {/* {activeTab === "brance" && (
                      <div>
                        <BranchBox setActiveTab={setActiveTab} />
                      </div>
                    )} */}
                  </div>
                </div>
                {/* End ls-widget */}
              </div>
            </div>
            {/* End .row */}
          </div>
          {/* End dashboard-outer */}
        </section>
        {/* End Dashboard Section */}

        <CopyrightFooter />
      </div>
    </>
  );
};

export default CompanyProfile;
