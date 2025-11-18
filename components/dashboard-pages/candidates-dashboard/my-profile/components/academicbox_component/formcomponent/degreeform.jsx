import React, { useState, useEffect } from "react";
import UploadButton from "../UploadButton";
import SearchableInput from "../SearchableInput";

const DegreeForm = ({
  formData,
  setFormData,
  handleChange,
  stateselected,
  university,
  handleSearchChange,
  universityselected,
  collegeselected,
  collegeSearch,
  setCollegeSearch,
  filteredColleges,
  setFilteredColleges,
  colleges,
  handleSelect,
  courseSearch,
  setCourseSearch,
  filteredCourses,
  setFilteredCourses,
  courses,
  course_mode,
  grading_systems,
  handleTranscriptChange,
  handleCertificateChange,
  handleFocus,
  handleBlur,
  isFocused,
  setIsFocused,
  universitySearch,
  setUniversitySearch,
  filteredUniversity,
  setFilteredUniversity,
}) => {
  return (
    <>
      {!stateselected && (
        <div className="col-md-12">
          <span style={{ color: "red" }}>Please select a state</span>
        </div>
      )}
      <div
        className="row mt-3"
        style={{
          pointerEvents: !stateselected ? "none" : "auto",
          opacity: !stateselected ? 0.5 : 1,
        }}
      >
        <SearchableInput
          label="University Name"
          name="university"
          value={formData.university || universitySearch}
          onChange={(e) => {
            handleSearchChange(
              e,
              setUniversitySearch,
              setFilteredUniversity,
              university
            );
            handleChange(e);
          }}
          options={filteredUniversity}
          onSelect={(value) => {
            handleSelect(value, setUniversitySearch, setFilteredUniversity);
            setFormData({ ...formData, university: value });
          }}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          setFormData={setFormData}
          formData={formData}
        />

        <div
          style={{
            pointerEvents: !universityselected ? "none" : "auto",
            opacity: !universityselected ? 0.5 : 1,
          }}
        >
          {" "}
          {/* Searchable Inputs */}
          <SearchableInput
            label="Institute Name"
            name="institute_name"
            value={formData.institute_name || collegeSearch}
            onChange={(e) => {
              handleSearchChange(
                e,
                setCollegeSearch,
                setFilteredColleges,
                colleges
              );
              handleChange(e);
            }}
            options={filteredColleges}
            onSelect={(value) => {
              handleSelect(value, setCollegeSearch, setFilteredColleges);
              setFormData({ ...formData, institute_name: value });
            }}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            setFormData={setFormData}
            formData={formData}
          />
          <div
            style={{
              pointerEvents: !collegeselected ? "none" : "auto",
              opacity: !collegeselected ? 0.5 : 1,
            }}
          >
            <SearchableInput
              label="Course Name"
              name="course_name"
              value={formData.course_name || courseSearch}
              onChange={(e) => {
                handleSearchChange(
                  e,
                  setCourseSearch,
                  setFilteredCourses,
                  courses
                );
                handleChange(e);
              }}
              options={filteredCourses}
              onSelect={(value) => {
                handleSelect(value, setCourseSearch, setFilteredCourses);
                setFormData({ ...formData, course_name: value });
              }}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              setFormData={setFormData}
              formData={formData}
            />
            <div className="form-group">
              <label>
                Course Type
                <span style={{ color: "red" }}>*</span>
              </label>

              {course_mode?.map((item) => (
                <div key={item.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="course_type"
                    value={item.id}
                    checked={formData.course_type == item.id}
                    onChange={handleChange}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="form-group row align-items-center mt-2">
          <label className="col-12">
            Course Start and End Year
            <span style={{ color: "red" }}>*</span>
          </label>
          <div className="col-md-5">
            <select
              className="form-control"
              name="start_year"
              value={formData.start_year || ""}
              onChange={handleChange}
            >
              <option value="">Select Start Year</option>
              {Array.from({ length: 50 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                const isDisabled =
                  formData.end_year &&
                  parseInt(year) > parseInt(formData.end_year);

                return (
                  !isDisabled && (
                    <option key={year} value={year} disabled={isDisabled}>
                      {year}
                    </option>
                  )
                );
              })}
            </select>
          </div>
          <div className="col-md-2 d-flex justify-content-center align-items-center">
            <strong>To</strong>
          </div>
          <div className="col-md-5">
            <select
              className="form-control"
              name="end_year"
              value={formData.end_year || ""}
              onChange={handleChange}
            >
              <option value="">Select End Year</option>
              {Array.from({ length: 46 }, (_, i) => {
                const year = new Date().getFullYear() + 5 - i;
                const isDisabled =
                  formData.start_year &&
                  parseInt(year) < parseInt(formData.start_year);

                return (
                  !isDisabled && (
                    <option key={year} value={year} disabled={isDisabled}>
                      {year}
                    </option>
                  )
                );
              })}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>
                Grading System
                <span style={{ color: "red" }}>*</span>
              </label>
              {/* drop down */}
              <select
                className="form-control"
                name="grading_system"
                onChange={handleChange}
                value={formData.grading_system}
              >
                <option>Select Grading System</option>
                {grading_systems.map((grading_system) => (
                  <option key={grading_system.id} value={grading_system.id}>
                    {grading_system.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label>
                Marks
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="marks"
                value={formData.marks}
                placeholder="Enter Marks"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {formData.level == 3 || formData.level == 5 ? (
          <div className="form-group">
            <input
              type="checkbox"
              name="is_primary"
              checked={formData.is_primary}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_primary: e.target.checked, // true if checked, false if unchecked
                }))
              }
            />
            <label> Make this as my primary graduation/diploma</label>
          </div>
        ) : null}

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

export default DegreeForm;
