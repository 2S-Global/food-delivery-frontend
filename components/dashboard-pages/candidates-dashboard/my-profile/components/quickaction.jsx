const QuickActionSidebar = ({
  menu,
  menuToggleHandler,
  activeSection,
  setShowPart1,
  setShowPart2,
  setShowPart3,
  setShowPart4,
  setShowPart5,
  setShowPart6,
}) => {
  const sections = [
    {
      label: "Overview",
      targetId: "head-section",
      onClick: () => setShowPart1(true),
    },
    {
      label: "KYC",
      targetId: "kyc-section",
      onClick: () => setShowPart1(true),
    },
    /*  {
      label: "Aadhar",
      targetId: "aadhar-section",
      onClick: () => setShowPart1(true),
    }, */
    {
      label: "Resume Headline",
      targetId: "resume-headline",
      onClick: () => setShowPart1(true),
    },
    {
      label: "Profile Summary",
      targetId: "profile-summary",
      onClick: () => setShowPart1(true),
    },
    {
      label: "Key Skills",
      targetId: "key-skill",
      onClick: () => setShowPart1(true),
    },
    {
      label: "Personal Details",
      targetId: "personal",
      onClick: () => setShowPart2(true),
    },
    {
      label: "Academics",
      targetId: "academy",
      onClick: () => setShowPart3(true),
    },
    // {
    //   label: "Accomplishments",
    //   targetId: "acom",
    //   onClick: () => setShowPart4(true),
    // },
    {
      label: "Online Profile",
      targetId: "acom-online-profile",
      onClick: () => setShowPart6(true),
    },
    {
      label: "Work Profile",
      targetId: "acom-work-profile",
      onClick: () => setShowPart6(true),
    },
    {
      label: "White Paper",
      targetId: "acom-white-paper",
      onClick: () => setShowPart6(true),
    },
    {
      label: "Presentation",
      targetId: "acom-presentation",
      onClick: () => setShowPart6(true),
    },
    {
      label: "Patent",
      targetId: "acom-patent",
      onClick: () => setShowPart6(true),
    },
    {
      label: "Certification",
      targetId: "acom-certification",
      onClick: () => setShowPart6(true),
    },
    {
      label: "Career Profile",
      targetId: "career",
      onClick: () => setShowPart4(true),
    },
    {
      label: "Employment",
      targetId: "employment",
      onClick: () => setShowPart5(true),
    },
    {
      label: "IT skills",
      targetId: "it-key",
      onClick: () => setShowPart5(true),
    },
    {
      label: "Other Skills",
      targetId: "other-skill",
      onClick: () => setShowPart5(true),
    },
    {
      label: "Projects",
      targetId: "projects",
      onClick: () => setShowPart5(true),
    },
    {
      label: "Resume",
      targetId: "resume-box",
      onClick: () => setShowPart5(true),
    },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust this value for your fixed header height
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/*     overflow: auto;
    transition: all 300ms ease;
    z-index: 9;
    border: 1px solid #ecedf2;
    box-shadow: 0px 6px 15px rgba(64, 79, 104, 0.05);
    
    
    user-sidebar
    */}
      <div
        className={`user-sidebar ${menu ? "sidebar_open" : ""}`}
        style={{
          paddingTop: "100px",
          paddingLeft: "20px",
          left: "auto",
          bottom: "auto",
          height: "100vh",
          overflowY: "auto",
          background: "#fff",
          borderRight: "1px solid #ecedf2",
          padding: "20px",
          overflow: "auto",
          transition: "all 300ms ease",
          zIndex: 9,
          position: "fixed", // ✅ valid here now
        }}
      >
        <div className="sidebar-inner">
          <h5>Quick Actions</h5>
          <ul className="navigation">
            {sections.map((section) => (
              <li
                key={section.targetId}
                className={`navItem ${activeSection === section.targetId ? "active" : ""}`}
                onClick={() => {
                  scrollToSection(section.targetId);
                  if (menuToggleHandler) menuToggleHandler();
                  // remove section.onClick from here if not needed on click
                }}
                onMouseEnter={() => {
                  if (section.onClick) section.onClick(); // trigger on hover
                }}
              >
                {section.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navItem {
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          transition:
            background-color 0.3s ease,
            color 0.3s ease;
          display: flex;
          align-items: center;
          color: #333;
          font-weight: 500;
        }

        .navItem:hover {
          background-color: #f3f4f6;
        }

        .active {
          background-color: #7367f0;
          color: #fff;
        }
      `}</style>
    </>
  );
};

export default QuickActionSidebar;
