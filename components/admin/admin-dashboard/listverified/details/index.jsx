import MobileMenu from "../../../../header/AdminMobileMenu";

import DashboardHeader from "../../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../../header/DashboardAdminsidebar";
import CopyrightFooter from "../../../CopyrightFooter";
import WidgetContentBox from "@/components/dashboard-pages/employers-dashboard/list-verified-employee/details/components/WidgetContentBox";
const index = () => {
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
            <div className="col-lg-12">
              <div className="applicants-widget ls-widget">
                <WidgetContentBox />
              </div>
              {/* <!-- applicants Widget --> */}
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

export default index;
