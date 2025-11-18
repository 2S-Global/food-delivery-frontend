import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";

import CopyrightFooter from "../../CopyrightFooter";
import Form from "./components/form";
import Companytable from "./components/table";

import React, { useState } from "react";

const Index = () => {
  const [showtable, setShowtable] = useState(false);
  const today = new Date();
  // 1st of current month
  const firstDayOfThisMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  // 1st of next month
  const firstDayOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );

  const [startDate, setStartDate] = useState(firstDayOfThisMonth);
  const [endDate, setEndDate] = useState(firstDayOfNextMonth);
  const [loading, setLoading] = useState(false);
  return (
    <div className="d-flex flex-column min-vh-100 page-wrapper dashboard">
      <span className="header-span"></span>
      <DashboardHeader />
      <MobileMenu />
      <DashboardEmployerSidebar />

      {/* Make this section flexible */}
      <div className="flex-grow-1">
        <section className="user-dashboard">
          <div className="dashboard-outer">
            <div className="row">
              <div className="col-lg-12">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="applicants-widget ls-widget">
                    <div className="widget-content">
                      <div className="col-lg-12 col-md-12 py-2">
                        <h5>
                          <strong>Generate Report</strong>
                        </h5>
                      </div>
                      <Form
                        showtable={showtable}
                        setShowtable={setShowtable}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        loading={loading}
                        setLoading={setLoading}
                      />
                    </div>

                    {/* for table */}
                    {showtable && (
                      <div className="widget-content">
                        <div className="col-lg-12 col-md-12 py-2">
                          <h5>
                            <strong>List Report</strong>
                          </h5>
                        </div>
                        <Companytable
                          startDate={startDate}
                          setStartDate={setStartDate}
                          endDate={endDate}
                          setEndDate={setEndDate}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <CopyrightFooter />
    </div>
  );
};

export default Index;
