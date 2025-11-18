"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useCallback } from "react";
import ProfileModal from "./modal/ProfileModal";
import WorksampleModal from "./modal/WorksampleModal";
import ResearchModal from "./modal/ResearchModal";
import PresentationModal from "./modal/PresentationModal";
import PatentModal from "./modal/PatentModal";
import CertificationModal from "./modal/CertificationModal";

const accomplishments = [
  {
    id: "1",
    key: "profile",
    title: "Online Profile",
    description:
      "Add link to online professional profiles (e.g. LinkedIn, etc.)",
    component: ProfileModal,
  },
  {
    id: "2",
    key: "workSample",
    title: "Work Sample",
    description: "Link relevant work samples (e.g. GitHub, Behance)",
    component: WorksampleModal,
  },
  {
    id: "3",
    key: "research",
    title: "White Paper / Research Publication / Journal Entry",
    description: "Add links to your online publications",
    component: ResearchModal,
  },
  {
    id: "4",
    key: "presentation",
    title: "Presentation",
    description:
      "Add links to your online presentations (e.g. SlideShare, etc.)",
    component: PresentationModal,
  },
  {
    id: "5",
    key: "patent",
    title: "Patent",
    description: "Add details of patents you have filed",
    component: PatentModal,
  },
  {
    id: "6",
    key: "certification",
    title: "Certification",
    description: "Add details of certifications you have completed",
    component: CertificationModal,
  },
];

const AcomSectiondemo = () => {
  const [activeModal, setActiveModal] = useState(null); // Stores the currently active modal key

  // Open modal dynamically and disable scrolling
  const openModal = useCallback((key) => {
    setActiveModal(key);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  }, []);

  // Close modal and re-enable scrolling
  const closeModal = useCallback(() => {
    setActiveModal(null);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  }, []);

  return (
    <>
      <div className="ls-widget">
        <div className="tabs-box">
          <div className="widget-title">
            <h4>Accomplishments (demo for testing)</h4>
          </div>

          <div className="widget-content">
            {accomplishments.map((item) => (
              <div key={item.key} className="accomplishment-item">
                <h5>
                  {item.title}
                  <span
                    onClick={() => openModal(item.key)}
                    style={{
                      cursor: "pointer",
                      float: "right",
                      color: "#275df5",
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    Add
                  </span>
                </h5>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Render the correct modal dynamically */}
      {accomplishments.map(
        (item) =>
          activeModal === item.key && (
            <item.component key={item.key} show={true} onClose={closeModal} />
          )
      )}
    </>
  );
};

export default AcomSectiondemo;
