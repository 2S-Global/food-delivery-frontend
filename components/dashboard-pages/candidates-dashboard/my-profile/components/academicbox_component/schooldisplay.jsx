import React, { useState, useEffect } from "react";

const SchoolDisplay = ({ data, openModalRH }) => {
  // console.log("inside display :", data);
  return (
    <>
      <div className="resume-item emp-list pb-3">
        <div className="item title typ-14Bold">
          <span className="truncate emp-desg">
            <strong>{data?.level}</strong>
          </span>
          <i
            className="la la-pencil-alt"
            onClick={() => openModalRH(data.level_id, data._id)}
            style={{ cursor: "pointer" }}
          ></i>
        </div>

        <div className="item experienceType typ-14Regular">
          <span className="truncate expType">{data.board}</span>
          <br />
          <span className="truncate">{data.year_of_passing}</span>
        </div>
      </div>
    </>
  );
};

export default SchoolDisplay;
