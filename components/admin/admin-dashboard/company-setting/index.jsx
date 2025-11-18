import MobileMenu from "../../../header/AdminMobileMenu";
import DashboardHeader from "../../../header/DashboardAdminheader";
import DashboardEmployerSidebar from "../../../header/DashboardAdminsidebar";
import axios from "axios";
import CopyrightFooter from "../../CopyrightFooter";

import Companytable from "./components/table";

import AddfieldModal from "./components/modals/addfield";
import { useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
const Index = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const openModalRH = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  useEffect(() => {
    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    const fetchCompanyName = async () => {
      try {
        const response = await axios.post(
          `${apiurl}/api/auth/get_company_details`,
          { company_id: id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompanyName(response.data.data.name);
      } catch (error) {
        console.error("Error fetching company name:", error);
      }
    };

    fetchCompanyName();
  }, [apiurl]);

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
                    <h4>Field List ( {companyName})</h4>

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
                      Add Field
                    </span>
                  </div>
                  <Companytable />
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
        <AddfieldModal show={isModalOpen} onClose={closeModalRH} />
      )}
    </>
  );
};

export default Index;
