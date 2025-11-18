import React, { useState, useEffect } from "react";
import CertificateModal from "./Modal.jsx";

const CertificateMain = ({ setReload, list = [], setError, setSuccess }) => {
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

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      <div className="pt-4">
        <h5>
          Certification
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
          Add details of certifications you have completed
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
              <span>
                Valid from: {monthNames[item.validityFrommonth - 1]}{" "}
                {item.validityFromyear} .
              </span>

              {item.doesNotExpire ? (
                <>
                  <span className="mx-2">Does not expire.</span>
                </>
              ) : (
                <>
                  <span className="mx-2">
                    Valid till: {monthNames[item.validityToMonth - 1]}{" "}
                    {item.validityToyear}.
                  </span>
                </>
              )}
            </div>
          ))}
      </div>
      {isModalOpen && (
        <CertificateModal
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

export default CertificateMain;
