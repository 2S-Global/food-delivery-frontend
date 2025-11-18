import React, { useState, useEffect } from "react";
import UploadButton from "./UploadButton";
import SearchableInput from "./SearchableInput";
const DegreeForm = ({
  item,
  handleChange,
  transcriptFile,
  setTranscriptFile,
  certificateFile,
  setCertificateFile,
  diploma_st_uni,
  collegeSearch,
  setCollegeSearch,
  courseSearch,
  setCourseSearch,
  filteredColleges,
  setFilteredColleges,
  filteredCourses,
  setFilteredCourses,
  specializations,
  grading_systems,
  university,
  handleSearchChange,
  handleSelect,
  colleges,
  courses,
  formData,
  setFormData,
  course_mode,
  stateselected,
  universityselected,
  collegeselected,
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
            University Name
            <span style={{ color: "red" }}>*</span>
          </label>
          <select
            className="form-control"
            onChange={(e) =>
              handleChange(item.id, "university", e.target.value)
            }
            value={formData.university}
          >
            <option>Select University</option>
            {university.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            pointerEvents: !universityselected ? "none" : "auto",
            opacity: !universityselected ? 0.5 : 1,
          }}
        >
          {/* Searchable Inputs */}
          <SearchableInput
            label="Institute name"
            value={collegeSearch}
            onChange={(e) =>
              handleSearchChange(
                e,
                setCollegeSearch,
                setFilteredColleges,
                colleges
              )
            }
            options={filteredColleges}
            onSelect={(value) => {
              handleSelect(value, setCollegeSearch, setFilteredColleges);
              setFormData({ ...formData, institute_name: value });
            }}
          />
          {!collegeselected && (
            <div className="col-md-12">
              <span style={{ color: "red" }}>Please select a college</span>
            </div>
          )}
          <SearchableInput
            label="Course Name"
            value={courseSearch}
            onChange={(e) =>
              handleSearchChange(
                e,
                setCourseSearch,
                setFilteredCourses,
                courses
              )
            }
            options={filteredCourses}
            onSelect={(value) => {
              handleSelect(value, setCourseSearch, setFilteredCourses);
              setFormData({ ...formData, course_name: value });
            }}
          />

          {/* Specialization */}
          {/* <div className="form-group">
        <label>Specialization</label>
        
        <select
          className="form-control"
          onChange={(e) =>
            handleChange(item.id, "specialization", e.target.value)
          }
        >
          <option>Select Specialization</option>
          {specializations.map((specialization) => (
            <option key={specialization} value={specialization}>
              {specialization}
            </option>
          ))}
        </select>
      </div> */}
          {/* course type radio button */}
          <div className="form-group">
            <label>
              Course Type
              <span style={{ color: "red" }}>*</span>
            </label>
            {course_mode.map((type) => (
              <div className="form-check" key={type.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="course_type"
                  id={`course_type-${type.id}`}
                  value={type.id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      course_type: parseInt(e.target.value),
                    }))
                  }
                  checked={parseInt(formData.course_type) == parseInt(type.id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`course_type-${type.id}`}
                >
                  {type.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* Course Duration */}
        <div className="form-group row align-items-center">
          <label className="col-12">
            Course Duration
            <span style={{ color: "red" }}>*</span>
          </label>

          {/* Start Year */}
          <div className="col-sm-5">
            <select
              className="form-control"
              onChange={(e) =>
                handleChange(item.id, "start_year", e.target.value)
              }
              value={formData.start_year || ""}
            >
              <option value="">Select Year</option>
              {[...Array(26)].map((_, i) => {
                const year = 2000 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* "To" centered horizontally & vertically */}
          <div className="col-sm-2 d-flex justify-content-center align-items-center">
            <strong>To</strong>
          </div>

          {/* End Year - Right Aligned */}
          <div className="col-sm-5 text-right">
            <select
              className="form-control"
              onChange={(e) =>
                handleChange(item.id, "end_year", e.target.value)
              }
              value={formData.end_year || ""}
            >
              <option value="">Select Year</option>
              {[...Array(26)].map((_, i) => {
                const year = 2000 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Grading system drop down */}
        <div className="form-group">
          <label>
            Grading System
            <span style={{ color: "red" }}>*</span>
          </label>
          {/* drop down */}
          <select
            className="form-control"
            onChange={(e) =>
              handleChange(item.id, "grading_system", e.target.value)
            }
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
        {/* Marks */}
        <div className="form-group">
          <label>
            Marks
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Marks"
            onChange={(e) => handleChange(item.id, "marks", e.target.value)}
          />
        </div>
        {/* checkbox */}
        <div className="form-group">
          <input
            type="checkbox"
            value="1"
            onChange={(e) =>
              handleChange(item.id, "is_primary", e.target.checked)
            }
          />
          <label> Make this as my primary graduation/diploma</label>
        </div>

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

export default DegreeForm;
