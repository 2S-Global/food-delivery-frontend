import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Profilepic from "../modal/ChangeProfilepic";
import { Camera } from "lucide-react";
const CircularProgress = ({
  progress,
  imageSrc,
  setReload,
  setError,
  setSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalRH = () => setIsModalOpen(true);
  const closeModalRH = () => setIsModalOpen(false);

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
            <div
              onClick={openModalRH}
              className="position-relative mx-auto"
              style={{
                width: "80%",
                aspectRatio: 1,
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={imageSrc || "/images/resource/no_user.png"}
                alt="Profile"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                Replace
              </div>
            </div>
          </CircularProgressbarWithChildren>

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
          onClose={closeModalRH}
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
