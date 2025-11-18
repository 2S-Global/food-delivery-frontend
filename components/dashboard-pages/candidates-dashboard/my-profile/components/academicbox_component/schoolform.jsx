import React, { useState, useEffect } from "react";
import UploadButton from "./UploadButton";
const SchoolForm = ({
  item,
  handleChange,
  transcriptFile,
  formData,
  setFormData,
  setTranscriptFile,
  certificateFile,
  setCertificateFile,
  listboard,
  listmedium,
  stateselected,
}) => {
  return (
    <>
      {!stateselected && (
        <div className="col-md-12">
          <span style={{ color: "red" }}>Please select a state</span>
        </div>
      )}
      <div
        className="row"
        style={{
          pointerEvents: !stateselected ? "none" : "auto",
          opacity: !stateselected ? 0.5 : 1,
        }}
      >
        <div className="form-group ">
          <label>
            Board
            <span style={{ color: "red" }}>*</span>
          </label>
          <select
            className="form-control"
            value={formData.board}
            onChange={(e) => handleChange(item.id, "board", e.target.value)}
          >
            <option>Select Board</option>
            {listboard.map((board) => (
              <option key={board.id} value={board.id}>
                {board.board_name}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label>
              Year of Passing
              <span style={{ color: "red" }}>*</span>
            </label>

            <select
              className="form-control"
              onChange={(e) =>
                handleChange(item.id, "year_of_passing", e.target.value)
              }
              value={formData.year_of_passing}
            >
              <option>Select Year</option>
              {Array.from(
                { length: 61 },
                (_, i) => new Date().getFullYear() - 50 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {/* school medium */}
          <div className="form-group col-md-6">
            <label>
              Medium of Education
              <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form-control"
              onChange={(e) => handleChange(item.id, "medium", e.target.value)}
              value={formData.medium}
            >
              <option>Select Medium</option>
              {listmedium.map((medium) => (
                <option key={medium.id} value={medium.id}>
                  {medium.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* marks */}
        <div className="form-group ">
          <label>
            Marks
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Marks"
            onChange={(e) => handleChange(item.id, "marks", e.target.value)}
            value={formData.marks}
          />
        </div>
        {item.level == 2 && (
          <>
            <div className="row">
              <div className="form-group col-md-6">
                <label>
                  Marks in English
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Marks in English"
                  onChange={(e) =>
                    handleChange(item.id, "eng_marks", e.target.value)
                  }
                  value={formData.eng_marks}
                />
              </div>
              <div className="form-group col-md-6">
                <label>
                  Marks in Math
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Marks in Math"
                  value={formData.math_marks}
                  onChange={(e) =>
                    handleChange(item.id, "math_marks", e.target.value)
                  }
                />
              </div>
            </div>
          </>
        )}

        {/* Upload Buttons */}
        <div className="form-group col-lg-6">
          <label>
            Upload Transcript
            <span style={{ color: "red" }}>*</span>
          </label>
          <UploadButton
            label="Transcript"
            id={`transcript-${item.id}`}
            file={formData.transcript}
            onChange={(e) =>
              setFormData({ ...formData, transcript: e.target.files[0] })
            }
            accept="image/*, .pdf"
            width="150px"
          />
        </div>

        <div className="form-group col-lg-6">
          <label>
            Upload Certificate
            <span style={{ color: "red" }}>*</span>
          </label>
          <UploadButton
            width="150px"
            label="Certificate"
            id={`certificate-${item.id}`}
            file={formData.certificate}
            onChange={(e) =>
              setFormData({ ...formData, certificate: e.target.files[0] })
            }
            accept="image/*, .pdf"
          />
        </div>
      </div>
    </>
  );
};

export default SchoolForm;
