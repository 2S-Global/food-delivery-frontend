"use client";
import { Briefcase, FileText, MessageSquare, Bookmark } from "lucide-react";

const TopCardBlock = () => {
  const cardContent = [
    {
      id: 1,
      icon: <Briefcase size={22} className="text-primary" />,
      countNumber: "22",
      metaName: "Posted Jobs",
    },
    {
      id: 2,
      icon: <FileText size={22} className="text-danger" />,
      countNumber: "93820",
      metaName: "Application",
    },
    {
      id: 3,
      icon: <MessageSquare size={22} className="text-warning" />,
      countNumber: "74",
      metaName: "Messages",
    },
    {
      id: 4,
      icon: <Bookmark size={22} className="text-success" />,
      countNumber: "32",
      metaName: "Shortlist",
    },
  ];

  return (
    <div className="row">
      {cardContent.map((item) => (
        <div
          key={item.id}
          className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3"
        >
          <div className="d-flex align-items-center p-3 rounded shadow-sm bg-white">
            {/* Icon Box */}
            <div
              className="me-3 d-flex align-items-center justify-content-center rounded"
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "#f0f2f5",
              }}
            >
              {item.icon}
            </div>

            {/* Text Content */}
            <div className="flex-grow-1">
              <h4
                className="mb-0 fw-bold fs-5 text-truncate"
                style={{ maxWidth: "100%" }}
                title={item.countNumber}
              >
                {item.countNumber}
              </h4>
              <p className="mb-0 small text-muted">{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCardBlock;
