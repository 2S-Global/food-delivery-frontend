import React, { useState, useEffect } from "react";
import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import TopCardBlock from "./components/TopCardBlock";
import ProfileChart from "./components/ProfileChart";
import Notification from "./components/Notification";
import CopyrightFooter from "../../CopyrightFooter";
import JobApplied from "./components/JobApplied";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import ScoreSection from "../my-profile/components/scoreSection";
import ComingSoon from "@/components/common/commingsoon";

import axios from "axios";

const Index = () => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [name, setName] = useState("");
  const token = localStorage.getItem("candidate_token");

  useEffect(() => {
    fetchName();
  }, [token]);

  /* /api/userdata/get_only_student_name */

  const fetchName = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/api/userdata/get_only_student_name`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.data.name) {
        setName("Guest");
      } else {
        setName(response.data.name);
      }
    } catch (error) {
      console.error(error);
    }
  };
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
          <BreadCrumb title={"Hello, " + name + "!!"} />

          {/* breadCrumb */}
          {/* Score  section*/}
          <ScoreSection />

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row"></div>
          {/* End .row top card block */}
          {/*  <ComingSoon> */}
          <div className="row">
            <TopCardBlock />

            <div className="col-xl-7 col-lg-12">
              {/* <!-- Graph widget --> */}
              <div className="graph-widget ls-widget">
                <ProfileChart />
              </div>
              {/* End profile chart */}
            </div>
            {/* End .col */}

            <div className="col-xl-5 col-lg-12 position-relative mb-2">
              <div
                className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 
               d-flex justify-content-center align-items-center text-white fw-bold fs-4"
                style={{ zIndex: 1050 }}
              >
                Activating Soon
              </div>
              {/* <!-- Notification Widget --> */}
              <div className="notification-widget ls-widget">
                <div className="widget-title">
                  <h4>Notifications</h4>
                </div>
                <div className="widget-content">
                  <Notification />
                </div>
              </div>
            </div>
            {/* End .col */}

            <div className="col-lg-12 ">
              {/* <!-- applicants Widget --> */}
              <div className="applicants-widget ls-widget">
                <div className="widget-title">
                  <h4>Jobs Applied Recently</h4>
                </div>
                <div className="widget-content">
                  <div className="row">
                    {/* <!-- Candidate block three --> */}

                    <JobApplied />
                  </div>
                </div>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* </ComingSoon> */}
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
