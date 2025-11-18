"use client";

import { useState } from "react";

const colleges = [
  "College 1",
  "College 2",
  "College 3",
  "College of Engineering",
  "National Institute of Technology",
  "Indian Institute of Technology",
];
const courses = [
  "Course 1",
  "Course 2",
  "Course 3",
  "Btech",
  "Mtech",
  "MBA",
  "BBA",
  "BCA",
  "MCA",
  "BSc",
  "MSc",
  "BCom",
  "MCom",
];

const AcademicBox = () => {
  const [logoImg, setLogoImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [filteredColleges, setFilteredColleges] = useState(colleges);
  const [filteredCourses, setFilteredCourses] = useState(courses);

  // File Handlers
  const handleLogoUpload = (e) => setLogoImg(e.target.files[0]);
  const handleCoverUpload = (e) => setCoverImg(e.target.files[0]);

  // Search Handlers
  const handleCollegeSearch = (e) => {
    const value = e.target.value;
    setCollegeSearch(value);
    setFilteredColleges(
      colleges.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  const handleCourseSearch = (e) => {
    const value = e.target.value;
    setCourseSearch(value);
    setFilteredCourses(
      courses.filter((course) =>
        course.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  // Selection Handlers
  const handleCollegeSelect = (college) => {
    setCollegeSearch(college);
    setFilteredColleges([]);
  };

  const handleCourseSelect = (course) => {
    setCourseSearch(course);
    setFilteredCourses([]);
  };

  // Reusable Searchable Input Field
  const SearchableInput = ({ label, value, onChange, options, onSelect }) => (
    <div className="form-group col-lg-4 col-md-6 position-relative">
      <label>{label}</label>
      <input
        type="text"
        className="form-control"
        placeholder={`Search ${label}`}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
      {options.length > 0 && value && (
        <ul
          className="dropdown-menu show"
          style={{ position: "absolute", width: "100%" }}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const UploadButton = ({ label, id, file, onChange, accept }) => (
    <div className="form-group col-lg-4 col-md-12">
      <label htmlFor={id}>{label}</label>
      <div className="uploadButton">
        <input
          className="uploadButton-input"
          type="file"
          id={id}
          accept={accept}
          onChange={onChange}
          required
        />
        <label className="uploadButton-button ripple-effect" htmlFor={id}>
          {file ? file.name : "Browse Transcript.."}
        </label>
      </div>
    </div>
  );

  return (
    <form className="default-form">
      {/* Class X */}
      <div className="row">
        <h3 className="text-center pb-2">Class X</h3>

        {/* Board */}
        <div className="form-group col-lg-4 col-md-12">
          <label htmlFor="classXBoard">Class X Board</label>
          <select
            id="classXBoard"
            name="classXBoard"
            className="form-control"
            required
          >
            <option value="">Select Board</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="State Board">State Board</option>
          </select>
        </div>

        {/* Percentage */}
        <div className="form-group col-lg-4 col-md-12">
          <label htmlFor="classXPercentage">Percentage</label>
          <input
            type="text"
            id="classXPercentage"
            name="classXPercentage"
            className="form-control"
            placeholder="Enter Percentage"
          />
        </div>

        {/* Transcript Upload */}
        <UploadButton
          label="Transcript"
          id="classXTranscript"
          file={logoImg}
          onChange={(e) => setLogoImg(e.target.files[0])}
          accept="image/*, .pdf"
        />
      </div>

      {/* Class XII */}
      <div className="row">
        <h3 className="text-center pb-2">Class XII</h3>

        {/* Board */}
        <div className="form-group col-lg-4 col-md-12">
          <label htmlFor="classXIIBoard">Class XII Board</label>
          <select
            id="classXIIBoard"
            name="classXIIBoard"
            className="form-control"
            required
          >
            <option value="">Select Board</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ISC</option>
            <option value="State Board">State Board</option>
          </select>
        </div>

        {/* Percentage */}
        <div className="form-group col-lg-4 col-md-12">
          <label htmlFor="classXIIPercentage">Percentage</label>
          <input
            type="text"
            id="classXIIPercentage"
            name="classXIIPercentage"
            className="form-control"
            placeholder="Enter Percentage"
          />
        </div>

        {/* Transcript Upload */}
        <UploadButton
          label="Transcript"
          id="classXTranscript"
          file={logoImg}
          onChange={(e) => setLogoImg(e.target.files[0])}
          accept="image/*, .pdf"
        />
      </div>

      {/* Diploma */}
      <div className="row">
        <h3 className="text-center pb-2">Diploma</h3>

        {/* College Name (Searchable) */}
        <SearchableInput
          label="College Name"
          value={collegeSearch}
          onChange={handleCollegeSearch}
          options={filteredColleges}
          onSelect={handleCollegeSelect}
        />
        <SearchableInput
          label="Course Name"
          value={courseSearch}
          onChange={handleCourseSearch}
          options={filteredCourses}
          onSelect={handleCourseSelect}
        />

        {/* Percentage */}
        <div className="form-group col-lg-4 col-md-6">
          <label htmlFor="diplomaPercentage">Percentage</label>
          <input
            type="text"
            id="diplomaPercentage"
            name="diplomaPercentage"
            className="form-control"
            placeholder="Enter Percentage"
            required
          />
        </div>

        {/* Transcript Upload */}
        <UploadButton
          label="Transcript"
          id="classXTranscript"
          file={logoImg}
          onChange={(e) => setLogoImg(e.target.files[0])}
          accept="image/*, .pdf"
        />
      </div>

      {/* Becelors */}
      <div className="row">
        <h3 className="text-center pb-2">Bachelor </h3>

        <SearchableInput
          label="College Name"
          value={collegeSearch}
          onChange={handleCollegeSearch}
          options={filteredColleges}
          onSelect={handleCollegeSelect}
        />
        <SearchableInput
          label="Course Name"
          value={courseSearch}
          onChange={handleCourseSearch}
          options={filteredCourses}
          onSelect={handleCourseSelect}
        />

        {/* Percentage */}
        <div className="form-group col-lg-4 col-md-6">
          <label htmlFor="diplomaPercentage">Percentage</label>
          <input
            type="text"
            id="diplomaPercentage"
            name="diplomaPercentage"
            className="form-control"
            placeholder="Enter Percentage"
            required
          />
        </div>

        {/* Transcript Upload */}
        <div className="form-group col-lg-4 col-md-12">
          <label htmlFor="diplomaTranscript">Transcript</label>
          <div className="uploadButton">
            <input
              className="uploadButton-input"
              type="file"
              accept="image/*, .pdf"
              id="diplomaTranscript"
              required
              onChange={(e) => coverHandler(e.target.files[0])}
            />
            <label
              className="uploadButton-button ripple-effect"
              htmlFor="diplomaTranscript"
            >
              {coverImg ? coverImg.name : "Browse Transcript.."}
            </label>
          </div>
        </div>
      </div>

      {/* Masters */}
      <div className="row">
        <h3 className="text-center pb-2">Masters</h3>

        {/* College Name (Searchable) */}
        <SearchableInput
          label="College Name"
          value={collegeSearch}
          onChange={handleCollegeSearch}
          options={filteredColleges}
          onSelect={handleCollegeSelect}
        />
        <SearchableInput
          label="Course Name"
          value={courseSearch}
          onChange={handleCourseSearch}
          options={filteredCourses}
          onSelect={handleCourseSelect}
        />

        {/* Percentage */}
        <div className="form-group col-lg-4 col-md-6">
          <label htmlFor="diplomaPercentage">Percentage</label>
          <input
            type="text"
            id="diplomaPercentage"
            name="diplomaPercentage"
            className="form-control"
            placeholder="Enter Percentage"
            required
          />
        </div>

        {/* Transcript Upload */}
        <UploadButton
          label="Transcript"
          id="classXTranscript"
          file={logoImg}
          onChange={(e) => setLogoImg(e.target.files[0])}
          accept="image/*, .pdf"
        />
      </div>
    </form>
  );
};

export default AcademicBox;
