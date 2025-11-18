import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Profilepic from "../modal/ChangeProfilepic";
import { Pencil } from "lucide-react";

const CircularProgress = ({
  progress,
  imageSrc,
  setReload,
  setError,
  setSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getStrokeColor = () => {
    if (progress < 50) return "#EF4444"; // Red
    if (progress < 80) return "#F59E0B"; // Orange
    return "#10B981"; // Green
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center p-3 w-100">
        <div style={{ width: "100%", maxWidth: "7.5rem", aspectRatio: 1 }}>
          <CircularProgressbarWithChildren
            value={progress}
            styles={buildStyles({
              pathColor: getStrokeColor(),
              trailColor: "#E5E7EB",
              strokeLinecap: "round",
            })}
          >
            {/* Profile Picture Container */}
            <div
              className="position-relative mx-auto"
              style={{
                width: "80%",
                aspectRatio: 1,
                borderRadius: "50%",
                overflow: "hidden",
                /*    cursor: "pointer", */
                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              }}
              /*  onClick={openModal} */
            >
              <img
                src={imageSrc || "/images/resource/no_user.png"}
                alt="Profile"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              className="position-absolute"
              style={{
                bottom: 0,
                right: 0,
                transform: "translate(50%, 50%)", // move half outside the circle
                /*   backgroundColor: "white", */
                borderRadius: "50%",
                /* padding: "6px",
                boxShadow: "0 0 5px rgba(0,0,0,0.3)", */
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s",
              }}
              onClick={openModal}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  "translate(50%, 50%) scale(1.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform =
                  "translate(50%, 50%) scale(1)")
              }
            >
              <Pencil size={8} /* color="blue"  */ />
            </div>
          </CircularProgressbarWithChildren>

          {/* Progress Text */}
          <div
            className="text-center fw-semibold mt-2"
            style={{
              color: getStrokeColor(),
              fontSize: "0.9rem",
              wordBreak: "break-word",
            }}
          >
            {progress}%
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Profilepic
          show={isModalOpen}
          onClose={closeModal}
          imageSrc={imageSrc}
          setReload={setReload}
          setError_main={setError}
          setSuccess_main={setSuccess}
        />
      )}
    </>
  );
};

export default CircularProgress;
