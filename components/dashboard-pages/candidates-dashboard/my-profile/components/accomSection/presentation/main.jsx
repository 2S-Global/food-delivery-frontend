import React, { useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";

const PresentationMain = ({ setReload, list = [], setError, setSuccess }) => {
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
          Presentation
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
          Add links to your online presentations (e.g. SlideShare, etc.)
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
                {item.title}

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

              <span
                style={{ textAlign: "justify" }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></span>
            </div>
          ))}
      </div>
      {isModalOpen && (
        <ProfileModal
          show={isModalOpen}
          onClose={closeModal}
          setItem={setItem}
          item={item}
          setReload={setReload}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default PresentationMain;
