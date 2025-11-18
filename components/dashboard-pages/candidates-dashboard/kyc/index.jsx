import React, { useState } from "react";
import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";

import KycBoxdemo from "../my-profile/components/KycBox";
import PaymentDetails from "./components/paynowtable";
import KycBox from "./components/Kycbox";
import AadharOtp from "./components/aadharotp";
import { tr } from "@faker-js/faker";

const KycPage = () => {
  const [activeTab, setActiveTab] = useState("kyc");

  const [allverified, setAllverified] = useState(false);
  const [aadharverified, setAadharverified] = useState(false);

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="KYC!" />
          {/* breadCrumb */}

          <MenuToggler />

          {/* Tab buttons */}
          <div className="mb-3">
            {/* Test */}

            <div
              className="row mb-4 align-items-center "
              style={{ background: "yellow" }}
            >
              <div className="col-12 mb-2">
                <h3 className="fw-semibold text-primary">Condition Toggle</h3>
              </div>

              <div className="col-auto">
                <button
                  className={`btn ${allverified ? "btn-primary" : "btn-outline-primary"} shadow-sm rounded-pill px-4 me-2`}
                  onClick={() => setAllverified(!allverified)}
                >
                  All Documents
                </button>
              </div>

              <div className="col-auto">
                <button
                  className={`btn ${aadharverified ? "btn-primary" : "btn-outline-primary"} shadow-sm rounded-pill px-4`}
                  onClick={() => setAadharverified(!aadharverified)}
                >
                  Aadhaar Card
                </button>
              </div>
            </div>
            {/* test  */}
            {!(allverified && aadharverified) && (
              <>
                {!aadharverified && (
                  <button
                    className={`btn ${activeTab === "adhar" ? "btn-primary" : "btn-outline-primary"} me-2`}
                    onClick={() => setActiveTab("adhar")}
                  >
                    Aadhaar Card
                  </button>
                )}

                <button
                  className={`btn ${activeTab === "kyc" ? "btn-primary" : "btn-outline-primary"} me-2`}
                  onClick={() => setActiveTab("kyc")}
                >
                  {aadharverified ? "All Documents" : " Other Documents"}
                </button>
                {!allverified && (
                  <button
                    className={`btn ${activeTab === "cart" ? "btn-primary" : "btn-outline-primary"} me-2`}
                    onClick={() => setActiveTab("cart")}
                  >
                    Cart
                  </button>
                )}
              </>
            )}
          </div>
          {/* Tab content */}
          <div className="row">
            <div className="col-lg-12">
              {activeTab === "kyc" && <KycBox />}
              {activeTab === "adhar" && <AadharOtp />}
              {activeTab === "cart" && (
                <PaymentDetails setActiveTab={setActiveTab} />
              )}
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default KycPage;
