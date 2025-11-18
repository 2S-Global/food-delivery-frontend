import React, { useState, useEffect } from "react";
import WorksampleModal from "./WorksampleModal";

const Workmain = ({ setReload, list = [], setError, setSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState([]);

  const openModal = (Edit_item) => {
    if (Edit_item) {
      setItem(Edit_item);
      console.log("Selected Item:", item);
    } else {
      setItem([]);
    }
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };
  return (
    <>
      <div className="pt-4">
        <h5>
          Work Profile
          <span
            onClick={() => openModal()}
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
        <span className="text-muted mb-2 mt-1">
          Link relevant work Profile (e.g. GitHub, Behance)
        </span>

        {/* dont render if list is empty */}
        {Array.isArray(list) &&
          list.length > 0 &&
          list.map((item) => (
            <div key={item._id} className="my-2" style={{ lineHeight: "1.4" }}>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                {item.workTitle}

                <i
                  onClick={() => openModal(item)}
                  className="la la-pencil-alt ms-2"
                  style={{ cursor: "pointer" }}
                ></i>
              </span>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  color: "#275df5",
                  fontWeight: 500,
                }}
              >
                {item.url}
              </a>

              <span className="text-muted">
                Duration: {item.durationFrom.month} {item.durationFrom.year} -{" "}
                {item.currentlyWorking === true ? (
                  "Present"
                ) : (
                  <>
                    {item.durationTo.month} {item.durationTo.year}
                  </>
                )}
              </span>
              <br />

              <span
                style={{ textAlign: "justify" }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></span>
            </div>
          ))}
      </div>
      {isModalOpen && (
        <WorksampleModal
          show={isModalOpen}
          onClose={closeModal}
          setItem={setItem}
          item={item}
          setReload={setReload}
          setmainError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default Workmain;
