import MobileMenu from "../../../header/AdminMobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";
import BreadCrumb from "../../BreadCrumb";
import TopCardBlock from "./components/TopCardBlock";
import ProfileChart from "./components/ProfileChart";
import Notification from "./components/Notification";

import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";

const Index = () => {
  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      <DashboardHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardEmployerSidebar />
      {/* <!-- End User Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <div className="row">
            <TopCardBlock />
          </div>
          {/* End .row top card block */}

          <div className="row">
            <div className="col-xl-12 col-lg-12">
              {/* <!-- Graph widget --> */}
              <div className="graph-widget ls-widget">
                <ProfileChart />
              </div>
              {/* End profile chart */}
            </div>
            {/* End .col */}

            {/* End .col */}

            {/* End .col */}
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
