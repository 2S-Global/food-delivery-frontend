import React, { useState, useEffect } from "react";
import UploadButton from "../UploadButton";
import SearchableInput from "../SearchableInput";
const SchoolForm = ({
  formData,
  setFormData,
  handleChange,
  listboard,
  listmedium,
  stateselected,
  handleTranscriptChange,
  handleCertificateChange,
  handleFocus,
  handleBlur,
  isFocused,
  setIsFocused,
  boardSearch,
  setBoardSearch,
  handleSearchChange,
  filteredBoard,
  setFilteredBoard,
  handleSelect,
  schoolSearch,
  setSchoolSearch,
  filteredSchools,
  setFilteredSchools,
  schools,
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
        <SearchableInput
          label="Board"
          name="board"
          value={formData.board || boardSearch}
          onChange={(e) => {
            handleSearchChange(e, setBoardSearch, setFilteredBoard, listboard);
            handleChange(e);
          }}
          options={filteredBoard}
          onSelect={(value) => {
            handleSelect(value, setBoardSearch, setFilteredBoard);
            setFormData((prevFormData) => ({
              ...prevFormData,
              board: value,
            }));
          }}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        />

        {/*  <SearchableInput
          label="School Name"
          name="school_name"
          value={formData.school_name || schoolSearch}
          onChange={(e) => {
            handleSearchChange(e, setSchoolSearch, setFilteredSchools, schools);
            handleChange(e);
          }}
          options={filteredSchools}
          onSelect={(value) => {
            handleSelect(value, setSchoolSearch, setFilteredSchools);
            setFormData((prevFormData) => ({
              ...prevFormData,
              school_name: value,
            }));
          }}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        /> */}

        <div className="row">
          <div className="form-group col-md-6">
            <label>
              Year of Passing
              <span style={{ color: "red" }}>*</span>
            </label>

            <select
              className="form-control"
              name="year_of_passing"
              onChange={handleChange}
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
              name="medium"
              onChange={handleChange}
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
        <div className="form-group">
          <label>
            Marks (%)
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="marks"
            placeholder="Enter Marks"
            onChange={handleChange}
            value={formData.marks}
          />
        </div>
        {formData.level == 2 && (
          <>
            <div className="row">
              <div className="form-group col-md-6">
                <label>
                  Marks in English (%)
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="eng_marks"
                  placeholder="Enter Marks"
                  onChange={handleChange}
                  value={formData.eng_marks}
                />
              </div>
              <div className="form-group col-md-6">
                <label>
                  Marks in Math (%)
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="math_marks"
                  placeholder="Enter Marks"
                  onChange={handleChange}
                  value={formData.math_marks}
                />
              </div>
            </div>
          </>
        )}
        <div className="form-group col-lg-6">
          <label>Transcript</label>
          <UploadButton
            label="Upload"
            id="transcript"
            name="transcript"
            file={formData.transcript}
            onChange={handleTranscriptChange}
            accept="image/*, .pdf"
            width="200px"
            image={formData.transcriptPreview}
          />
        </div>
        <div className="form-group col-lg-6">
          <label>Certificate</label>
          <UploadButton
            label="Upload"
            id="certificate"
            name="certificate"
            width="200px"
            file={formData.certificate}
            onChange={handleCertificateChange}
            accept="image/*, .pdf"
            image={formData.certificatePreview}
          />
        </div>
      </div>
    </>
  );
};

export default SchoolForm;
