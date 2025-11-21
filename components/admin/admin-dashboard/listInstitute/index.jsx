import MobileMenu from "../../../header/AdminMobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";

import CopyrightFooter from "../../CopyrightFooter";

import Institutetable from "./components/table";

import AddCompanyModal from "./components/modals/addinstitute";
import AddCsvModal from "./components/modals/csv";
import { useState } from "react";
const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const openModalRH = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const openCsvModal = () => {
    setIsCsvModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const closeModalCsv = () => {
    setIsCsvModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };
  return (
    <>
      <div className="page-wrapper dashboard ">
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
                  <div className="widget-title">
                    <h4>Order List</h4>

                    <div style={{ display: "flex", gap: "15px" }}>
                      <span
                        onClick={openModalRH}
                        style={{
                          cursor: "pointer",
                          float: "right",
                          color: "#275df5",
                          fontWeight: 700,
                          fontSize: "16px",
                        }}
                      >
                        Add Order
                      </span>

                      <span
                        onClick={openCsvModal}
                        style={{
                          cursor: "pointer",
                          color: "#13cfcf",
                          fontWeight: 500,
                          fontSize: "16px",
                        }}
                      >
                        Import CSV
                      </span>
                    </div>
                  </div>
                  <Institutetable />
                </div>
              </div>
            </div>
          </div>
          {/* End dashboard-outer */}
        </section>
        {/* <!-- End Dashboard --> */}

        <CopyrightFooter />
        {/* <!-- End Copyright --> */}
      </div>
      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && (
        <AddCompanyModal show={isModalOpen} onClose={closeModalRH} />
      )}

      {isCsvModalOpen && (
        <AddCsvModal show={openCsvModal} onClose={closeModalCsv} />
      )}
    </>
  );
};

export default Index;
