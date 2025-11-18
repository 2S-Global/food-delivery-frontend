import React, { useEffect, useState, useRef } from "react";

import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";

/* component added */
import ResumeBox from "./components/resumebox";
import ResumeHeadlineSection from "./components/ResumeHeadlineSection";
import Keyskillsection from "./components/KeyskillSection";
import Employsectiondemo from "./components/Employmentsection";
import Employsectionmain from "./components/employment/main";
import Academysection from "./components/academicsection";
import ItkeySection from "./components/Itskillsection";
import OtherskillSection from "./components/otherskillsection";
import ProjectSection from "./components/projectSection";
import ProfilesumerySection from "./components/profilesummary";
import AcomSection from "./components/accomsection2";
import AcomSectiondemo from "./components/accomsection";
import AccomOnlineProfile from "./components/accom-online-profile";
import AccomWorkProfile from "./components/accom-work-profile";
import AccomWhitePaper from "./components/accom-white-paper";
import AccomPresentation from "./components/accom-online-presentation";
import AccomPatent from "./components/accom-online-patent";
import AccomCertification from "./components/accom-online-certification";
import Carrersection from "./components/carrersection";
import PersonalSection from "./components/Personal_details";

import HeadSection from "./components/HeadSection";
import KYCSection from "./components/KycSection new";
import QuickActionSidebar from "./components/quickaction";
import AadharSection from "./components/addhar/aadharsection";

const index = () => {
  const [showPart1, setShowPart1] = useState(true);
  const [showPart2, setShowPart2] = useState(false);
  const [showPart3, setShowPart3] = useState(false);
  const [showPart4, setShowPart4] = useState(false);
  const [showPart5, setShowPart5] = useState(false);
  const [showPart6, setShowPart6] = useState(false);

  useEffect(() => {
    const timers = [];

    timers.push(setTimeout(() => setShowPart1(true), 300000)); // Show after 300ms
    timers.push(setTimeout(() => setShowPart2(true), 9000000)); // After 900ms
    timers.push(setTimeout(() => setShowPart5(true), 15000000));
    timers.push(setTimeout(() => setShowPart5(true), 16000000));
    timers.push(setTimeout(() => setShowPart4(true), 200000));
    timers.push(setTimeout(() => setShowPart3(true), 10000000));

    return () => timers.forEach(clearTimeout); // Cleanup on unmount
  }, []);

  const useObserver = (callback, options = {}) => {
    const ref = useRef();

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      }, options);

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, [callback]);

    return ref;
  };

  const part1Ref = useObserver(() => setShowPart2(true));
  const part2Ref = useObserver(() => setShowPart3(true));
  const part3Ref = useObserver(() => setShowPart4(true));
  const part4Ref = useObserver(() => setShowPart5(true));

  return (
    <>
      <div
        className="page-wrapper dashboard container my-profile-page"
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
      >
        <span className="header-span"></span>
        {/* <!-- Header Span for hight --> */}

        <LoginPopup />
        {/* End Login Popup Modal */}

        <DashboardCandidatesHeader />
        {/* End Header */}

        <MobileMenu />
        {/* End MobileMenu */}
        <div className="row">
          {/*   <DashboardCandidatesSidebar /> */}
          <div className="col-lg-3 col-md-3">
            <QuickActionSidebar
              setShowPart1={setShowPart1}
              setShowPart2={setShowPart2}
              setShowPart3={setShowPart3}
              setShowPart4={setShowPart4}
              setShowPart5={setShowPart5}
              setShowPart6={setShowPart6}
            />
          </div>

          {/* <!-- End Candidates Sidebar Menu --> */}

          {/* <!-- Dashboard --> */}
          <section className="user-dashboard col-lg-9 col-md-9">
            <div className="dashboard-outer">
              <BreadCrumb title="My Profile!" />
              {/* breadCrumb */}

              {/*      <MenuToggler /> */}
              {/* Collapsible sidebar button */}

              <div className="row">
                {/* Quick action section */}

                <div className="col-lg-12 col-md-12">
                  {showPart1 && (
                    <div id="part1" ref={part1Ref}>
                      <div id="head-section">
                        <HeadSection />
                      </div>
                      <div id="kyc-section">
                        <KYCSection />
                      </div>
                      {/*   <div id="aadhar-section">
                        <AadharSection />
                      </div> */}
                      <div id="resume-headline">
                        <ResumeHeadlineSection />
                      </div>
                      <div id="profile-summary">
                        <ProfilesumerySection />
                      </div>
                      <div id="key-skill">
                        <Keyskillsection />
                      </div>
                    </div>
                  )}

                  {showPart2 && (
                    <div id="part2" ref={part2Ref}>
                      <div id="personal">
                        <PersonalSection />
                      </div>
                    </div>
                  )}

                  {showPart3 && (
                    <div id="part3" ref={part3Ref}>
                      <div id="academy">
                        <Academysection />
                      </div>
                    </div>
                  )}

                  {showPart4 && (
                    <div id="part4" ref={part4Ref}>
                      {/* <div id="acom">
                        <AcomSection />
                      </div> */}
                      <h5>Accomplishments</h5>
                      <div id="acom-online-profile">
                        <AccomOnlineProfile />
                      </div>
                      <div id="acom-work-profile">
                        <AccomWorkProfile />
                      </div>
                      <div id="acom-white-paper">
                        <AccomWhitePaper />
                      </div>
                      <div id="acom-presentation">
                        <AccomPresentation />
                      </div>
                      <div id="acom-patent">
                        <AccomPatent />
                      </div>
                      <div id="acom-certification">
                        <AccomCertification />
                      </div>
                      <div id="career">
                        <Carrersection />
                      </div>
                    </div>
                  )}

                  {showPart5 && (
                    <div id="part5">
                      <div id="employment">
                        <Employsectionmain />
                      </div>
                      <div id="it-key">
                        <ItkeySection />
                      </div>
                      <div id="other-skill">
                        <OtherskillSection />
                      </div>
                      <div id="projects">
                        <ProjectSection />
                      </div>
                      <div id="resume-box">
                        <ResumeBox />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End dashboard-outer */}
          </section>
          {/* <!-- End Dashboard --> */}
        </div>
        <CopyrightFooter />
        {/* <!-- End Copyright --> */}
      </div>
    </>
  );
};

export default index;
