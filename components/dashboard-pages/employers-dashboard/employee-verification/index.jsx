import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import TopCardBlock from "./components/TopCardBlock";
import TopCardBlock2 from "./components/TopCardBlock2";
import ProfileChart from "./components/ProfileChart";
import Notification from "./components/Notification";
import PendingApplicants from "./components/PendindingApplicants.jsx"; //need to change
import CompleteApplicants from "./components/CompleteApplicants.jsx"; //need to change
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("pending");
  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardEmployerSidebar />
      {/* <!-- End User Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Employee Verification!" />
          {/* breadCrumb */}
          <div className="row">
            <div className="col-lg-12">
              {/* Employees Widget */}
              <div className="applicants-widget ls-widget">
                <div className="widget-title">
                  <h4>Employees</h4>
                </div>

                <div className="widget-content">
                  {/* Tabs */}
                  <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
                        onClick={() => setActiveTab("pending")}
                      >
                        Pending
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "complete" ? "active" : ""}`}
                        onClick={() => setActiveTab("complete")}
                      >
                        Completed
                      </button>
                    </li>
                  </ul>

                  {/* Tab Content */}

                  {activeTab === "pending" && (
                    <>
                      <PendingApplicants />
                    </>
                  )}
                  {activeTab === "complete" && (
                    <>
                      <CompleteApplicants />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* End .row profile and notificatins */}
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

export default Index;
