import React, { useState, useEffect } from "react";
import { BadgeCheck, BadgeAlert } from "lucide-react";
import { Info } from "lucide-react";
const ClgDisplay = ({ data, openModalRH }) => {
  return (
    <>
      <div className="resume-item emp-list pb-3">
        <div className="item title typ-14Bold">
          <span className="truncate emp-desg">
            <strong onClick={() => console.log("test: ", data)}>
              {data?.level}
              {data.level_verified ? (
                <BadgeCheck size={20} color="green" className="ms-2" />
              ) : (
                <BadgeAlert size={20} color="red" className="ms-2" />
              )}
            </strong>{" "}
            {/* Edit or Remarks */}
            {!data.is_verified ? (
              <i
                className="la la-pencil-alt ms-2"
                onClick={() => openModalRH(data.level_id, data._id)}
                style={{ cursor: "pointer" }}
                title="Edit details"
              ></i>
            ) : (
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={data.remarks || "No remarks"}
                style={{ cursor: "pointer" }}
              >
                <Info size={20} color="green" className="ms-2" />
              </span>
            )}
            <br />
            {data?.courseName}
            {data.courseName_verified ? (
              <BadgeCheck size={20} color="green" className="ms-2" />
            ) : (
              <BadgeAlert size={20} color="red" className="ms-2" />
            )}
          </span>
        </div>

        <div className="item experienceType typ-14Regular">
          <span className="truncate expType">
            {data.instituteName}
            {data.is_verified ? (
              <BadgeCheck size={20} color="green" className="ms-2" />
            ) : (
              <BadgeAlert size={20} color="red" className="ms-2" />
            )}
          </span>
          <br />
          <span className="truncate expType">{data.universityName}</span>
          <br />
          <span className="truncate">
            {data.duration.from}-{data.duration.to}{" "}
            {data.duration_verified ? (
              <BadgeCheck size={20} color="green" className="ms-2" />
            ) : (
              <BadgeAlert size={20} color="red" className="ms-2" />
            )}
            {""} | {data.courseType}{" "}
            {data.courseType_verified ? (
              <BadgeCheck size={20} color="green" className="ms-2" />
            ) : (
              <BadgeAlert size={20} color="red" className="ms-2" />
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default ClgDisplay;
