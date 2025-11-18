import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaBirthdayCake,
  FaCheckCircle,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";

import Cardedit from "../modal/cardeditModal";
import OTPModel from "../modal/OTPModal";
const ProfileCard = ({
  name,
  degree,
  location,
  father_name,
  mother_name,
  phone,
  email,
  gender,
  dob,
  setReload,
  setError,
  setSuccess,
  isIndianNumber,
  numberVerified,
  salary,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenotp, setIsModalOpenotp] = useState(false);

  const openModalRH = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const openModalRHotp = () => {
    setIsModalOpenotp(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  const closeModalRHotp = () => {
    setIsModalOpenotp(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  return (
    <>
      <div className="">
        <div className="card-body p-4">
          {/* Name & Degree Section */}
          <div className="mb-3">
            <h4 className="fw-bold d-flex align-items-center gap-2 mb-2">
              <span className="fs-6">{name}</span>
              {gender && (
                <span className="fs-6 fw-normal text-muted">({gender})</span>
              )}
              <i
                className="la la-pencil-alt "
                onClick={openModalRH}
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </h4>

            {degree && (
              <div className="fs-6 fw-semibold text-dark">{degree}</div>
            )}
            {/*  {father_name && (
              <div className="fs-6 text-muted">
                <span className="fw-semibold">Father's Name:</span>{" "}
                {father_name}
              </div>
            )}
            {mother_name && (
              <div className="fs-6 text-muted">
                <span className="fw-semibold">Mother's Name:</span>{" "}
                {mother_name}
              </div>
            )} */}
          </div>

          {/* Info Section */}
          <div className="row">
            <div className="col-md-12">
              {location && (
                <p className="mb-2 d-flex align-items-center text-secondary">
                  <FaMapMarkerAlt className="me-2" /> {location}
                </p>
              )}
              {dob && (
                <p className="mb-2 d-flex align-items-center text-secondary">
                  <FaBirthdayCake className="me-2" /> {dob}
                </p>
              )}
              {salary && (
                <p className="mb-2 d-flex align-items-center text-secondary">
                  <FaRegMoneyBillAlt className="me-2" /> {salary}
                </p>
              )}
              <p
                className="mb-2 d-flex align-items-center text-secondary text-nowrap text-truncate "
                title={phone}
              >
                <FaPhone className="me-2" />
                {/*  {phone} */}
                {phone?.length > 10 ? phone.substring(0, 10) + "..." : phone}
                {numberVerified && (
                  <FaCheckCircle className="ms-2 text-success" />
                )}
                {!numberVerified && (
                  <>
                    <FaRegCircleXmark className="ms-2 text-danger" />
                    {isIndianNumber ? (
                      <button
                        className="btn btn-primary ms-2"
                        style={{
                          fontSize: "10px",
                          padding: "2px 6px",
                          lineHeight: 1,
                        }}
                        onClick={openModalRHotp}
                      >
                        Verify Now
                      </button>
                    ) : (
                      <FaRegCircleXmark className="ms-2 text-danger" />
                    )}
                  </>
                )}
              </p>
              <p
                className="mb-0 d-flex align-items-center text-secondary"
                title={email}
              >
                <FaEnvelope className="me-2" />{" "}
                {email?.length > 15 ? email.substring(0, 15) + "..." : email}
                <FaCheckCircle className="ms-2 text-success" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Cardedit
          show={isModalOpen}
          onClose={closeModalRH}
          setReload={setReload}
          setError_main={setError}
          setSuccess_main={setSuccess}
        />
      )}

      {isModalOpenotp && (
        <OTPModel
          phone={phone}
          show={isModalOpenotp}
          onClose={closeModalRHotp}
          setReload={setReload}
          setError_main={setError}
          setSuccess_main={setSuccess}
        />
      )}
    </>
  );
};

export default ProfileCard;
